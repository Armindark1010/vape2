import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AccountType,
  EntryType,
  order_status,
  SettlementStatus,
} from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SettlementsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 1. Generate weekly settlement batch for a supplier
   * Aggregates all paid, unsettled orders up to cutoff date
   */
  async generateWeeklySettlement(supplierId: number, periodStart: Date, periodEnd: Date) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id: supplierId },
    });

    if (!supplier) {
      throw new NotFoundException('تأمین‌کننده یافت نشد');
    }

    // Find all paid, unsettled order items for this supplier
    const unsettledItems = await this.prisma.orderItem.findMany({
      where: {
        product: { supplierId },
        order: {
          status: { in: [order_status.paid, order_status.delivered] },
          isSettled: false,
          createdAt: {
            gte: periodStart,
            lte: periodEnd,
          },
        },
      },
      include: {
        order: true,
      },
    });

    if (unsettledItems.length === 0) {
      throw new BadRequestException('هیچ سفارش پرداخت‌شده و تسویه‌نشده‌ای در این بازه زمانی یافت نشد');
    }

    // Group items by order
    const ordersMap = new Map<number, { order: any; gross: number }>();
    for (const it of unsettledItems) {
      const lineGross = it.price * it.qty;
      const ex = ordersMap.get(it.order.id);
      if (ex) {
        ex.gross += lineGross;
      } else {
        ordersMap.set(it.order.id, { order: it.order, gross: lineGross });
      }
    }

    let totalSales = 0;
    let totalCommission = 0;
    const batchNumber = `SETTLE-${new Date().getFullYear()}-W${Math.ceil(new Date().getDate() / 7)}-${supplier.id}-${Date.now().toString().slice(-4)}`;

    return this.prisma.$transaction(async (tx) => {
      const settlementItemsData: any[] = [];

      for (const [orderId, { order, gross }] of ordersMap.entries()) {
        const commRate = supplier.commissionRate ?? order.platformCommissionRate ?? 10;
        const comm = Math.round((gross * commRate) / 100);
        const payable = gross - comm;

        totalSales += gross;
        totalCommission += comm;

        settlementItemsData.push({
          orderId,
          orderGrossAmount: gross,
          commissionDeducted: comm,
          supplierPayable: payable,
        });

        // Mark order as settled
        await tx.order.update({
          where: { id: orderId },
          data: { isSettled: true },
        });
      }

      const netPayable = totalSales - totalCommission;

      const settlement = await tx.supplierSettlement.create({
        data: {
          supplierId,
          batchNumber,
          periodStart,
          periodEnd,
          totalSalesAmount: totalSales,
          totalCommissionDeducted: totalCommission,
          netPayableAmount: netPayable,
          currency: 'IRT',
          status: SettlementStatus.PENDING_REVIEW,
          items: {
            create: settlementItemsData,
          },
        },
        include: {
          items: true,
        },
      });

      return settlement;
    });
  }

  /**
   * 2. Admin Approve Settlement
   */
  async approveSettlement(settlementId: number, adminId: number) {
    const settlement = await this.prisma.supplierSettlement.findUnique({
      where: { id: settlementId },
    });

    if (!settlement) throw new NotFoundException('شناسه صورت‌حساب تسویه یافت نشد');
    if (settlement.status !== SettlementStatus.PENDING_REVIEW) {
      throw new ConflictException(`وضعیت تسویه قابل تأیید نیست: ${settlement.status}`);
    }

    return this.prisma.supplierSettlement.update({
      where: { id: settlementId },
      data: {
        status: SettlementStatus.APPROVED,
        approvedByAdminId: adminId,
      },
    });
  }

  /**
   * 3. Admin Mark Settlement as Paid (with Paya/Satna Tracking Reference)
   * Appends financial journal records
   */
  async markSettlementAsPaid(settlementId: number, payoutReference: string) {
    return this.prisma.$transaction(async (tx) => {
      const settlement = await tx.supplierSettlement.findUnique({
        where: { id: settlementId },
        include: { supplier: true },
      });

      if (!settlement) throw new NotFoundException('شناسه صورت‌حساب تسویه یافت نشد');
      if (settlement.status === SettlementStatus.PAID) {
        return { success: true, message: 'این دوره قبلاً تسویه و پرداخت شده است', settlement };
      }

      const updated = await tx.supplierSettlement.update({
        where: { id: settlementId },
        data: {
          status: SettlementStatus.PAID,
          payoutReference,
          settledAt: new Date(),
        },
      });

      // Append immutable journal entry
      // Debit Supplier Liability (Clearing debt to supplier)
      await tx.transactionJournal.create({
        data: {
          accountType: AccountType.LIABILITY_SUPPLIER,
          entryType: EntryType.DEBIT,
          amount: settlement.netPayableAmount,
          currency: settlement.currency,
          description: `تسویه حساب پایا/ساتنا برای ${settlement.supplier.companyName} (دوره ${settlement.batchNumber}، کد رهگیری: ${payoutReference})`,
        },
      });

      return updated;
    });
  }

  /**
   * 4. List all settlements (Admin)
   */
  async listAllSettlements() {
    return this.prisma.supplierSettlement.findMany({
      include: {
        supplier: { select: { id: true, companyName: true, iban: true } },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}


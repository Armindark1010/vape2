import { PrismaClient, InventoryMovementType } from '@prisma/client';

const prisma = new PrismaClient();

async function runE2ETest() {
  console.log('🚀 Starting Comprehensive E2E Test for Product Management & Variants Matrix...\n');

  try {
    // 1. Get Category, Brand, and ProductType
    const category = await prisma.category.findFirst();
    const brand = await prisma.brand.findFirst();
    const disposableType = await prisma.productType.findUnique({
      where: { slug: 'disposable-vape' },
      include: { attributes: true },
    });

    if (!category || !brand || !disposableType) {
      throw new Error('Missing seed data (category, brand, or disposableType)');
    }

    console.log(`✅ Loaded Product Type: ${disposableType.name} (ID: ${disposableType.id})`);
    console.log(`   Associated Dynamic Attributes: ${disposableType.attributes.length}`);

    // 2. Prepare Product Data with dynamic specs & 4 variants
    const testSkuBase = `OXB-${Date.now().toString().slice(-4)}`;
    const testProductName = `تست ویپ اکسبار مجیک ${Date.now().toString().slice(-4)}`;

    const variantsData = [
      {
        title: 'بلوبری آیس / ۲۰ میلی‌گرم',
        sku: `${testSkuBase}-NIC20-BLU`,
        combinationHash: 'flavor:blueberry-ice|nicotine:20mg',
        combination: { flavor: 'Blueberry Ice', nicotine: '20mg' },
        price: 450000,
        compareAtPrice: 500000,
        stock: 15,
        attributeValues: [
          { attributeCode: 'nicotine', value: '20mg' },
          { attributeCode: 'flavor', value: 'Blueberry Ice' },
        ],
      },
      {
        title: 'انبه فریز / ۲۰ میلی‌گرم',
        sku: `${testSkuBase}-NIC20-MNG`,
        combinationHash: 'flavor:mango-freeze|nicotine:20mg',
        combination: { flavor: 'Mango Freeze', nicotine: '20mg' },
        price: 450000,
        compareAtPrice: 500000,
        stock: 20,
        attributeValues: [
          { attributeCode: 'nicotine', value: '20mg' },
          { attributeCode: 'flavor', value: 'Mango Freeze' },
        ],
      },
      {
        title: 'بلوبری آیس / ۵۰ میلی‌گرم',
        sku: `${testSkuBase}-NIC50-BLU`,
        combinationHash: 'flavor:blueberry-ice|nicotine:50mg',
        combination: { flavor: 'Blueberry Ice', nicotine: '50mg' },
        price: 470000,
        compareAtPrice: 520000,
        stock: 10,
        attributeValues: [
          { attributeCode: 'nicotine', value: '50mg' },
          { attributeCode: 'flavor', value: 'Blueberry Ice' },
        ],
      },
      {
        title: 'انبه فریز / ۵۰ میلی‌گرم',
        sku: `${testSkuBase}-NIC50-MNG`,
        combinationHash: 'flavor:mango-freeze|nicotine:50mg',
        combination: { flavor: 'Mango Freeze', nicotine: '50mg' },
        price: 470000,
        compareAtPrice: 520000,
        stock: 25,
        attributeValues: [
          { attributeCode: 'nicotine', value: '50mg' },
          { attributeCode: 'flavor', value: 'Mango Freeze' },
        ],
      },
    ];

    const totalStock = variantsData.reduce((acc, v) => acc + v.stock, 0); // 70

    // 3. Create Product in DB
    const createdProduct = await prisma.$transaction(async (tx) => {
      const p = await tx.product.create({
        data: {
          name: testProductName,
          slug: `test-oxbar-${Date.now()}`,
          description: 'توضیحات تستی برای بررسی جامع تنوع‌ها و ویژگی‌های پویا',
          shortDescription: 'پاد یکبارمصرف پیشرفته با کام‌دهی فوق‌العاده',
          price: 450000,
          compareAtPrice: 500000,
          stock: totalStock,
          categoryId: category.id,
          brandId: brand.id,
          productTypeId: disposableType.id,
          sku: `${testSkuBase}-MAIN`,
          attributeValues: {
            create: [
              { attributeId: disposableType.attributes.find(a => a.code === 'puff_count')!.id, value: '15000' },
              { attributeId: disposableType.attributes.find(a => a.code === 'battery_capacity')!.id, value: '650' },
              { attributeId: disposableType.attributes.find(a => a.code === 'coil_type')!.id, value: 'Mesh Coil' },
              { attributeId: disposableType.attributes.find(a => a.code === 'rechargeable')!.id, value: 'true' },
            ],
          },
        },
      });

      for (const v of variantsData) {
        const variant = await tx.productVariant.create({
          data: {
            productId: p.id,
            title: v.title,
            sku: v.sku,
            combinationHash: v.combinationHash,
            combination: v.combination,
            price: v.price,
            compareAtPrice: v.compareAtPrice,
            stock: v.stock,
            reservedQuantity: 0,
            attributeValues: {
              create: v.attributeValues.map(av => ({
                attributeId: disposableType.attributes.find(a => a.code === av.attributeCode)!.id,
                value: av.value,
              })),
            },
          },
        });

        // Initial inventory movement
        await tx.inventoryMovement.create({
          data: {
            productId: p.id,
            variantId: variant.id,
            type: InventoryMovementType.PURCHASE_RECEIPT,
            delta: v.stock,
            stockBefore: 0,
            stockAfter: v.stock,
            reason: 'موجودی اولیه هنگام ایجاد محصول',
          },
        });
      }

      return tx.product.findUnique({
        where: { id: p.id },
        include: {
          variants: {
            include: {
              attributeValues: {
                include: { attribute: true },
              },
            },
          },
          attributeValues: {
            include: { attribute: true },
          },
          inventoryMovements: true,
        },
      });
    });

    if (!createdProduct) throw new Error('Product creation failed');

    console.log(`✅ Product created: ${createdProduct.name} (ID: ${createdProduct.id})`);
    console.log(`   Total Stock: ${createdProduct.stock}`);
    console.log(`   Variants Count: ${createdProduct.variants.length}`);
    console.log(`   Dynamic Attribute Values Count: ${createdProduct.attributeValues.length}`);
    console.log(`   Inventory Movements Count: ${createdProduct.inventoryMovements.length}`);

    // Verify combination hashes
    for (const v of createdProduct.variants) {
      console.log(`   -> Variant SKU: ${v.sku} | Hash: ${v.combinationHash} | Price: ${v.price.toLocaleString('fa-IR')} | Stock: ${v.stock}`);
    }

    // 4. Test Uniqueness constraint (Try creating duplicate variant with identical combinationHash)
    console.log('\n🔒 Testing Duplicate Combination Hash Rejection...');
    let duplicateRejected = false;
    try {
      await prisma.productVariant.create({
        data: {
          productId: createdProduct.id,
          title: 'تکراری تستی',
          sku: `${testSkuBase}-DUP`,
          combinationHash: 'flavor:blueberry-ice|nicotine:20mg', // identical to first variant
          combination: { flavor: 'Blueberry Ice', nicotine: '20mg' },
          price: 450000,
          stock: 5,
        },
      });
    } catch (err: any) {
      duplicateRejected = true;
      console.log(`✅ Success: Duplicate combinationHash correctly rejected by database constraint: ${err.code || err.message}`);
    }
    if (!duplicateRejected) {
      throw new Error('FAILED: Duplicate combinationHash was not rejected!');
    }

    // 5. Test Stock Reservation on a Variant
    console.log('\n📦 Testing Stock Reservation on Variant...');
    const testVariant = createdProduct.variants[0];
    const reserveQty = 3;

    const reservation = await prisma.$transaction(async (tx) => {
      // Check available stock
      const freshVariant = await tx.productVariant.findUniqueOrThrow({
        where: { id: testVariant.id },
      });

      const currentAvailable = freshVariant.stock - freshVariant.reservedQuantity;
      if (currentAvailable < reserveQty) {
        throw new Error('Not enough available stock');
      }

      // Increment reservedQuantity
      const updatedVariant = await tx.productVariant.update({
        where: { id: testVariant.id },
        data: { reservedQuantity: { increment: reserveQty } },
      });

      // Log movement
      await tx.inventoryMovement.create({
        data: {
          productId: createdProduct.id,
          variantId: testVariant.id,
          type: InventoryMovementType.ORDER_RESERVED,
          delta: -reserveQty,
          stockBefore: freshVariant.stock - freshVariant.reservedQuantity,
          stockAfter: updatedVariant.stock - updatedVariant.reservedQuantity,
          reason: `رزرو موقت برای سفارش تستی`,
        },
      });

      return updatedVariant;
    });

    console.log(`✅ Variant Reserved: Reserved Qty became ${reservation.reservedQuantity} (Stock: ${reservation.stock}, Available: ${reservation.stock - reservation.reservedQuantity})`);
    if (reservation.reservedQuantity !== reserveQty) {
      throw new Error('FAILED: Reserved quantity does not match expected amount');
    }

    // 6. Test Payment Confirmation & Permanent Stock Deduction
    console.log('\n💳 Testing Payment Confirmation & Stock Deduction...');
    const confirmedVariant = await prisma.$transaction(async (tx) => {
      const fresh = await tx.productVariant.findUniqueOrThrow({ where: { id: testVariant.id } });
      const v = await tx.productVariant.update({
        where: { id: testVariant.id },
        data: {
          stock: { decrement: reserveQty },
          reservedQuantity: { decrement: reserveQty },
        },
      });

      // Deduct from overall product stock
      await tx.product.update({
        where: { id: createdProduct.id },
        data: { stock: { decrement: reserveQty } },
      });

      // Log SALE_DEDUCTION
      await tx.inventoryMovement.create({
        data: {
          productId: createdProduct.id,
          variantId: testVariant.id,
          type: InventoryMovementType.SALE_DEDUCTION,
          delta: -reserveQty,
          stockBefore: fresh.stock,
          stockAfter: v.stock,
          reason: `کسر قطعی موجودی پس از پرداخت موفق سفارش`,
        },
      });

      return v;
    });

    console.log(`✅ Variant Stock Deducted: New Physical Stock: ${confirmedVariant.stock}, Reserved: ${confirmedVariant.reservedQuantity}`);
    if (confirmedVariant.stock !== testVariant.stock - reserveQty || confirmedVariant.reservedQuantity !== 0) {
      throw new Error('FAILED: Stock deduction after payment calculation mismatch');
    }

    // 7. Test Manual Stock Adjustment (e.g. Warehouse restock)
    console.log('\n🔄 Testing Manual Stock Adjustment (Inbound Restock)...');
    const restockQty = 10;
    const restockedVariant = await prisma.$transaction(async (tx) => {
      const fresh = await tx.productVariant.findUniqueOrThrow({ where: { id: testVariant.id } });
      const v = await tx.productVariant.update({
        where: { id: testVariant.id },
        data: { stock: { increment: restockQty } },
      });

      await tx.product.update({
        where: { id: createdProduct.id },
        data: { stock: { increment: restockQty } },
      });

      await tx.inventoryMovement.create({
        data: {
          productId: createdProduct.id,
          variantId: testVariant.id,
          type: InventoryMovementType.MANUAL_ADJUSTMENT,
          delta: restockQty,
          stockBefore: fresh.stock,
          stockAfter: v.stock,
          reason: 'شارژ دستی انبار توسط ادمین',
        },
      });

      return v;
    });

    console.log(`✅ Variant Restocked: New Physical Stock: ${restockedVariant.stock}`);

    // 8. Fetch Inventory Movement Log Audit
    const movements = await prisma.inventoryMovement.findMany({
      where: { variantId: testVariant.id },
      orderBy: { createdAt: 'asc' },
    });

    console.log(`\n📜 Inventory Movement Audit Trail (${movements.length} logs):`);
    for (const m of movements) {
      console.log(`   [${m.type}] Delta: ${m.delta > 0 ? '+' : ''}${m.delta} | Before: ${m.stockBefore} -> After: ${m.stockAfter} | Reason: ${m.reason}`);
    }

    console.log('\n🎉 ALL E2E BACKEND & DATABASE TESTS PASSED 100% SUCCESSFULLY!\n');
  } catch (error) {
    console.error('❌ E2E Test Failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runE2ETest();

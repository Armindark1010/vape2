import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Starting complete database backup...');

  const backupDir = path.join(__dirname, 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const backupData: Record<string, any> = {
    timestamp: new Date().toISOString(),
    users: await prisma.user.findMany(),
    brands: await prisma.brand.findMany(),
    categories: await prisma.category.findMany(),
    suppliers: await prisma.supplier.findMany(),
    products: await prisma.product.findMany(),
    orders: await prisma.order.findMany(),
    orderItems: await prisma.orderItem.findMany(),
    reservations: await prisma.inventoryReservation.findMany(),
    reservationItems: await prisma.reservationItem.findMany(),
    banners: await prisma.banner.findMany(),
    mediaFiles: await prisma.mediaFile.findMany(),
    globalSettings: await prisma.globalSetting.findMany(),
  };

  const backupPath = path.join(backupDir, `backup_${Date.now()}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2), 'utf-8');

  console.log(`✅ Database backup saved successfully to: ${backupPath}`);
  console.log(`📊 Statistics:
  - Products: ${backupData.products.length}
  - Categories: ${backupData.categories.length}
  - Brands: ${backupData.brands.length}
  - Orders: ${backupData.orders.length}
  - Order Items: ${backupData.orderItems.length}
  - Reservations: ${backupData.reservations.length}
  - Users: ${backupData.users.length}
  - Media Files: ${backupData.mediaFiles.length}
  `);
}

main()
  .catch((e) => {
    console.error('❌ Backup failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


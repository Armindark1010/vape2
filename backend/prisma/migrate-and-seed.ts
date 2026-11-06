import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting safe custom database migration and backward compatibility upgrade...');

  // 1. Create Enums and Tables safely with IF NOT EXISTS
  console.log('📦 Applying DDL for new tables and columns...');

  // InventoryMovementType enum
  await prisma.$executeRawUnsafe(`
    DO $$ BEGIN
      CREATE TYPE "InventoryMovementType" AS ENUM (
        'PURCHASE_RECEIPT',
        'SALE_DEDUCTION',
        'ORDER_RESERVED',
        'RESERVATION_RELEASED',
        'MANUAL_ADJUSTMENT',
        'RETURN_RESTOCK'
      );
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

  // ProductTypes table
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "product_types" (
      "id" SERIAL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "slug" TEXT UNIQUE NOT NULL,
      "description" TEXT,
      "icon" TEXT,
      "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // ProductAttributes table
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "product_attributes" (
      "id" SERIAL PRIMARY KEY,
      "product_type_id" INTEGER NOT NULL REFERENCES "product_types"("id") ON DELETE CASCADE,
      "name" TEXT NOT NULL,
      "code" TEXT NOT NULL,
      "type" TEXT NOT NULL DEFAULT 'select',
      "is_required" BOOLEAN NOT NULL DEFAULT false,
      "is_variant" BOOLEAN NOT NULL DEFAULT false,
      "is_visible" BOOLEAN NOT NULL DEFAULT true,
      "display_order" INTEGER NOT NULL DEFAULT 0,
      "options" JSONB,
      "unit" TEXT,
      CONSTRAINT "product_attributes_type_code_uniq" UNIQUE ("product_type_id", "code")
    );
  `);

  // ProductAttributeValues table
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "product_attribute_values" (
      "id" SERIAL PRIMARY KEY,
      "product_id" INTEGER NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
      "attribute_id" INTEGER NOT NULL REFERENCES "product_attributes"("id") ON DELETE CASCADE,
      "value" TEXT NOT NULL,
      CONSTRAINT "product_attribute_values_prod_attr_uniq" UNIQUE ("product_id", "attribute_id")
    );
  `);

  // ProductVariants table
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "product_variants" (
      "id" SERIAL PRIMARY KEY,
      "product_id" INTEGER NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
      "sku" TEXT UNIQUE NOT NULL,
      "title" TEXT NOT NULL,
      "combination_hash" TEXT NOT NULL,
      "combination" JSONB NOT NULL,
      "price" INTEGER NOT NULL,
      "compare_at_price" INTEGER,
      "stock" INTEGER NOT NULL DEFAULT 0,
      "reserved_quantity" INTEGER NOT NULL DEFAULT 0,
      "weight" INTEGER,
      "image" TEXT,
      "is_active" BOOLEAN NOT NULL DEFAULT true,
      "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "product_variants_prod_comb_uniq" UNIQUE ("product_id", "combination_hash")
    );
  `);

  // VariantAttributeValues table
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "variant_attribute_values" (
      "id" SERIAL PRIMARY KEY,
      "variant_id" INTEGER NOT NULL REFERENCES "product_variants"("id") ON DELETE CASCADE,
      "attribute_id" INTEGER NOT NULL REFERENCES "product_attributes"("id") ON DELETE CASCADE,
      "value" TEXT NOT NULL,
      CONSTRAINT "variant_attr_values_uniq" UNIQUE ("variant_id", "attribute_id")
    );
  `);

  // InventoryMovements table
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "inventory_movements" (
      "id" SERIAL PRIMARY KEY,
      "variant_id" INTEGER NOT NULL REFERENCES "product_variants"("id") ON DELETE CASCADE,
      "product_id" INTEGER NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
      "type" "InventoryMovementType" NOT NULL,
      "delta" INTEGER NOT NULL,
      "stock_before" INTEGER NOT NULL,
      "stock_after" INTEGER NOT NULL,
      "reason" TEXT,
      "order_id" INTEGER,
      "user_id" INTEGER,
      "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Alter products table to add columns
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "products"
      ADD COLUMN IF NOT EXISTS "sku" TEXT,
      ADD COLUMN IF NOT EXISTS "short_description" TEXT,
      ADD COLUMN IF NOT EXISTS "seo_title" TEXT,
      ADD COLUMN IF NOT EXISTS "seo_description" TEXT,
      ADD COLUMN IF NOT EXISTS "compare_at_price" INTEGER,
      ADD COLUMN IF NOT EXISTS "product_type_id" INTEGER REFERENCES "product_types"("id") ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
  `);

  // Alter order_items table to add variant_id
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "order_items"
      ADD COLUMN IF NOT EXISTS "variant_id" INTEGER REFERENCES "product_variants"("id") ON DELETE SET NULL;
  `);

  // Alter reservation_items table to add variant_id
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "reservation_items"
      ADD COLUMN IF NOT EXISTS "variant_id" INTEGER REFERENCES "product_variants"("id") ON DELETE SET NULL;
  `);

  console.log('✅ DDL schema changes applied without errors!');

  // 2. Seed Default Product Types & Dynamic Attributes
  console.log('🌱 Seeding Product Types and Attributes...');

  const typesData = [
    {
      name: 'پاد یک‌بارمصرف (Disposable Vape)',
      slug: 'disposable-vape',
      description: 'دستگاه‌های از پیش شارژ و پر شده با سالت نیکوتین بدون نیاز به نگهداری',
      icon: 'sparkles',
      attributes: [
        { name: 'میزان نیکوتین', code: 'nicotine', type: 'select', isRequired: true, isVariant: true, isVisible: true, displayOrder: 1, options: ['20mg', '30mg', '35mg', '50mg'], unit: 'mg' },
        { name: 'طعم کالا', code: 'flavor', type: 'select', isRequired: true, isVariant: true, isVisible: true, displayOrder: 2, options: ['بلوبری یخ (Blueberry Ice)', 'انبه خنک (Mango Freeze)', 'توت‌فرنگی کیوی (Strawberry Kiwi)', 'هندوانه تمشک (Watermelon Berry)', 'دوسیب یخ (Double Apple)', 'تنباکو خامه (Creamy Tobacco)'], unit: '' },
        { name: 'تعداد پاف (کام)', code: 'puff_count', type: 'number', isRequired: false, isVariant: false, isVisible: true, displayOrder: 3, options: ['5000', '7000', '10000', '15000', '20000'], unit: 'پاف' },
        { name: 'ظرفیت باتری', code: 'battery_capacity', type: 'number', isRequired: false, isVariant: false, isVisible: true, displayOrder: 4, options: null, unit: 'mAh' },
        { name: 'نوع کویل', code: 'coil_type', type: 'select', isRequired: false, isVariant: false, isVisible: true, displayOrder: 5, options: ['Mesh Coil', 'Dual Mesh', 'Standard Wire'], unit: '' },
        { name: 'امکان شارژ مجدد', code: 'rechargeable', type: 'boolean', isRequired: false, isVariant: false, isVisible: true, displayOrder: 6, options: null, unit: '' },
      ],
    },
    {
      name: 'سالت نیکوتین و جویس (Nicotine Salt & E-Liquid)',
      slug: 'nicotine-salt',
      description: 'مایع‌های تخصصی الکترونیکی سالت نیکوتین و جویس فری‌بیس برای پر کردن کارتریج و تانک',
      icon: 'beaker',
      attributes: [
        { name: 'میزان نیکوتین', code: 'nicotine', type: 'select', isRequired: true, isVariant: true, isVisible: true, displayOrder: 1, options: ['25mg', '30mg', '35mg', '50mg'], unit: 'mg' },
        { name: 'طعم اصلی', code: 'flavor', type: 'select', isRequired: true, isVariant: true, isVisible: true, displayOrder: 2, options: ['تنباکو کارامل (Tobacco Caramel)', 'انگور سیاه یخ (Grape Ice)', 'سیب سبز ترش (Sour Apple)', 'نعناع خنک (Cool Mint)', 'هلو یخ (Peach Ice)'], unit: '' },
        { name: 'حجم بطری', code: 'bottle_volume', type: 'select', isRequired: true, isVariant: true, isVisible: true, displayOrder: 3, options: ['30ml', '60ml', '100ml'], unit: 'ml' },
        { name: 'نسبت VG/PG', code: 'vg_pg_ratio', type: 'select', isRequired: false, isVariant: false, isVisible: true, displayOrder: 4, options: ['50/50 (Salts)', '70/30 (Freebase)', '60/40'], unit: '' },
        { name: 'نوع مایع', code: 'liquid_type', type: 'select', isRequired: false, isVariant: false, isVisible: true, displayOrder: 5, options: ['Nicotine Salt', 'Freebase E-Liquid'], unit: '' },
      ],
    },
    {
      name: 'دستگاه پاد سیستم و ماد (Pod System & Mod)',
      slug: 'pod-system',
      description: 'دستگاه‌های قابل شارژ و تعویض کارتریج یا کویل جهت استفاده حرفه‌ای و روزمره',
      icon: 'cpu-chip',
      attributes: [
        { name: 'رنگ بدنه', code: 'color', type: 'color', isRequired: true, isVariant: true, isVisible: true, displayOrder: 1, options: ['Midnight Black', 'Carbon Silver', 'Aurora Blue', 'Sunset Gold', 'Emerald Green'], unit: '' },
        { name: 'ظرفیت باتری', code: 'battery_capacity', type: 'number', isRequired: false, isVariant: false, isVisible: true, displayOrder: 2, options: null, unit: 'mAh' },
        { name: 'حداکثر توان خروجی', code: 'max_wattage', type: 'number', isRequired: false, isVariant: false, isVisible: true, displayOrder: 3, options: null, unit: 'W' },
        { name: 'نمایشگر دیجیتال', code: 'screen_display', type: 'boolean', isRequired: false, isVariant: false, isVisible: true, displayOrder: 4, options: null, unit: '' },
        { name: 'پورت شارژ', code: 'charging_port', type: 'select', isRequired: false, isVariant: false, isVisible: true, displayOrder: 5, options: ['Type-C 2A Fast Charge', 'Type-C 1A', 'Micro-USB'], unit: '' },
      ],
    },
    {
      name: 'فندک و اکسسوری لوکس (Lighter & Luxury Accessories)',
      slug: 'lighter-accessories',
      description: 'فندک‌های گازی، جت‌فلیم، کاترهای سیگار و اکسسوری‌های استایل لوکس',
      icon: 'fire',
      attributes: [
        { name: 'رنگ و طرح', code: 'color', type: 'color', isRequired: true, isVariant: true, isVisible: true, displayOrder: 1, options: ['طلایی مات (Matte Gold)', 'کروم براق (Chrome Polish)', 'مشکی تیتانیوم (Gunmetal Black)', 'رزگلد (Rose Gold)'], unit: '' },
        { name: 'نوع فندک / شعله', code: 'lighter_flame_type', type: 'select', isRequired: true, isVariant: true, isVisible: true, displayOrder: 2, options: ['شعله اتمی تک جت (Single Jet)', 'شعله توربو سه گانه (Triple Jet)', 'شعله نرم کلاسیک (Soft Flame)'], unit: '' },
        { name: 'جنس بدنه', code: 'body_material', type: 'select', isRequired: false, isVariant: false, isVisible: true, displayOrder: 3, options: ['آلیاژ روی (Zinc Alloy)', 'برنج خالص (Pure Brass)', 'استیل ضدزنگ (Stainless Steel)'], unit: '' },
        { name: 'نوع سوخت مصرفی', code: 'fuel_type', type: 'select', isRequired: false, isVariant: false, isVisible: true, displayOrder: 4, options: ['گاز بوتان تصفیه شده', 'بنزینی (Zippo Style)', 'الکتریکی پلاسمایی (USB ARC)'], unit: '' },
      ],
    },
  ];

  for (const t of typesData) {
    const pType = await prisma.productType.upsert({
      where: { slug: t.slug },
      update: { name: t.name, description: t.description, icon: t.icon },
      create: { name: t.name, slug: t.slug, description: t.description, icon: t.icon },
    });

    for (const attr of t.attributes) {
      await prisma.productAttribute.upsert({
        where: {
          productTypeId_code: {
            productTypeId: pType.id,
            code: attr.code,
          },
        },
        update: {
          name: attr.name,
          type: attr.type,
          isRequired: attr.isRequired,
          isVariant: attr.isVariant,
          isVisible: attr.isVisible,
          displayOrder: attr.displayOrder,
          options: attr.options as any,
          unit: attr.unit,
        },
        create: {
          productTypeId: pType.id,
          name: attr.name,
          code: attr.code,
          type: attr.type,
          isRequired: attr.isRequired,
          isVariant: attr.isVariant,
          isVisible: attr.isVisible,
          displayOrder: attr.displayOrder,
          options: attr.options as any,
          unit: attr.unit,
        },
      });
    }
  }

  console.log('✅ Product types and attributes seeded successfully!');

  // 3. Migrate Old Products, OrderItems, Reservations & Seed Default Variants
  console.log('🔄 Migrating existing products to variants and updating historical links...');

  const defaultType = await prisma.productType.findFirst({ where: { slug: 'disposable-vape' } });
  const allProducts = await prisma.product.findMany();

  for (const prod of allProducts) {
    // 1. Assign product type if not set
    if (!prod.productTypeId && defaultType) {
      await prisma.product.update({
        where: { id: prod.id },
        data: {
          productTypeId: defaultType.id,
          sku: prod.sku || `VAPE-${prod.id}-${prod.slug.slice(0, 8).toUpperCase()}`,
        },
      });
    }

    // 2. Check if product already has variants
    const existingVariants = await prisma.productVariant.findMany({
      where: { productId: prod.id },
    });

    let defaultVariant: any = existingVariants[0];

    if (!defaultVariant) {
      const variantSku = `${prod.sku || `VAPE-${prod.id}`}-DEF`;
      const combHash = 'default:standard';
      const comb = { 'مدل': 'پیش‌فرض استاندارد' };

      defaultVariant = await prisma.productVariant.create({
        data: {
          productId: prod.id,
          sku: variantSku,
          title: `${prod.name} (نسخه اصلی)`,
          combinationHash: combHash,
          combination: comb,
          price: prod.price,
          compareAtPrice: prod.discountPrice || null,
          stock: prod.stock,
          reservedQuantity: 0,
          isActive: true,
          image: Array.isArray(prod.images) ? (prod.images as string[])[0] : null,
        },
      });

      // Log initial inventory movement
      await prisma.inventoryMovement.create({
        data: {
          variantId: defaultVariant.id,
          productId: prod.id,
          type: 'PURCHASE_RECEIPT',
          delta: prod.stock,
          stockBefore: 0,
          stockAfter: prod.stock,
          reason: 'Initial stock migration from legacy product catalog',
        },
      });

      console.log(`  -> Created default variant for: "${prod.name}" (ID: ${prod.id}, Stock: ${prod.stock})`);
    }

    // 3. Link OrderItems without variantId to this default variant
    const orderItemsUpdated = await prisma.orderItem.updateMany({
      where: {
        productId: prod.id,
        variantId: null,
      },
      data: {
        variantId: defaultVariant.id,
      },
    });

    if (orderItemsUpdated.count > 0) {
      console.log(`  -> Linked ${orderItemsUpdated.count} existing OrderItems to variant ID ${defaultVariant.id}`);
    }

    // 4. Link ReservationItems without variantId to this default variant
    const resItemsUpdated = await prisma.reservationItem.updateMany({
      where: {
        productId: prod.id,
        variantId: null,
      },
      data: {
        variantId: defaultVariant.id,
      },
    });

    if (resItemsUpdated.count > 0) {
      console.log(`  -> Linked ${resItemsUpdated.count} existing ReservationItems to variant ID ${defaultVariant.id}`);
    }
  }

  console.log('🎉 Migration, backward compatibility linkage, and seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


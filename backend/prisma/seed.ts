import { PrismaClient, ProductType, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Seed Users (Admin & Customer)
  const adminUser = await prisma.user.upsert({
    where: { phoneNumber: '09120000000' },
    update: {},
    create: {
      phoneNumber: '09120000000',
      fullName: 'مدیر ارشد فروشگاه',
      role: Role.ADMIN,
      isVerified: true,
    },
  });

  const sampleCustomer = await prisma.user.upsert({
    where: { phoneNumber: '09123456789' },
    update: {},
    create: {
      phoneNumber: '09123456789',
      fullName: 'علی رضایی',
      role: Role.CUSTOMER,
      isVerified: true,
    },
  });

  console.log(`👤 Seeded Users: Admin (${adminUser.phoneNumber}), Customer (${sampleCustomer.phoneNumber})`);

  // 2. Seed Categories
  const categoriesData = [
    {
      name: 'پاد سیستم‌ها',
      slug: 'pod-systems',
      description: 'دستگاه‌های پاد سیستم کامپکت و مدرن مناسب مصرف روزانه سالت نیکوتین',
      image: '/images/categories/pod-systems.webp',
    },
    {
      name: 'سالت نیکوتین',
      slug: 'salt-nicotine',
      description: 'مایعات نیکوتین بالا (۲۰ الی ۵۰ میلی‌گرم) با جذب سریع و طعم‌دهی عالی',
      image: '/images/categories/salt-nic.webp',
    },
    {
      name: 'جویس فری‌بیس',
      slug: 'e-liquids',
      description: 'مایعات ویپ با بخار غلیظ و نیکوتین سبک (۳ الی ۶ میلی‌گرم) برای ویپ‌های پرقدرت',
      image: '/images/categories/e-liquids.webp',
    },
    {
      name: 'پاد یکبار مصرف',
      slug: 'disposables',
      description: 'دستگاه‌های آماده به مصرف شارژشده با تنوع طعم بالا بدون نیاز به تعویض کویل',
      image: '/images/categories/disposables.webp',
    },
    {
      name: 'کویل و کارتریج',
      slug: 'coils-pods',
      description: 'انواع کویل، کارتریج یدکی و مخزن‌های اورجینال کمپانی‌های معتبر',
      image: '/images/categories/coils.webp',
    },
  ];

  const categoryMap: Record<string, string> = {};

  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        image: cat.image,
      },
      create: cat,
    });
    categoryMap[cat.slug] = created.id;
  }

  console.log('📂 Seeded Categories:', Object.keys(categoryMap));

  // 3. Seed Realistic Products
  const productsData = [
    // Pod Systems
    {
      title: 'پاد سیستم اکسیوا زایلیم پرو - OXVA Xlim Pro Pod Kit',
      slug: 'oxva-xlim-pro-pod-kit',
      description:
        'پاد سیستم فوق‌العاده محبوب ۳۰ وات مجهز به باتری ۱۰۰۰ میلی‌آمپر، صفحه نمایش OLED رنگی و سیستم ضدلیکی ارتقایافته V3 مناسب سالت نیکوتین.',
      price: 1850000,
      discountPrice: 1690000,
      stock: 25,
      type: ProductType.DEVICE_POD,
      brand: 'OXVA',
      brandSlug: 'oxva',
      images: [
        'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80',
        'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=800&q=80',
      ],
      featured: true,
      rating: 4.9,
      reviewCount: 42,
      nicotineStrength: null,
      flavorProfile: [],
      volume: 'کارتریج ۲ میلی‌لیتر',
      categoryId: categoryMap['pod-systems'],
    },
    {
      title: 'پاد سیستم گیک‌ویپ ونکس کیو - GeekVape Wenax Q',
      slug: 'geekvape-wenax-q-kit',
      description:
        'پاد سیستم کامپکت با توان متغیر ۵ الی ۲۵ وات و باتری داخلی ۱۰۰۰ میلی‌آمپر با قابلیت تنظیم دقیق جریان هوا.',
      price: 1450000,
      discountPrice: 1320000,
      stock: 18,
      type: ProductType.DEVICE_POD,
      brand: 'GeekVape',
      brandSlug: 'geekvape',
      images: [
        'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=800&q=80',
      ],
      featured: true,
      rating: 4.7,
      reviewCount: 28,
      nicotineStrength: null,
      flavorProfile: [],
      volume: 'کارتریج ۲ میلی‌لیتر',
      categoryId: categoryMap['pod-systems'],
    },
    {
      title: 'پاد ماد وپپرسو لوکس ایکس آر مکس - Vaporesso Luxe XR Max',
      slug: 'vaporesso-luxe-xr-max-80w',
      description:
        'دستگاه قدرتمند ۸۰ واتی دومنظوره با باتری غول‌پیکر ۲۸۰۰ میلی‌آمپر سازگار با تمام کویل‌های GTX برای مصرف همزمان جویس و سالت.',
      price: 2950000,
      discountPrice: 2750000,
      stock: 12,
      type: ProductType.DEVICE_POD,
      brand: 'Vaporesso',
      brandSlug: 'vaporesso',
      images: [
        'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80',
      ],
      featured: true,
      rating: 4.95,
      reviewCount: 56,
      nicotineStrength: null,
      flavorProfile: [],
      volume: 'مخزن ۵ میلی‌لیتر',
      categoryId: categoryMap['pod-systems'],
    },

    // Salt Nicotine
    {
      title: 'سالت نیکوتین نستی کاشمن انبه یخ - Nasty Juice Cush Man Mango Ice 30ml',
      slug: 'nasty-juice-cushman-mango-ice-salt-30ml',
      description:
        'طعم بی‌نظیر انبه استوایی آبدار ترکیب‌شده با حس خنکی ملایم نعنا و خنک‌کننده برای تجربه طعمی بهشتی.',
      price: 590000,
      discountPrice: 520000,
      stock: 40,
      type: ProductType.SALT_NIC,
      brand: 'Nasty Juice',
      brandSlug: 'nasty-juice',
      images: [
        'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=800&q=80',
      ],
      featured: true,
      rating: 4.9,
      reviewCount: 89,
      nicotineStrength: '35mg',
      flavorProfile: ['Mango', 'Ice', 'Tropical Fruit'],
      volume: '30ml',
      categoryId: categoryMap['salt-nicotine'],
    },
    {
      title: 'سالت نیکوتین بی ال وی کی سیب یخ - BLVK Unicorn Apple Ice Salt 30ml',
      slug: 'blvk-unicorn-apple-ice-salt-30ml',
      description:
        'ترکیب هیجان‌انگیز سیب ترش و شیرین تازه به همراه ته‌مزه‌ی خنک مناسب برای تمام طول روز.',
      price: 620000,
      discountPrice: null,
      stock: 35,
      type: ProductType.SALT_NIC,
      brand: 'BLVK',
      brandSlug: 'blvk',
      images: [
        'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=800&q=80',
      ],
      featured: false,
      rating: 4.8,
      reviewCount: 34,
      nicotineStrength: '50mg',
      flavorProfile: ['Apple', 'Ice', 'Fruity'],
      volume: '30ml',
      categoryId: categoryMap['salt-nicotine'],
    },
    {
      title: 'سالت نیکوتین ویگاد کوبایی توباکو - VGOD Cubano Silver Salt 30ml',
      slug: 'vgod-cubano-silver-salt-30ml',
      description:
        'طعم سیگار برگ کوبایی غنی با چاشنی وانیل خامه‌ای، کارامل قهوه‌ای و ادویه‌های دودی ملایم.',
      price: 680000,
      discountPrice: 620000,
      stock: 20,
      type: ProductType.SALT_NIC,
      brand: 'VGOD',
      brandSlug: 'vgod',
      images: [
        'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80',
      ],
      featured: true,
      rating: 4.85,
      reviewCount: 65,
      nicotineStrength: '25mg',
      flavorProfile: ['Tobacco', 'Vanilla', 'Caramel'],
      volume: '30ml',
      categoryId: categoryMap['salt-nicotine'],
    },

    // Freebase E-Liquids
    {
      title: 'جویس نستی دو سیب دوبل - Nasty Juice Double Apple 60ml',
      slug: 'nasty-juice-double-apple-60ml',
      description:
        'طعم کلاسیک و محبوب قلیان دوسیب با بالانس عالی سیب سبز ترش و سیب قرمز شیرین با حجم دود فوق‌العاده.',
      price: 650000,
      discountPrice: 580000,
      stock: 30,
      type: ProductType.JUICE,
      brand: 'Nasty Juice',
      brandSlug: 'nasty-juice',
      images: [
        'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=800&q=80',
      ],
      featured: false,
      rating: 4.75,
      reviewCount: 41,
      nicotineStrength: '3mg',
      flavorProfile: ['Double Apple', 'Apple', 'Fruity'],
      volume: '60ml',
      categoryId: categoryMap['e-liquids'],
    },
    {
      title: 'جویس راتلس رز انگور تمشک - Ruthless Grape Drank on Ice 60ml',
      slug: 'ruthless-grape-drank-on-ice-60ml',
      description:
        'ترکیب نوستالژیک نوشابه انگور بنفش، آبنبات انگور فرنگی و قطعات یخ برای طرفداران طعم‌های شیرین و شاداب.',
      price: 690000,
      discountPrice: 630000,
      stock: 15,
      type: ProductType.JUICE,
      brand: 'Ruthless',
      brandSlug: 'ruthless',
      images: [
        'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80',
      ],
      featured: true,
      rating: 4.9,
      reviewCount: 52,
      nicotineStrength: '6mg',
      flavorProfile: ['Grape', 'Soda', 'Candy', 'Ice'],
      volume: '60ml',
      categoryId: categoryMap['e-liquids'],
    },

    // Disposables
    {
      title: 'پاد یکبار مصرف الف بار ۱۰۰۰۰ پاف بلوبری یخ - Elf Bar BC10000 Blueberry Ice',
      slug: 'elf-bar-bc10000-blueberry-ice',
      description:
        'پاد یکبار مصرف شارژی با نمایشگر درصد شارژ و باقیمانده مایع، تا ۱۰,۰۰۰ پاف کام‌دهی با طعم عمیق بلوبری خنک.',
      price: 790000,
      discountPrice: 690000,
      stock: 50,
      type: ProductType.DEVICE_POD,
      brand: 'Elf Bar',
      brandSlug: 'elf-bar',
      images: [
        'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=800&q=80',
      ],
      featured: true,
      rating: 4.88,
      reviewCount: 97,
      nicotineStrength: '50mg',
      flavorProfile: ['Blueberry', 'Ice', 'Berries'],
      volume: '10000 Puffs',
      categoryId: categoryMap['disposables'],
    },
    {
      title: 'پاد یکبار مصرف ووستوک هندوانه یخ - Vostok 8000 Watermelon Ice',
      slug: 'vostok-8000-watermelon-ice',
      description:
        'طعم هندوانه خنک و شیرین با باتری ۶۵۰ میلی‌آمپر شارژی پورت Type-C و تکنولوژی مش‌کویل دوگانه.',
      price: 650000,
      discountPrice: null,
      stock: 22,
      type: ProductType.DEVICE_POD,
      brand: 'Vostok',
      brandSlug: 'vostok',
      images: [
        'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80',
      ],
      featured: false,
      rating: 4.7,
      reviewCount: 19,
      nicotineStrength: '50mg',
      flavorProfile: ['Watermelon', 'Ice'],
      volume: '8000 Puffs',
      categoryId: categoryMap['disposables'],
    },

    // Coils & Pods
    {
      title: 'کارتریج یدک اکسیوا اکسلیم ۰.۶ اهم V3 - OXVA Xlim Pod V3 0.6Ω (بسته ۳ عددی)',
      slug: 'oxva-xlim-v3-cartridge-0-6-ohm-pack',
      description:
        'کارتریج ارتقایافته ضد نشت با درگاه پرکردن مایع از بالا مناسب انواع پاد سیستم‌های سری اکسلیم.',
      price: 490000,
      discountPrice: 450000,
      stock: 60,
      type: ProductType.ACCESSORY,
      brand: 'OXVA',
      brandSlug: 'oxva',
      images: [
        'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80',
      ],
      featured: false,
      rating: 4.95,
      reviewCount: 110,
      nicotineStrength: null,
      flavorProfile: [],
      volume: '2ml x 3pcs',
      categoryId: categoryMap['coils-pods'],
    },
    {
      title: 'کویل وپرسو جی تی ایکس ۰.۲ اهم - Vaporesso GTX 0.2Ω Mesh Coil (بسته ۵ عددی)',
      slug: 'vaporesso-gtx-0-2-mesh-coil-pack',
      description:
        'کویل مش با تفکیک طعم خارق‌العاده و دوام بالا برای توان ۴۵ الی ۶۰ وات مخصوص ویپ و مصرف جویس کم نیکوتین.',
      price: 620000,
      discountPrice: 560000,
      stock: 45,
      type: ProductType.ACCESSORY,
      brand: 'Vaporesso',
      brandSlug: 'vaporesso',
      images: [
        'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=800&q=80',
      ],
      featured: false,
      rating: 4.85,
      reviewCount: 48,
      nicotineStrength: null,
      flavorProfile: [],
      volume: '5pcs pack',
      categoryId: categoryMap['coils-pods'],
    },
  ];

  for (const product of productsData) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  console.log(`📦 Seeded ${productsData.length} vape products successfully.`);
  console.log('✨ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

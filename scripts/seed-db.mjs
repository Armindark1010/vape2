import pg from "pg";

const { Client } = pg;

const px = (id, w = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

const IMG = {
  hero1: px(19344605, 1400), // پاد با دود بنفش لوکس
  hero2: px(17962162, 1400), // پاد وزول سبز
  hero3: px(14472703, 1400), // سالت نستی و دود شب
  promo1: px(12345382, 1200), // سالت نیکوتین
  pod1: px(19344605, 800),
  pod2: px(17962162, 800),
  salt1: px(12345382, 800),
  mod1: px(17962161, 800),
};

async function seedData() {
  const client = new Client({
    connectionString: "postgresql://postgres:00000000@127.0.0.1:5432/vape_lifestyle_db",
  });

  try {
    await client.connect();
    console.log("Connected to vape_lifestyle_db for seeding.");

    // Seed Brands
    const brands = [
      { name: "ELFBAR", slug: "elfbar", description: "پرفروش‌ترین برند پاد یک‌بارمصرف جهان" },
      { name: "VOZOL", slug: "vozol", description: "پادهای قدرتمند با طعم‌های خاص" },
      { name: "LOST MARY", slug: "lostmary", description: "طراحی مدرن و طعم‌های میوه‌ای جذاب" },
      { name: "NASTY", slug: "nasty", description: "سالت‌های مطرح مالزیایی با کیفیت درجه یک" },
      { name: "VAPORESSO", slug: "vaporesso", description: "مود و پاد سیستم با تکنولوژی روز دنیا" },
      { name: "VAPELAB", slug: "vapelab", description: "محصولات ویژه و گلچین تخصصی ویپ‌لب" },
    ];

    for (const b of brands) {
      await client.query(
        `INSERT INTO brands (name, slug, description) VALUES ($1, $2, $3)
         ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description`,
        [b.name, b.slug, b.description]
      );
    }
    console.log("Brands seeded.");

    // Seed Categories
    const categories = [
      { name: "پاد یک‌بارمصرف", slug: "pods", description: "پادهای آماده مصرف با طعم‌های متنوع", image: IMG.pod1, featured: true },
      { name: "سالت نیکوتین", slug: "salts", description: "نمک نیکوتین اصل با نیکوتین ۲۰ تا ۵۰", image: IMG.salt1, featured: true },
      { name: "مود و پاد سیستم", slug: "mods", description: "دستگاه‌های شارژی با کویل قابل تعویض", image: IMG.mod1, featured: true },
      { name: "کویل و لوازم جانبی", slug: "gear", description: "کویل، کارتریج و باتری اورجینال", image: IMG.hero2, featured: true },
    ];

    for (const c of categories) {
      await client.query(
        `INSERT INTO categories (name, slug, description, image, featured) VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, image = EXCLUDED.image, featured = EXCLUDED.featured`,
        [c.name, c.slug, c.description, c.image, c.featured]
      );
    }
    console.log("Categories seeded.");

    // Get Brand and Category IDs
    const brandMap = {};
    const bRes = await client.query("SELECT id, slug FROM brands");
    bRes.rows.forEach((r) => (brandMap[r.slug] = r.id));

    const catMap = {};
    const cRes = await client.query("SELECT id, slug FROM categories");
    cRes.rows.forEach((r) => (catMap[r.slug] = r.id));

    // Seed Products
    const prods = [
      {
        slug: "elfbar-te6000",
        name: "ELFBAR TE6000",
        tagline: "۶۰۰۰ پاف · طعم انگور یخ 🍇",
        description: "ال اف بار TE6000 با ۶۰۰۰ پاف، ۱۵ میلی‌لیتر جویس و باتری ۶۰۰ میلی‌آمپری با شارژ Type-C، محبوب‌ترین انتخاب واپرهای ایرانی است. دارای هولوگرام اصالت کالا.",
        price: 1150000,
        discount_price: 990000,
        rating: 48,
        review_count: 214,
        stock: 46,
        brand_id: brandMap["elfbar"],
        category_id: catMap["pods"],
        images: JSON.stringify([IMG.pod1, IMG.hero2]),
        featured: true,
        best_seller: true,
        new_arrival: false,
        variants: JSON.stringify([
          { id: "v1", name: "انگور یخ", color: "بنفش متالیک", hex: "#a855f7", stock: 24, image: IMG.pod1 },
          { id: "v2", name: "هندوانه یخی", color: "قرمز کریستالی", hex: "#f43f5e", stock: 22, image: IMG.hero3 },
        ]),
        specs: JSON.stringify({ "تعداد پاف": "۶۰۰۰ پاف", "حجم مخزن": "۱۵ میلی‌لیتر", "باتری": "۶۰۰ میلی‌آمپر (Type-C)" }),
      },
      {
        slug: "vozol-gear-10000",
        name: "VOZOL Gear 10000",
        tagline: "۱۰ هزار پاف قدرتمند · بدنه ضدضربه",
        description: "پاد ده هزار پاف وزول با تکنولوژی مش کویل نسل ۴، محافظ درگاه سلیکونی و خروجی بخار یکدست و متراکم.",
        price: 1450000,
        discount_price: 1290000,
        rating: 49,
        review_count: 312,
        stock: 35,
        brand_id: brandMap["vozol"],
        category_id: catMap["pods"],
        images: JSON.stringify([IMG.pod2, IMG.hero1]),
        featured: true,
        best_seller: true,
        new_arrival: true,
        variants: JSON.stringify([
          { id: "v1", name: "پشن فروت کولا", color: "لیمویی سایبر", hex: "#84cc16", stock: 18, image: IMG.pod2 },
          { id: "v2", name: "بلوبری تمشک", color: "آبی نئون", hex: "#38bdf8", stock: 17, image: IMG.pod1 },
        ]),
        specs: JSON.stringify({ "تعداد پاف": "۱۰,۰۰۰ پاف", "تکنولوژی": "VAMT Mesh Coil", "حجم مخزن": "۲۰ میلی‌لیتر" }),
      },
      {
        slug: "nasty-cush-man-mango",
        name: "سالت نستی Cush Man انبه یخ",
        tagline: "۳۰ میلی‌لیتر · نیکوتین ۳۵ و ۵۰",
        description: "شاهکار شرکت نستی مالزی؛ ترکیب انبه استوایی آبدار با خنکی یخ که حسی فوق‌العاده نرم و پر از طعم را خلق می‌کند.",
        price: 880000,
        discount_price: 780000,
        rating: 49,
        review_count: 189,
        stock: 52,
        brand_id: brandMap["nasty"],
        category_id: catMap["salts"],
        images: JSON.stringify([IMG.salt1, IMG.promo1]),
        featured: true,
        best_seller: true,
        new_arrival: false,
        variants: JSON.stringify([
          { id: "v1", name: "نیکوتین ۳۵ میلی‌گرم", color: "۳۵mg", hex: "#eab308", stock: 28, image: IMG.salt1 },
          { id: "v2", name: "نیکوتین ۵۰ میلی‌گرم", color: "۵۰mg", hex: "#f97316", stock: 24, image: IMG.salt1 },
        ]),
        specs: JSON.stringify({ "حجم": "۳۰ میلی‌لیتر", "کشور سازنده": "مالزی (Original)", "نسبت VG/PG": "50/50" }),
      },
      {
        slug: "vaporesso-xros-3-pro",
        name: "پاد سیستم ویپرسو XROS 3 Pro",
        tagline: "باتری ۱۰۰۰mAh · صفحه نمایش OLED",
        description: "پیشرفته‌ترین پاد سیستم برند ویپرسو با کنترل دقیق جریان هوا (Airflow)، نمایش درصد شارژ و پشتیبانی از انواع کارتریج‌های سری XROS.",
        price: 2450000,
        discount_price: 2200000,
        rating: 49,
        review_count: 94,
        stock: 19,
        brand_id: brandMap["vaporesso"],
        category_id: catMap["mods"],
        images: JSON.stringify([IMG.mod1, IMG.hero1]),
        featured: true,
        best_seller: false,
        new_arrival: true,
        variants: JSON.stringify([
          { id: "v1", name: "مشکی مات (Midnight Black)", color: "مشکی کربن", hex: "#18181b", stock: 10, image: IMG.mod1 },
          { id: "v2", name: "نقره‌ای فانتوم (Phantom Silver)", color: "نقره‌ای متالیک", hex: "#94a3b8", stock: 9, image: IMG.mod1 },
        ]),
        specs: JSON.stringify({ "باتری": "1000 mAh", "چیپست": "Axon Chip", "حداکثر توان": "30W" }),
      },
    ];

    for (const p of prods) {
      await client.query(
        `INSERT INTO products (slug, name, tagline, description, price, discount_price, rating, review_count, stock, brand_id, category_id, images, featured, best_seller, new_arrival, variants, specs)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
         ON CONFLICT (slug) DO UPDATE SET
           name = EXCLUDED.name, tagline = EXCLUDED.tagline, description = EXCLUDED.description,
           price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, rating = EXCLUDED.rating,
           review_count = EXCLUDED.review_count, stock = EXCLUDED.stock, brand_id = EXCLUDED.brand_id,
           category_id = EXCLUDED.category_id, images = EXCLUDED.images, featured = EXCLUDED.featured,
           best_seller = EXCLUDED.best_seller, new_arrival = EXCLUDED.new_arrival, variants = EXCLUDED.variants,
           specs = EXCLUDED.specs`,
        [p.slug, p.name, p.tagline, p.description, p.price, p.discount_price, p.rating, p.review_count, p.stock, p.brand_id, p.category_id, p.images, p.featured, p.best_seller, p.new_arrival, p.variants, p.specs]
      );
    }
    console.log("Products seeded.");

    // Seed Banners
    const banners = [
      {
        title: "دودِ نرم، طعمِ ناب",
        subtitle: "تنوع بی‌نظیر جدیدترین پادهای ۱۰۰۰۰ پافی و سالت‌های ارجینال با هولوگرام اصالت",
        badge: "⚡ پیشنهاد ویژه این هفته",
        image: IMG.hero1,
        mobile_image: IMG.hero1,
        link: "/shop?sort=popular",
        button_text: "مشاهده و خرید آنلاین",
        bg_gradient: "from-vio to-ice",
        text_color: "light",
        position: "hero",
        sort_order: 1,
        active: true,
      },
      {
        title: "تخفیف ویژه سالت‌های نستی مالزی",
        subtitle: "تا ۱۵٪ تخفیف روی محبوب‌ترین طعم‌های Cush Man، انگور خنک و تنباکو کارامل",
        badge: "🔥 جشنواره تابستانه",
        image: IMG.hero3,
        mobile_image: IMG.hero3,
        link: "/shop?category=salts",
        button_text: "مشاهده طعم‌های سالت",
        bg_gradient: "from-amber to-rose",
        text_color: "light",
        position: "hero",
        sort_order: 2,
        active: true,
      },
      {
        title: "پاد سیستم ویپرسو XROS 3 Pro",
        subtitle: "طراحی ارگونومیک، چیپست هوشمند و باتری فوق‌العاده بادوام برای استفاده روزمره",
        badge: "✨ جدیدترین ورود بازار",
        image: IMG.mod1,
        mobile_image: IMG.mod1,
        link: "/product/vaporesso-xros-3-pro",
        button_text: "بررسی مشخصات و قیمت",
        bg_gradient: "from-neon to-ice",
        text_color: "light",
        position: "hero",
        sort_order: 3,
        active: true,
      },
      {
        title: "تا ۱۵٪ تخفیف روی همه سالت‌ها",
        subtitle: "کد تخفیف VAPELAB15 — در صفحه پرداخت وارد کنید و از ارسال اکسپرس بهره‌مند شوید",
        badge: "کد تخفیف اختصاصی",
        image: IMG.promo1,
        mobile_image: IMG.promo1,
        link: "/shop?category=salts",
        button_text: "خرید سالت با تخفیف",
        bg_gradient: "from-neon to-ice",
        text_color: "light",
        position: "middle",
        sort_order: 1,
        active: true,
      },
    ];

    for (const b of banners) {
      await client.query(
        `INSERT INTO banners (title, subtitle, badge, image, mobile_image, link, button_text, bg_gradient, text_color, position, sort_order, active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [b.title, b.subtitle, b.badge, b.image, b.mobile_image, b.link, b.button_text, b.bg_gradient, b.text_color, b.position, b.sort_order, b.active]
      );
    }
    console.log("Banners seeded.");

    // Seed Demo Orders
    const demoOrders = [
      {
        number: "VPR-1006",
        name: "آرمان رضایی",
        email: "arman@example.com",
        phone: "09121234567",
        shipping: JSON.stringify({ line1: "تهران، سعادت آباد، بلوار پاکنژاد، پلاک ۱۲", city: "تهران", zip: "1998812345", country: "Iran" }),
        subtotal: 2280000,
        discount: 100000,
        shipping_fee: 0,
        total: 2180000,
        status: "processing",
        payment_status: "paid",
        payment_gateway: "shaparak_sim",
        courier: "پیک ویژه اکسپرس تهران (تحویل ۲ ساعته)",
        tracking_code: "EXP-98241",
        items: [
          { name: "پاد یک‌بارمصرف ELFBAR TE6000 (انگور یخ)", price: 990000, qty: 1, image: IMG.pod1 },
          { name: "سالت نستی Cush Man انبه یخ (۳۵mg)", price: 780000, qty: 1, image: IMG.salt1 },
        ],
      },
      {
        number: "VPR-1005",
        name: "سارا تهرانی",
        email: "sara@gmail.com",
        phone: "09357654321",
        shipping: JSON.stringify({ line1: "شیراز، خیابان ارم، کوچه ۶، پلاک ۳", city: "شیراز", zip: "7194812345", country: "Iran" }),
        subtotal: 1290000,
        discount: 0,
        shipping_fee: 65000,
        total: 1355000,
        status: "shipped",
        payment_status: "paid",
        payment_gateway: "shaparak_sim",
        courier: "پست پیشتاز هوایی جمهوری اسلامی",
        tracking_code: "PST-773829104",
        items: [
          { name: "VOZOL Gear 10000 (پشن فروت کولا)", price: 1290000, qty: 1, image: IMG.pod2 },
        ],
      },
      {
        number: "VPR-1004",
        name: "محمد حسینی",
        email: "mohammad@yahoo.com",
        phone: "09182223344",
        shipping: JSON.stringify({ line1: "اصفهان، خیابان چهارباغ بالا، مجتمع پارک", city: "اصفهان", zip: "8146511223", country: "Iran" }),
        subtotal: 2200000,
        discount: 0,
        shipping_fee: 0,
        total: 2200000,
        status: "delivered",
        payment_status: "paid",
        payment_gateway: "shaparak_sim",
        courier: "پست پیشتاز هوایی",
        tracking_code: "PST-662910482",
        items: [
          { name: "پاد سیستم ویپرسو XROS 3 Pro (مشکی مات)", price: 2200000, qty: 1, image: IMG.mod1 },
        ],
      },
    ];

    for (const o of demoOrders) {
      const orderRes = await client.query(
        `INSERT INTO orders (number, name, email, phone, shipping, subtotal, discount, shipping_fee, total, status, payment_status, payment_gateway, courier, tracking_code)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
         ON CONFLICT (number) DO UPDATE SET
           status = EXCLUDED.status, payment_status = EXCLUDED.payment_status,
           tracking_code = EXCLUDED.tracking_code, courier = EXCLUDED.courier
         RETURNING id`,
        [o.number, o.name, o.email, o.phone, o.shipping, o.subtotal, o.discount, o.shipping_fee, o.total, o.status, o.payment_status, o.payment_gateway, o.courier, o.tracking_code]
      );
      const orderId = orderRes.rows[0]?.id;
      if (orderId) {
        await client.query("DELETE FROM order_items WHERE order_id = $1", [orderId]);
        for (const item of o.items) {
          await client.query(
            `INSERT INTO order_items (order_id, name, image, price, qty) VALUES ($1, $2, $3, $4, $5)`,
            [orderId, item.name, item.image, item.price, item.qty]
          );
        }
      }
    }
    console.log("Demo orders seeded.");

    console.log("ALL SEEDING COMPLETED SUCCESSFULLY! ✨");
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    await client.end();
  }
}

seedData();

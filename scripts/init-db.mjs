import pg from "pg";

const { Client } = pg;

async function initDb() {
  const masterClient = new Client({
    connectionString: "postgresql://postgres:00000000@127.0.0.1:5432/postgres",
  });

  try {
    await masterClient.connect();
    console.log("Connected to PostgreSQL master server.");
    
    // Check if database exists
    const res = await masterClient.query(
      "SELECT 1 FROM pg_database WHERE datname = 'vape_lifestyle_db'"
    );
    if (res.rows.length === 0) {
      await masterClient.query("CREATE DATABASE vape_lifestyle_db");
      console.log("Database 'vape_lifestyle_db' created successfully.");
    } else {
      console.log("Database 'vape_lifestyle_db' already exists.");
    }
  } catch (err) {
    console.error("Master DB error:", err);
  } finally {
    await masterClient.end();
  }

  // Now connect to vape_lifestyle_db and create all tables
  const dbClient = new Client({
    connectionString: "postgresql://postgres:00000000@127.0.0.1:5432/vape_lifestyle_db",
  });

  try {
    await dbClient.connect();
    console.log("Connected to vape_lifestyle_db.");

    // Create Enum if not exists
    await dbClient.query(`
      DO $$ BEGIN
        CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'refunded');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create Tables
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT,
        is_admin BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS addresses (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL DEFAULT 'منزل',
        recipient_name TEXT,
        recipient_phone TEXT,
        line1 TEXT NOT NULL,
        line2 TEXT,
        city TEXT NOT NULL DEFAULT 'تهران',
        zip TEXT NOT NULL DEFAULT '',
        country TEXT NOT NULL DEFAULT 'Iran',
        is_default BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS brands (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        slug TEXT NOT NULL UNIQUE,
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        image TEXT,
        featured BOOLEAN NOT NULL DEFAULT true
      );

      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        slug TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        tagline TEXT,
        description TEXT NOT NULL,
        specs JSONB,
        price INTEGER NOT NULL,
        discount_price INTEGER,
        rating INTEGER NOT NULL DEFAULT 0,
        review_count INTEGER NOT NULL DEFAULT 0,
        stock INTEGER NOT NULL DEFAULT 0,
        variants JSONB,
        brand_id INTEGER REFERENCES brands(id),
        category_id INTEGER REFERENCES categories(id),
        images JSONB,
        featured BOOLEAN NOT NULL DEFAULT false,
        new_arrival BOOLEAN NOT NULL DEFAULT false,
        best_seller BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        author TEXT NOT NULL,
        rating INTEGER NOT NULL,
        title TEXT,
        body TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        number TEXT NOT NULL UNIQUE,
        user_id INTEGER REFERENCES users(id),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        shipping JSONB,
        coupon_code TEXT,
        subtotal INTEGER NOT NULL,
        discount INTEGER NOT NULL DEFAULT 0,
        shipping_fee INTEGER NOT NULL DEFAULT 0,
        total INTEGER NOT NULL,
        status order_status NOT NULL DEFAULT 'pending',
        payment_status TEXT NOT NULL DEFAULT 'unpaid',
        payment_ref TEXT,
        payment_gateway TEXT,
        payment_date TIMESTAMP,
        tracking_code TEXT,
        courier TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id),
        name TEXT NOT NULL,
        variant_id TEXT,
        color TEXT,
        image TEXT,
        price INTEGER NOT NULL,
        qty INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS wishlist (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS coupons (
        id SERIAL PRIMARY KEY,
        code TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL,
        percent INTEGER,
        fixed INTEGER,
        min_subtotal INTEGER NOT NULL DEFAULT 0,
        active BOOLEAN NOT NULL DEFAULT true,
        valid_until DATE
      );

      CREATE TABLE IF NOT EXISTS subscribers (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT,
        message TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS banners (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        subtitle TEXT,
        badge TEXT,
        image TEXT NOT NULL,
        mobile_image TEXT,
        link TEXT NOT NULL DEFAULT '/shop',
        button_text TEXT NOT NULL DEFAULT 'مشاهده و خرید',
        bg_gradient TEXT DEFAULT 'from-vio to-ice',
        text_color TEXT DEFAULT 'light',
        position TEXT NOT NULL DEFAULT 'hero',
        sort_order INTEGER NOT NULL DEFAULT 0,
        active BOOLEAN NOT NULL DEFAULT true,
        start_date TIMESTAMP,
        end_date TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    console.log("All tables created successfully in vape_lifestyle_db.");
  } catch (err) {
    console.error("Table creation error:", err);
  } finally {
    await dbClient.end();
  }
}

initDb();

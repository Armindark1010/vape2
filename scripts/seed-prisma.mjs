import bcrypt from '../backend/node_modules/bcryptjs/index.js';
import pg from 'pg';
const { Client } = pg;

async function seed() {
  const c = new Client({ connectionString: 'postgresql://postgres:00000000@127.0.0.1:5432/vape_lifestyle_db' });
  await c.connect();
  console.log('Connected to vape_lifestyle_db for seeding.');

  // 1. Ensure Global Commission Rate = 10%
  await c.query(`
    INSERT INTO global_settings (key, value, description, updated_at)
    VALUES ('commission_rate', '10', 'درصد کارمزد پیش‌فرض پلتفرم ویپ‌لب', NOW())
    ON CONFLICT (key) DO UPDATE SET value = '10', updated_at = NOW();
  `);
  console.log('✔ Global settings initialized.');

  // 2. Ensure Admin User
  const adminPassHash = await bcrypt.hash('Admin@VapeLab2026!', 10);
  const adminRes = await c.query(`
    INSERT INTO users (name, email, username, phone, password_hash, role, is_admin, created_at)
    VALUES ('مدیر ارشد ویپ‌لب', 'admin@vapelab.ir', 'admin', '09120000001', $1, 'ADMIN', true, NOW())
    ON CONFLICT (email) DO UPDATE SET password_hash = $1, role = 'ADMIN', is_admin = true, username = 'admin'
    RETURNING id;
  `, [adminPassHash]);
  const adminId = adminRes.rows[0].id;
  console.log(`✔ Admin user verified with ID ${adminId}.`);

  // 3. Ensure Primary Importer / Supplier
  const supplierPassHash = await bcrypt.hash('Supplier@2026!', 10);
  const supplierUserRes = await c.query(`
    INSERT INTO users (name, email, username, phone, password_hash, role, is_admin, created_at)
    VALUES ('تأمین‌کننده مرکزی ویپ‌لب', 'supplier@vapelab.ir', 'supplier1', '09120000002', $1, 'SUPPLIER', false, NOW())
    ON CONFLICT (email) DO UPDATE SET password_hash = $1, role = 'SUPPLIER', username = 'supplier1'
    RETURNING id;
  `, [supplierPassHash]);
  const supplierUserId = supplierUserRes.rows[0].id;

  const supplierRes = await c.query(`
    INSERT INTO suppliers (user_id, company_name, contact_name, phone, email, iban, is_active, commission_rate, created_at, updated_at)
    VALUES ($1, 'شرکت واردات و پخش نیکوتین‌پارس', 'مهندس صادقی', '09120000002', 'supplier@vapelab.ir', 'IR820120000000001234567890', true, 10, NOW(), NOW())
    ON CONFLICT (user_id) DO UPDATE SET is_active = true, commission_rate = 10, updated_at = NOW()
    RETURNING id;
  `, [supplierUserId]);
  const supplierId = supplierRes.rows[0].id;
  console.log(`✔ Primary supplier verified with ID ${supplierId}.`);

  // 4. Assign all unassigned products to the primary supplier
  await c.query(`
    UPDATE products SET supplier_id = $1 WHERE supplier_id IS NULL;
  `, [supplierId]);
  console.log('✔ Products linked to primary supplier.');

  // 5. Seed initial banners if table is empty
  const bannerCount = await c.query('SELECT count(*) FROM banners');
  if (Number(bannerCount.rows[0].count) === 0) {
    await c.query(`
      INSERT INTO banners (title, subtitle, image_url, link_url, badge, is_active, display_order, created_at)
      VALUES 
      ('نسل جدید پادسیستم‌های ۲۰۲۶', 'تجربه کام‌دهی نرم با سالت نیکوتین اصل مالزی', 'https://images.pexels.com/photos/19344605/pexels-photo-19344605.jpeg?auto=compress&cs=tinysrgb&w=1200', '/shop?cat=pods', 'تخفیف ویژه', true, 1, NOW()),
      ('انواع پاد یک‌بارمصرف الف‌بار', 'طعم‌های یخی و میوه‌ای با هولوگرام شرکتی', 'https://images.pexels.com/photos/9996339/pexels-photo-9996339.jpeg?auto=compress&cs=tinysrgb&w=1200', '/shop?brand=elfbar', 'پرفروش‌ترین', true, 2, NOW());
    `);
    console.log('✔ Default banners seeded.');
  }

  await c.end();
  console.log('All seeding complete.');
}

seed().catch(console.error);

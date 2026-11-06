const urls = [
  'http://localhost:3001/admin-panel/login',
  'http://localhost:3001/admin-panel',
  'http://localhost:3001/admin-panel/products',
  'http://localhost:3001/admin-panel/orders',
  'http://localhost:3001/admin-panel/customers',
  'http://localhost:3001/admin-panel/categories',
  'http://localhost:3001/admin-panel/brands',
  'http://localhost:3001/admin-panel/suppliers',
  'http://localhost:3001/admin-panel/suppliers/create',
  'http://localhost:3001/admin-panel/finance',
  'http://localhost:3001/admin-panel/banners',
  'http://localhost:3001/admin-panel/settings',
  'http://localhost:3001/supplier/login',
  'http://localhost:3001/supplier',
  'http://localhost:3001/supplier/products',
  'http://localhost:3001/supplier/orders',
  'http://localhost:3001/supplier/finance',
  'http://localhost:3001/supplier/profile',
  'http://localhost:3001/',
  'http://localhost:3001/shop'
];

async function check() {
  let passed = 0;
  for (const u of urls) {
    try {
      const res = await fetch(u);
      console.log(`[STATUS ${res.status}] ${u}`);
      if (res.status === 200) passed++;
    } catch (err) {
      console.error(`[FAILED] ${u} -> ${err.message}`);
    }
  }
  console.log(`\nVerified ${passed}/${urls.length} routes responded with 200 OK.`);
}

check();


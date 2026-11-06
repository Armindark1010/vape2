import pg from 'pg';
const { Client } = pg;

async function main() {
  const c = new Client({ connectionString: 'postgresql://postgres:00000000@127.0.0.1:5432/vape_lifestyle_db' });
  await c.connect();
  
  for (const table of ['users', 'products', 'categories', 'brands', 'orders']) {
    console.log(`\n=== Table: ${table} ===`);
    const cols = await c.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = '${table}'
      ORDER BY ordinal_position;
    `);
    console.log(cols.rows.map(r => `${r.column_name} (${r.data_type})`).join(', '));
    const sample = await c.query(`SELECT * FROM "${table}" LIMIT 1`);
    console.log('Sample row:', sample.rows[0]);
  }
  await c.end();
}

main().catch(console.error);

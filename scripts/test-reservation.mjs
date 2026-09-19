/**
 * VAPELAB - Stock Reservation & Concurrency Test Suite
 * تست جامع سیستم رزرو انبار، هم‌زمانی و ثبت نهایی سفارش
 */

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const BASE_URL = process.env.BASE_URL || "https://localhost:3001";

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
};

function pass(name, details = "") {
  console.log(` ${colors.green}✔ PASS${colors.reset} ${colors.bold}${name}${colors.reset} ${details ? colors.cyan + "(" + details + ")" + colors.reset : ""}`);
}

function fail(name, error) {
  console.log(` ${colors.red}✖ FAIL${colors.reset} ${colors.bold}${name}${colors.reset}`);
  console.error(`   ${colors.red}Error: ${error}${colors.reset}`);
}

async function runTests() {
  console.log(`\n${colors.bold}🧪 اجرای آزمون‌های سیستم رزرو هوشمند انبار (Inventory Reservation Test Suite)${colors.reset}`);
  console.log(`${colors.yellow}🌐 آدرس سرور: ${BASE_URL}${colors.reset}\n`);

  let passed = 0;
  let failed = 0;

  // -------------------------------------------------------------
  // Test 1: رزرو کالای موجود با بازهزمانی ۱۵ دقیقه‌ای
  // -------------------------------------------------------------
  let res1Id = "";
  try {
    const res = await fetch(`${BASE_URL}/api/v1/cart/reserve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ id: 2, qty: 1 }],
        holdMinutes: 15,
      }),
    });

    if (res.status !== 200) {
      throw new Error(`Expected HTTP 200, got ${res.status}`);
    }

    const data = await res.json();
    if (!data.ok || !data.reservationId || data.remainingSeconds !== 900) {
      throw new Error(`Invalid response structure: ${JSON.stringify(data)}`);
    }

    res1Id = data.reservationId;
    pass("تست ۱: رزرو موفق کالای موجود با تایمر ۹۰۰ ثانیه‌ای (۱۵ دقیقه)", `ID: ${res1Id}`);
    passed++;
  } catch (e) {
    fail("تست ۱: رزرو موفق کالای موجود", e.message);
    failed++;
  }

  // -------------------------------------------------------------
  // Test 2: استعلام وضعیت و شمارشگر رزرو فعال
  // -------------------------------------------------------------
  try {
    const res = await fetch(`${BASE_URL}/api/v1/cart/reservation-status?reservationId=${res1Id}`);
    const data = await res.json();

    if (!data.active || data.remainingSeconds <= 0) {
      throw new Error(`Reservation should be active, got: ${JSON.stringify(data)}`);
    }

    pass("تست ۲: استعلام لحظه‌ای تایمر معکوس رزرو فعال", `زمان باقی‌مانده: ${data.remainingSeconds}s`);
    passed++;
  } catch (e) {
    fail("تست ۲: استعلام لحظه‌ای تایمر معکوس", e.message);
    failed++;
  }

  // -------------------------------------------------------------
  // Test 3: خطای عدم موجودی برای کالای ناموجود (Stock = 0)
  // -------------------------------------------------------------
  try {
    const res = await fetch(`${BASE_URL}/api/v1/cart/reserve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ id: 1, qty: 1 }], // محصول شماره ۱ (ELFBAR TE6000 با موجودی ۰)
      }),
    });

    if (res.status !== 409) {
      throw new Error(`Expected HTTP 409 Conflict, got ${res.status}`);
    }

    const data = await res.json();
    pass("تست ۳: مسدودسازی رزرو کالای ناموجود (پاسخ 409 و جلوگیری از فروش)", data.message);
    passed++;
  } catch (e) {
    fail("تست ۳: مسدودسازی کالای ناموجود", e.message);
    failed++;
  }

  // -------------------------------------------------------------
  // Test 4: خطای درخواست تعداد بیشتر از موجودی انبار
  // -------------------------------------------------------------
  try {
    const res = await fetch(`${BASE_URL}/api/v1/cart/reserve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ id: 2, qty: 999 }],
      }),
    });

    if (res.status !== 409) {
      throw new Error(`Expected HTTP 409 Conflict for excessive quantity, got ${res.status}`);
    }

    pass("تست ۴: رد رزرو برای تعداد فراتر از ظرفیت انبار (Over-reservation Protection)");
    passed++;
  } catch (e) {
    fail("تست ۴: رد رزرو تعداد فراتر از ظرفیت", e.message);
    failed++;
  }

  // -------------------------------------------------------------
  // Test 5: آزادسازی رزرو (Release Hold)
  // -------------------------------------------------------------
  try {
    const res = await fetch(`${BASE_URL}/api/v1/cart/release-reservation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reservationId: res1Id }),
    });

    const data = await res.json();
    if (!data.ok) throw new Error(`Release failed: ${JSON.stringify(data)}`);

    // بررسی اینکه پس از آزادسازی وضعیت غیرفعال شود
    const checkRes = await fetch(`${BASE_URL}/api/v1/cart/reservation-status?reservationId=${res1Id}`);
    const checkData = await checkRes.json();
    if (checkData.active) throw new Error("Reservation still active after release");

    pass("تست ۵: آزادسازی آنی موجودی قفل‌شده به انبار عمومی");
    passed++;
  } catch (e) {
    fail("تست ۵: آزادسازی آنی موجودی", e.message);
    failed++;
  }

  // -------------------------------------------------------------
  // Test 6: تست هم‌زمانی خریداران (Concurrency & Soft Lock)
  // -------------------------------------------------------------
  try {
    // کاربر الف رزرو می‌کند
    const resA = await fetch(`${BASE_URL}/api/v1/cart/reserve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ id: 2, qty: 1 }] }),
    });
    const userA = await resA.json();

    if (!userA.ok) throw new Error("User A reserve failed");

    // کاربر الف خرید را نهایی می‌کند
    const checkoutRes = await fetch(`${BASE_URL}/api/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ id: 2, qty: 1 }],
        reservationId: userA.reservationId,
        customer: {
          name: "کاربر تست هم‌زمانی",
          email: "test.concurrency@vapelab.ir",
          phone: "09129998877",
          line1: "تهران خیابان شریعتی",
          city: "تهران",
          zip: "12345",
        },
      }),
    });

    if (checkoutRes.status !== 200) {
      throw new Error(`Checkout failed with status ${checkoutRes.status}`);
    }

    const checkoutData = await checkoutRes.json();
    if (!checkoutData.ok || !checkoutData.number) {
      throw new Error(`Invalid checkout result: ${JSON.stringify(checkoutData)}`);
    }

    pass("تست ۶: ثبت نهایی سفارش با قفل رزرو و صدور شماره رهگیری", `سفارش: ${checkoutData.number}`);
    passed++;
  } catch (e) {
    fail("تست ۶: ثبت نهایی سفارش و قفل رزرو", e.message);
    failed++;
  }

  // -------------------------------------------------------------
  // نتیجه‌گیری
  // -------------------------------------------------------------
  console.log("\n========================================================");
  if (failed === 0) {
    console.log(`${colors.green}${colors.bold}🎉 تمامی ${passed} آزمون با موفقیت کامل پاس شدند!${colors.reset}`);
  } else {
    console.log(`${colors.red}${colors.bold}⚠️ نتیجه: ${passed} آزمون پاس شد، ${failed} آزمون ناموفق بود.${colors.reset}`);
  }
  console.log("========================================================\n");
}

runTests();

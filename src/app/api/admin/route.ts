import { NextResponse } from "next/server";
import { setStock, setOrderStatus, deleteReview, createCoupon } from "@/db/queries";

/* Demo admin mutations. In production this would sit behind real auth. */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    switch (body?.action) {
      case "stock": {
        const id = Number(body.id);
        const stock = Number(body.stock);
        if (!id || Number.isNaN(stock)) throw new Error("bad payload");
        await setStock(id, Math.min(999, Math.max(0, stock)));
        return NextResponse.json({ ok: true });
      }
      case "order-status": {
        const id = Number(body.id);
        const allowed = ["pending", "processing", "shipped", "delivered", "refunded"];
        if (!id || !allowed.includes(body.status)) throw new Error("bad payload");
        await setOrderStatus(id, body.status);
        return NextResponse.json({ ok: true });
      }
      case "review-delete": {
        const id = Number(body.id);
        if (!id) throw new Error("bad payload");
        await deleteReview(id);
        return NextResponse.json({ ok: true });
      }
      case "coupon-create": {
        const code = String(body.code ?? "").toUpperCase().trim();
        const percent = Number(body.percent);
        if (!/^[A-Z0-9]{3,16}$/.test(code) || Number.isNaN(percent) || percent <= 0 || percent > 90) {
          return NextResponse.json({ error: "Code must be 3–16 letters/digits; percent 1–90." }, { status: 400 });
        }
        await createCoupon({
          code,
          description: body.description ? String(body.description) : `${percent}% off orders`,
          percent,
          minSubtotal: Number(body.minSubtotal) || 0,
        });
        return NextResponse.json({ ok: true });
      }
      default:
        return NextResponse.json({ error: "Unknown action." }, { status: 400 });
    }
  } catch (e) {
    console.error("admin mutation error", e);
    return NextResponse.json({ error: "Action failed." }, { status: 500 });
  }
}

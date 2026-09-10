import { NextResponse } from "next/server";
import { validateCoupon } from "@/db/queries";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code")?.trim().toUpperCase();
  if (!code) return NextResponse.json({ error: "Missing code." }, { status: 400 });
  const coupon = await validateCoupon(code);
  if (!coupon) return NextResponse.json({ error: "That code isn't valid or has expired." }, { status: 404 });
  return NextResponse.json({ coupon });
}

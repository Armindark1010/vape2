import { NextResponse } from "next/server";
import { createReview } from "@/db/queries";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body?.productId || !body?.author || !body?.body) {
      return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
    }
    await createReview({
      productId: Number(body.productId),
      author: String(body.author),
      rating: Number(body.rating) || 5,
      title: body.title ? String(body.title) : "",
      body: String(body.body),
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("review error", e);
    return NextResponse.json({ error: "Couldn't submit the review." }, { status: 500 });
  }
}

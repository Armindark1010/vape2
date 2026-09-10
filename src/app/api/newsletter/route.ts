import { NextResponse } from "next/server";
import { subscribe } from "@/db/queries";
import { emailOk } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!emailOk(body?.email ?? "")) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }
    await subscribe(String(body.email).toLowerCase());
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("newsletter error", e);
    return NextResponse.json({ error: "Couldn't subscribe." }, { status: 500 });
  }
}

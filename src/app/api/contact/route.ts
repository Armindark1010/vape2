import { NextResponse } from "next/server";
import { createContact } from "@/db/queries";
import { emailOk } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body?.name || !emailOk(body.email ?? "") || !body?.message) {
      return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
    }
    await createContact({
      name: String(body.name).slice(0, 120),
      email: String(body.email).slice(0, 160),
      subject: body.subject ? String(body.subject).slice(0, 120) : "General",
      message: String(body.message).slice(0, 4000),
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("contact error", e);
    return NextResponse.json({ error: "Couldn't send your message." }, { status: 500 });
  }
}

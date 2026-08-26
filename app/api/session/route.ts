import { NextRequest, NextResponse } from "next/server";
import { getClientIp, isRateLimited, recordAttempt, verifyPassword } from "@/lib/auth";
import { createSession, destroySession, hasValidSession } from "@/lib/session";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET() {
  const authed = await hasValidSession();
  return NextResponse.json({ authed });
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  if (await isRateLimited(ip)) {
    await delay(1500);
    return NextResponse.json({ ok: false, error: "too_many_attempts" }, { status: 429 });
  }

  let password = "";
  try {
    const body = await request.json();
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const valid = await verifyPassword(password);
  await recordAttempt(ip, valid);

  if (!valid) {
    await delay(800);
    return NextResponse.json({ ok: false, error: "invalid_credentials" }, { status: 401 });
  }

  await createSession();
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await destroySession();
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { hasValidSession } from "@/lib/session";

export async function requireSession(): Promise<NextResponse | null> {
  const ok = await hasValidSession();
  if (!ok) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  return null;
}

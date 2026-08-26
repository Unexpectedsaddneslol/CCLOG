import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/adminGuard";
import { prisma } from "@/lib/prisma";

const FIELDS = ["qrImage", "joinText", "email", "telegramUrl", "tiktokUrl", "youtubeUrl", "servicesContent"];

export async function GET() {
  const unauthorized = await requireSession();
  if (unauthorized) return unauthorized;

  const settings = await prisma.siteSettings.upsert({
    where: { id: "main" },
    create: { id: "main" },
    update: {},
  });
  return NextResponse.json({ ok: true, item: settings });
}

export async function PATCH(request: NextRequest) {
  const unauthorized = await requireSession();
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => ({}));
  const data: Record<string, string> = {};
  for (const f of FIELDS) {
    if (typeof body[f] === "string") data[f] = body[f];
  }

  const updated = await prisma.siteSettings.update({ where: { id: "main" }, data });
  return NextResponse.json({ ok: true, item: updated });
}

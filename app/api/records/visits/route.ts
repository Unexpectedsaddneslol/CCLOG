import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/adminGuard";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 100;

export async function GET(request: NextRequest) {
  const unauthorized = await requireSession();
  if (unauthorized) return unauthorized;

  const page = Math.max(0, Number(request.nextUrl.searchParams.get("page") ?? 0) || 0);

  const [items, total] = await Promise.all([
    prisma.visitLog.findMany({
      orderBy: { createdAt: "desc" },
      skip: page * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.visitLog.count(),
  ]);

  return NextResponse.json({ ok: true, items, total, pageSize: PAGE_SIZE });
}

export async function DELETE() {
  const unauthorized = await requireSession();
  if (unauthorized) return unauthorized;

  await prisma.visitLog.deleteMany({});
  return NextResponse.json({ ok: true });
}

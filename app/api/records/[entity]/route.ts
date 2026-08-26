import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/adminGuard";
import { ENTITIES } from "@/lib/entities";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ entity: string }> }
) {
  const unauthorized = await requireSession();
  if (unauthorized) return unauthorized;

  const { entity } = await params;
  const config = ENTITIES[entity];
  if (!config) return NextResponse.json({ ok: false, error: "unknown_entity" }, { status: 404 });

  const items = await config.delegate.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ ok: true, items });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ entity: string }> }
) {
  const unauthorized = await requireSession();
  if (unauthorized) return unauthorized;

  const { entity } = await params;
  const config = ENTITIES[entity];
  if (!config) return NextResponse.json({ ok: false, error: "unknown_entity" }, { status: 404 });

  const body = await request.json().catch(() => ({}));
  const data = config.buildCreateData(body);
  const created = await config.delegate.create({ data });
  return NextResponse.json({ ok: true, item: created });
}

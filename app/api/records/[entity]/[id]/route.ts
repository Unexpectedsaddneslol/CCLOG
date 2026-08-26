import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/adminGuard";
import { ENTITIES, pickFields } from "@/lib/entities";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ entity: string; id: string }> }
) {
  const unauthorized = await requireSession();
  if (unauthorized) return unauthorized;

  const { entity, id } = await params;
  const config = ENTITIES[entity];
  if (!config) return NextResponse.json({ ok: false, error: "unknown_entity" }, { status: 404 });

  const body = await request.json().catch(() => ({}));
  const data = pickFields(entity, body);

  if ("order" in data) data.order = Number(data.order);
  if ("published" in data) data.published = Boolean(data.published);

  const updated = await config.delegate.update({ where: { id }, data });
  return NextResponse.json({ ok: true, item: updated });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ entity: string; id: string }> }
) {
  const unauthorized = await requireSession();
  if (unauthorized) return unauthorized;

  const { entity, id } = await params;
  const config = ENTITIES[entity];
  if (!config) return NextResponse.json({ ok: false, error: "unknown_entity" }, { status: 404 });

  await config.delegate.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

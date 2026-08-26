import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { UPLOADS_DIR } from "@/lib/uploadsDir";

// Only needed when UPLOADS_DIR points outside public/ (a persistent-volume
// path on hosts with an ephemeral filesystem) — see lib/uploadsDir.ts. When
// UPLOADS_DIR is unset, Next already serves public/uploads/* statically and
// this route is redundant but harmless (same bytes, same path).
const CONTENT_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
};

export async function GET(_request: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;

  // Uploaded filenames are always flat (see app/api/upload/route.ts) — reject
  // anything that looks like a path segment to stay inside UPLOADS_DIR.
  if (!filename || filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    return new NextResponse("Not found", { status: 404 });
  }

  const filePath = path.join(UPLOADS_DIR, filename);

  try {
    const info = await stat(filePath);
    if (!info.isFile()) throw new Error("not a file");
    const buffer = await readFile(filePath);
    const ext = path.extname(filename).toLowerCase();
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": CONTENT_TYPES[ext] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}

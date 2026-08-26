import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getClientIp } from "@/lib/auth";

function parseLanguage(header: string | null): string {
  if (!header) return "";
  return header.split(",")[0]?.split(";")[0]?.trim() ?? "";
}

export function proxy(request: NextRequest, event: NextFetchEvent) {
  const ip = getClientIp(request);
  const userAgent = request.headers.get("user-agent") ?? "";
  const language = parseLanguage(request.headers.get("accept-language"));
  const path = request.nextUrl.pathname;

  event.waitUntil(
    prisma.visitLog.create({ data: { ip, userAgent, language, path } }).catch(() => {})
  );

  return NextResponse.next();
}

export const config = {
  matcher: [
    {
      source:
        "/((?!api|_next/static|_next/image|assets|fonts|uploads|favicon.ico|icon.png|sitemap.xml|robots.txt).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_FAILURES_IN_WINDOW = 5;

export async function isRateLimited(ip: string): Promise<boolean> {
  const since = new Date(Date.now() - WINDOW_MS);
  const failures = await prisma.loginAttempt.count({
    where: { ip, success: false, createdAt: { gte: since } },
  });
  return failures >= MAX_FAILURES_IN_WINDOW;
}

export async function recordAttempt(ip: string, success: boolean): Promise<void> {
  await prisma.loginAttempt.create({ data: { ip, success } });
}

export async function verifyPassword(password: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) return false;
  if (!password) return false;
  return bcrypt.compare(password, hash);
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

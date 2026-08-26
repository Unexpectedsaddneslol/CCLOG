import { prisma } from "@/lib/prisma";
import { stripHtml, truncate } from "@/lib/text";
import { getPdfTextSnippet } from "@/lib/pdfSnippet";

const CONTENT_SNIPPET_LENGTH = 420;

async function withContentSnippet<T extends { body: string; pdfFile: string }>(item: T) {
  const contentSnippet = item.pdfFile
    ? await getPdfTextSnippet(item.pdfFile)
    : truncate(stripHtml(item.body), CONTENT_SNIPPET_LENGTH);
  return { ...item, contentSnippet };
}

export async function getInvestigations(limit?: number) {
  const rows = await prisma.investigation.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    take: limit,
  });
  return Promise.all(rows.map(withContentSnippet));
}

export async function getArticles(limit?: number) {
  const rows = await prisma.article.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    take: limit,
  });
  return Promise.all(rows.map(withContentSnippet));
}

export async function getInvestigationBySlug(slug: string) {
  return prisma.investigation.findFirst({ where: { slug, published: true } });
}

export async function getArticleBySlug(slug: string) {
  return prisma.article.findFirst({ where: { slug, published: true } });
}

export async function getTools() {
  return prisma.tool.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });
}

export async function getServices() {
  return prisma.service.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });
}

export async function getPartners() {
  return prisma.partner.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });
}

export async function getFollowers(limit?: number) {
  return prisma.follower.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    take: limit,
  });
}

export async function getSiteSettings() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "main" } });
  if (settings) return settings;
  return prisma.siteSettings.create({ data: { id: "main" } });
}

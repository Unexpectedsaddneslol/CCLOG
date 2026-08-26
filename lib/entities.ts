import { prisma } from "@/lib/prisma";
import { randomSuffix, slugify } from "@/lib/slug";

type AnyRecord = Record<string, unknown>;

type EntityConfig = {
  delegate: {
    findMany: (args: unknown) => Promise<AnyRecord[]>;
    create: (args: unknown) => Promise<AnyRecord>;
    update: (args: unknown) => Promise<AnyRecord>;
    delete: (args: unknown) => Promise<AnyRecord>;
  };
  fields: string[];
  buildCreateData: (data: AnyRecord) => AnyRecord;
};

function pick(data: AnyRecord, fields: string[]): AnyRecord {
  const out: AnyRecord = {};
  for (const f of fields) {
    if (f in data) out[f] = data[f];
  }
  return out;
}

export const ENTITIES: Record<string, EntityConfig> = {
  investigations: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delegate: prisma.investigation as any,
    fields: ["title", "slug", "excerpt", "body", "coverImage", "pdfFile", "order", "published"],
    buildCreateData: (data) => ({
      title: (data.title as string) || "Новое расследование",
      slug: (data.slug as string) || `${slugify((data.title as string) || "rassledovanie")}-${randomSuffix()}`,
      excerpt: (data.excerpt as string) || "",
      body: (data.body as string) || "",
      coverImage: (data.coverImage as string) || "/assets/tools/noise.png",
      pdfFile: (data.pdfFile as string) || "",
      order: Number(data.order ?? 0),
      published: data.published !== false,
    }),
  },
  articles: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delegate: prisma.article as any,
    fields: ["title", "slug", "excerpt", "body", "coverImage", "pdfFile", "order", "published"],
    buildCreateData: (data) => ({
      title: (data.title as string) || "Новая статья",
      slug: (data.slug as string) || `${slugify((data.title as string) || "statya")}-${randomSuffix()}`,
      excerpt: (data.excerpt as string) || "",
      body: (data.body as string) || "",
      coverImage: (data.coverImage as string) || "/assets/tools/noise.png",
      pdfFile: (data.pdfFile as string) || "",
      order: Number(data.order ?? 0),
      published: data.published !== false,
    }),
  },
  tools: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delegate: prisma.tool as any,
    fields: ["name", "description", "icon", "url", "order", "published"],
    buildCreateData: (data) => ({
      name: (data.name as string) || "Новый инструмент",
      description: (data.description as string) || "",
      icon: (data.icon as string) || "/assets/tools/whiteboard.png",
      url: (data.url as string) || "",
      order: Number(data.order ?? 0),
      published: data.published !== false,
    }),
  },
  services: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delegate: prisma.service as any,
    fields: ["name", "description", "icon", "shadow", "order", "published"],
    buildCreateData: (data) => ({
      name: (data.name as string) || "Новая услуга",
      description: (data.description as string) || "",
      icon: (data.icon as string) || "/assets/service/docs.png",
      shadow: (data.shadow as string) || "",
      order: Number(data.order ?? 0),
      published: data.published !== false,
    }),
  },
  partners: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delegate: prisma.partner as any,
    fields: ["name", "description", "logo", "url", "order", "published"],
    buildCreateData: (data) => ({
      name: (data.name as string) || "Новый партнёр",
      description: (data.description as string) || "",
      logo: (data.logo as string) || "/assets/partners/oathnet.png",
      url: (data.url as string) || "",
      order: Number(data.order ?? 0),
      published: data.published !== false,
    }),
  },
  followers: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delegate: prisma.follower as any,
    fields: ["name", "avatar", "telegramUrl", "order", "published"],
    buildCreateData: (data) => ({
      name: (data.name as string) || "Новый последователь",
      avatar: (data.avatar as string) || "/assets/followers/f1.svg",
      telegramUrl: (data.telegramUrl as string) || "https://t.me/counterculture",
      order: Number(data.order ?? 0),
      published: data.published !== false,
    }),
  },
};

export function pickFields(entity: string, data: AnyRecord): AnyRecord {
  const config = ENTITIES[entity];
  return pick(data, config.fields);
}

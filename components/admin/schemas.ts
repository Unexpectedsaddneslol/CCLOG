export type FieldDef = {
  key: string;
  label: string;
  type: "text" | "textarea" | "richtext" | "number" | "checkbox" | "image" | "pdf";
};

export type EntityTab = {
  key: string;
  label: string;
  itemLabel: (item: Record<string, unknown>) => string;
  fields: FieldDef[];
};

export const ENTITY_TABS: EntityTab[] = [
  {
    key: "investigations",
    label: "Расследования",
    itemLabel: (i) => String(i.title ?? ""),
    fields: [
      { key: "title", label: "Заголовок", type: "text" },
      { key: "slug", label: "Slug (URL)", type: "text" },
      { key: "excerpt", label: "Краткое описание", type: "textarea" },
      { key: "body", label: "Текст", type: "richtext" },
      { key: "coverImage", label: "Обложка", type: "image" },
      { key: "pdfFile", label: "PDF-отчёт", type: "pdf" },
      { key: "order", label: "Порядок", type: "number" },
      { key: "published", label: "Опубликовано", type: "checkbox" },
    ],
  },
  {
    key: "articles",
    label: "Статьи",
    itemLabel: (i) => String(i.title ?? ""),
    fields: [
      { key: "title", label: "Заголовок", type: "text" },
      { key: "slug", label: "Slug (URL)", type: "text" },
      { key: "excerpt", label: "Краткое описание", type: "textarea" },
      { key: "body", label: "Текст", type: "richtext" },
      { key: "coverImage", label: "Обложка", type: "image" },
      { key: "pdfFile", label: "PDF-статья", type: "pdf" },
      { key: "order", label: "Порядок", type: "number" },
      { key: "published", label: "Опубликовано", type: "checkbox" },
    ],
  },
  {
    key: "tools",
    label: "Инструменты",
    itemLabel: (i) => String(i.name ?? ""),
    fields: [
      { key: "name", label: "Название", type: "text" },
      { key: "description", label: "Описание", type: "textarea" },
      { key: "icon", label: "Иконка", type: "image" },
      { key: "url", label: "Ссылка", type: "text" },
      { key: "order", label: "Порядок", type: "number" },
      { key: "published", label: "Опубликовано", type: "checkbox" },
    ],
  },
  {
    key: "services",
    label: "Услуги",
    itemLabel: (i) => String(i.name ?? ""),
    fields: [
      { key: "name", label: "Название", type: "text" },
      { key: "description", label: "Описание", type: "textarea" },
      { key: "icon", label: "Иконка", type: "image" },
      { key: "shadow", label: "Подложка (shadow)", type: "image" },
      { key: "order", label: "Порядок", type: "number" },
      { key: "published", label: "Опубликовано", type: "checkbox" },
    ],
  },
  {
    key: "partners",
    label: "Партнёры",
    itemLabel: (i) => String(i.name ?? ""),
    fields: [
      { key: "name", label: "Название", type: "text" },
      { key: "description", label: "Описание", type: "textarea" },
      { key: "logo", label: "Логотип", type: "image" },
      { key: "url", label: "Ссылка", type: "text" },
      { key: "order", label: "Порядок", type: "number" },
      { key: "published", label: "Опубликовано", type: "checkbox" },
    ],
  },
  {
    key: "followers",
    label: "Последователи",
    itemLabel: (i) => String(i.name ?? ""),
    fields: [
      { key: "name", label: "Имя", type: "text" },
      { key: "avatar", label: "Аватар", type: "image" },
      { key: "telegramUrl", label: "Ссылка на Telegram", type: "text" },
      { key: "order", label: "Порядок", type: "number" },
      { key: "published", label: "Опубликовано", type: "checkbox" },
    ],
  },
];

export const SETTINGS_FIELDS: FieldDef[] = [
  { key: "qrImage", label: "QR-код", type: "image" },
  { key: "joinText", label: "Текст вступления", type: "textarea" },
  { key: "email", label: "Почта", type: "text" },
  { key: "telegramUrl", label: "Telegram", type: "text" },
  { key: "tiktokUrl", label: "TikTok", type: "text" },
  { key: "youtubeUrl", label: "YouTube", type: "text" },
  { key: "servicesContent", label: "Содержимое страницы «Услуги»", type: "richtext" },
];

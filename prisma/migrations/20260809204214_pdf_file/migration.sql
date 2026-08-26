-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Article" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "body" TEXT NOT NULL DEFAULT '',
    "coverImage" TEXT NOT NULL,
    "pdfFile" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Article" ("body", "coverImage", "createdAt", "excerpt", "id", "order", "published", "slug", "title", "updatedAt") SELECT "body", "coverImage", "createdAt", "excerpt", "id", "order", "published", "slug", "title", "updatedAt" FROM "Article";
DROP TABLE "Article";
ALTER TABLE "new_Article" RENAME TO "Article";
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");
CREATE TABLE "new_Investigation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "body" TEXT NOT NULL DEFAULT '',
    "coverImage" TEXT NOT NULL,
    "pdfFile" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Investigation" ("body", "coverImage", "createdAt", "excerpt", "id", "order", "published", "slug", "title", "updatedAt") SELECT "body", "coverImage", "createdAt", "excerpt", "id", "order", "published", "slug", "title", "updatedAt" FROM "Investigation";
DROP TABLE "Investigation";
ALTER TABLE "new_Investigation" RENAME TO "Investigation";
CREATE UNIQUE INDEX "Investigation_slug_key" ON "Investigation"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

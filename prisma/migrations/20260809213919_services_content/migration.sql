-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'main',
    "qrImage" TEXT NOT NULL DEFAULT '/assets/archive/qr.png',
    "joinText" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT 'dd1kfuckedthem@proton.me',
    "telegramUrl" TEXT NOT NULL DEFAULT '',
    "tiktokUrl" TEXT NOT NULL DEFAULT '',
    "youtubeUrl" TEXT NOT NULL DEFAULT '',
    "servicesContent" TEXT NOT NULL DEFAULT '',
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_SiteSettings" ("email", "id", "joinText", "qrImage", "telegramUrl", "tiktokUrl", "updatedAt", "youtubeUrl") SELECT "email", "id", "joinText", "qrImage", "telegramUrl", "tiktokUrl", "updatedAt", "youtubeUrl" FROM "SiteSettings";
DROP TABLE "SiteSettings";
ALTER TABLE "new_SiteSettings" RENAME TO "SiteSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

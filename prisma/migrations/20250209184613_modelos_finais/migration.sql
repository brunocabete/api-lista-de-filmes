/*
  Warnings:

  - You are about to alter the column `avaliado` on the `Filme` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Filme" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "moviedbId" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "sinopse" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assistido" BOOLEAN NOT NULL DEFAULT false,
    "avaliado" DECIMAL,
    "recomendado" BOOLEAN
);
INSERT INTO "new_Filme" ("assistido", "avaliado", "createdAt", "id", "moviedbId", "recomendado", "sinopse", "titulo") SELECT "assistido", "avaliado", "createdAt", "id", "moviedbId", "recomendado", "sinopse", "titulo" FROM "Filme";
DROP TABLE "Filme";
ALTER TABLE "new_Filme" RENAME TO "Filme";
CREATE TABLE "new_Log" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "metodo" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "statusResposta" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "filmeId" INTEGER,
    "body" TEXT,
    "usuarioId" INTEGER,
    CONSTRAINT "Log_filmeId_fkey" FOREIGN KEY ("filmeId") REFERENCES "Filme" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Log" ("createdAt", "filmeId", "id", "metodo", "statusResposta", "url") SELECT "createdAt", "filmeId", "id", "metodo", "statusResposta", "url" FROM "Log";
DROP TABLE "Log";
ALTER TABLE "new_Log" RENAME TO "Log";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

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
    "avaliado" INTEGER,
    "recomendado" BOOLEAN
);
INSERT INTO "new_Filme" ("assistido", "avaliado", "createdAt", "id", "moviedbId", "recomendado", "sinopse", "titulo") SELECT "assistido", "avaliado", "createdAt", "id", "moviedbId", "recomendado", "sinopse", "titulo" FROM "Filme";
DROP TABLE "Filme";
ALTER TABLE "new_Filme" RENAME TO "Filme";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

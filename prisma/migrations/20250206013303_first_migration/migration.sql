-- CreateTable
CREATE TABLE "Filme" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "moviedbId" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "sinopse" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assistido" BOOLEAN NOT NULL,
    "avaliado" INTEGER NOT NULL,
    "recomendado" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "Genero" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "genero" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Filme_Genero" (
    "filmeId" INTEGER NOT NULL,
    "generoId" INTEGER NOT NULL,

    PRIMARY KEY ("filmeId", "generoId"),
    CONSTRAINT "Filme_Genero_filmeId_fkey" FOREIGN KEY ("filmeId") REFERENCES "Filme" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Filme_Genero_generoId_fkey" FOREIGN KEY ("generoId") REFERENCES "Genero" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

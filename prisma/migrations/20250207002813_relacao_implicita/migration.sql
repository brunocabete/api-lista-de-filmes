/*
  Warnings:

  - You are about to drop the `Filme_Genero` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[genero]` on the table `Genero` will be added. If there are existing duplicate values, this will fail.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Filme_Genero";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_FilmeToGenero" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_FilmeToGenero_A_fkey" FOREIGN KEY ("A") REFERENCES "Filme" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_FilmeToGenero_B_fkey" FOREIGN KEY ("B") REFERENCES "Genero" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_FilmeToGenero_AB_unique" ON "_FilmeToGenero"("A", "B");

-- CreateIndex
CREATE INDEX "_FilmeToGenero_B_index" ON "_FilmeToGenero"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Genero_genero_key" ON "Genero"("genero");

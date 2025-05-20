/*
  Warnings:

  - You are about to drop the column `description` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Model` table. All the data in the column will be lost.
  - Added the required column `isGlobal` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider` to the `Model` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Directory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "path" TEXT NOT NULL,
    "modelId" INTEGER NOT NULL,
    CONSTRAINT "Directory_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Model" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "isGlobal" BOOLEAN NOT NULL
);
INSERT INTO "new_Model" ("id", "key", "name") SELECT "id", "key", "name" FROM "Model";
DROP TABLE "Model";
ALTER TABLE "new_Model" RENAME TO "Model";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Directory_path_key" ON "Directory"("path");

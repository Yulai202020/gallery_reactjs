/*
  Warnings:

  - Added the required column `alt` to the `Images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject` to the `Images` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Images" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "alt" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "username" TEXT NOT NULL
);
INSERT INTO "new_Images" ("filename", "id", "username") SELECT "filename", "id", "username" FROM "Images";
DROP TABLE "Images";
ALTER TABLE "new_Images" RENAME TO "Images";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

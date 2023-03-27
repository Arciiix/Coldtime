/*
  Warnings:

  - You are about to drop the column `password` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `user` on the `Device` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Device" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ip" TEXT NOT NULL,
    "port" INTEGER NOT NULL DEFAULT 56000,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Device" ("id", "ip", "name", "port") SELECT "id", "ip", "name", "port" FROM "Device";
DROP TABLE "Device";
ALTER TABLE "new_Device" RENAME TO "Device";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

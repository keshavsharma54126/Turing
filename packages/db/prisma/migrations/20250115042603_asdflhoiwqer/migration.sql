/*
  Warnings:

  - You are about to drop the column `SessionQuerryCount` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `testCount` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "SessionQuerryCount",
DROP COLUMN "testCount";

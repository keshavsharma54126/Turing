/*
  Warnings:

  - You are about to drop the column `type` on the `resources` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "resources" DROP COLUMN "type";

-- DropEnum
DROP TYPE "ResourceType";

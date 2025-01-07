/*
  Warnings:

  - You are about to drop the column `answers` on the `tests` table. All the data in the column will be lost.
  - The `questions` column on the `tests` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "tests" DROP COLUMN "answers",
DROP COLUMN "questions",
ADD COLUMN     "questions" JSONB[];

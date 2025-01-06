/*
  Warnings:

  - You are about to drop the column `description` on the `tests` table. All the data in the column will be lost.
  - Added the required column `difficulty` to the `tests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numQuestions` to the `tests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topic` to the `tests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tests" DROP COLUMN "description",
ADD COLUMN     "answers" JSONB,
ADD COLUMN     "difficulty" TEXT NOT NULL,
ADD COLUMN     "is_completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "numQuestions" INTEGER NOT NULL,
ADD COLUMN     "pdf_url" TEXT[],
ADD COLUMN     "topic" TEXT NOT NULL,
ADD COLUMN     "urls" TEXT[],
ALTER COLUMN "questions" DROP NOT NULL;

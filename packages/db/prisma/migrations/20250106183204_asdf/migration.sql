/*
  Warnings:

  - You are about to drop the column `result` on the `test_results` table. All the data in the column will be lost.
  - Added the required column `correctAnswers` to the `test_results` table without a default value. This is not possible if the table is not empty.
  - Added the required column `incorrectAnswers` to the `test_results` table without a default value. This is not possible if the table is not empty.
  - Added the required column `score` to the `test_results` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skippedAnswers` to the `test_results` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "test_results" DROP COLUMN "result",
ADD COLUMN     "correctAnswers" INTEGER NOT NULL,
ADD COLUMN     "incorrectAnswers" INTEGER NOT NULL,
ADD COLUMN     "score" INTEGER NOT NULL,
ADD COLUMN     "skippedAnswers" INTEGER NOT NULL;

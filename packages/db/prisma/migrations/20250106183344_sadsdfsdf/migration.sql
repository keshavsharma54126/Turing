/*
  Warnings:

  - Added the required column `avgTimePerQuestion` to the `test_results` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "test_results" ADD COLUMN     "avgTimePerQuestion" INTEGER NOT NULL;

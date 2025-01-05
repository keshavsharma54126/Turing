/*
  Warnings:

  - Added the required column `embedding` to the `resources` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "resources" ADD COLUMN     "embedding" vector(768) NOT NULL;

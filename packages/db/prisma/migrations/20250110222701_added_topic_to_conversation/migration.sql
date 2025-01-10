/*
  Warnings:

  - Added the required column `topic` to the `conversations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "conversations" ADD COLUMN     "topic" TEXT NOT NULL;

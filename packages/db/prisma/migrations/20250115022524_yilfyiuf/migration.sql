-- CreateEnum
CREATE TYPE "subTier" AS ENUM ('FREE', 'PRO', 'TEAM');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "subTier" "subTier" NOT NULL DEFAULT 'FREE';

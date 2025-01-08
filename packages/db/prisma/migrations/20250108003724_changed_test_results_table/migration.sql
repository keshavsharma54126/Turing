-- AlterTable
ALTER TABLE "test_results" ADD COLUMN     "userAnswers" JSONB[],
ALTER COLUMN "avgTimePerQuestion" DROP NOT NULL;

-- AlterTable
ALTER TABLE "tests" ADD COLUMN     "answers" JSONB[];

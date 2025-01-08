-- DropForeignKey
ALTER TABLE "test_results" DROP CONSTRAINT "test_results_test_id_fkey";

-- AddForeignKey
ALTER TABLE "test_results" ADD CONSTRAINT "test_results_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

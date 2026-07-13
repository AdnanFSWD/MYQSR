-- AlterTable
ALTER TABLE "bills" ADD COLUMN     "cancelled_at" TIMESTAMP(3),
ADD COLUMN     "cancelled_by" INTEGER;

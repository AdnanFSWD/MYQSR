/*
  Warnings:

  - You are about to drop the column `footer_message` on the `settings` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `settings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "settings" DROP COLUMN "footer_message",
ADD COLUMN     "bill_prefix" TEXT NOT NULL DEFAULT 'QSR',
ADD COLUMN     "city" TEXT NOT NULL DEFAULT 'Hyderabad',
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'INR',
ADD COLUMN     "date_format" TEXT NOT NULL DEFAULT 'YYYY-MM-DD',
ADD COLUMN     "default_payment_mode" TEXT NOT NULL DEFAULT 'CASH',
ADD COLUMN     "email" TEXT NOT NULL DEFAULT 'info@myqsr.com',
ADD COLUMN     "fssai_number" TEXT NOT NULL DEFAULT '12345678901234',
ADD COLUMN     "gst_number" TEXT NOT NULL DEFAULT '36AAAAA1111A1Z1',
ADD COLUMN     "pincode" TEXT NOT NULL DEFAULT '500081',
ADD COLUMN     "printer_width" INTEGER NOT NULL DEFAULT 80,
ADD COLUMN     "receipt_footer" TEXT,
ADD COLUMN     "receipt_header" TEXT,
ADD COLUMN     "round_off_bills" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "state" TEXT NOT NULL DEFAULT 'Telangana',
ADD COLUMN     "time_format" TEXT NOT NULL DEFAULT 'hh:mm A',
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "restaurant_name" SET DEFAULT 'MYQSR Express',
ALTER COLUMN "gst_percentage" SET DEFAULT 5.00,
ALTER COLUMN "address" SET DEFAULT '123 Food Street, Tech Park',
ALTER COLUMN "phone" SET DEFAULT '+91 98765 43210';

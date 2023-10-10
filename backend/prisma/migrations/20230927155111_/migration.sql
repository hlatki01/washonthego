-- AlterTable
ALTER TABLE `orders` ADD COLUMN `paymentStatus` ENUM('PENDING', 'PAID', 'REJECTED', 'CANCELLED', 'AUTHORIZED', 'VERIFIED') NOT NULL DEFAULT 'PENDING';
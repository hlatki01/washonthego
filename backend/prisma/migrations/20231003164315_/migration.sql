/*
  Warnings:

  - You are about to drop the column `addressId` on the `companies` table. All the data in the column will be lost.
  - Added the required column `companyId` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `companies` DROP FOREIGN KEY `companies_addressId_fkey`;

-- AlterTable
ALTER TABLE `addresses` ADD COLUMN `companyId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `companies` DROP COLUMN `addressId`;

-- AddForeignKey
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to alter the column `country` on the `addresses` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(7))`.
  - You are about to drop the column `userId` on the `companies` table. All the data in the column will be lost.
  - Added the required column `addressId` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `companies` DROP FOREIGN KEY `companies_userId_fkey`;

-- AlterTable
ALTER TABLE `addresses` MODIFY `country` ENUM('BR') NOT NULL;

-- AlterTable
ALTER TABLE `companies` DROP COLUMN `userId`,
    ADD COLUMN `addressId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `companies` ADD CONSTRAINT `companies_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `addresses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

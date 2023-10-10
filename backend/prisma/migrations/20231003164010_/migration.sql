-- DropForeignKey
ALTER TABLE `companies` DROP FOREIGN KEY `companies_addressId_fkey`;

-- AlterTable
ALTER TABLE `companies` MODIFY `addressId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `companies` ADD CONSTRAINT `companies_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `addresses`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

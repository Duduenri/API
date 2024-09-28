/*
  Warnings:

  - You are about to drop the `viagens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `viagens`;

-- CreateTable
CREATE TABLE `hoteis` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(60) NOT NULL,
    `cidade` VARCHAR(60) NOT NULL,
    `preco` DECIMAL(10, 2) NOT NULL,
    `estrelas` SMALLINT NOT NULL,
    `quartos` SMALLINT NOT NULL,
    `categoria` ENUM('Luxo', 'Economico', 'Resort', 'Pousada') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

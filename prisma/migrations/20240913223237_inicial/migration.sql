-- CreateTable
CREATE TABLE `viagens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `destino` VARCHAR(60) NOT NULL,
    `transporte` ENUM('Terreste', 'Aereo', 'Maritimo') NOT NULL,
    `dataSaida` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `preco` DECIMAL(10, 2) NOT NULL,
    `duracao` SMALLINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

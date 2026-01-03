-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: dat_ve_may_bay
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('c9e82105-04ae-47d4-90a6-60d8418c6cd5','48d1fbbbc3923b6a578357bc81655372ba61b37a3ffcec2e426d6206b1258925','2026-01-03 07:58:07.138','20260103075805_init_flight_booking',NULL,NULL,'2026-01-03 07:58:05.360',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chang_bay`
--

DROP TABLE IF EXISTS `chang_bay`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chang_bay` (
  `id` int NOT NULL AUTO_INCREMENT,
  `chuyenBayId` int NOT NULL,
  `thuTuChang` int NOT NULL,
  `sanBayDiId` int NOT NULL,
  `sanBayDenId` int NOT NULL,
  `gioDi` datetime(3) NOT NULL,
  `gioDen` datetime(3) NOT NULL,
  `thoiGianBayPhut` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `chang_bay_chuyenBayId_fkey` (`chuyenBayId`),
  KEY `chang_bay_sanBayDiId_fkey` (`sanBayDiId`),
  KEY `chang_bay_sanBayDenId_fkey` (`sanBayDenId`),
  CONSTRAINT `chang_bay_chuyenBayId_fkey` FOREIGN KEY (`chuyenBayId`) REFERENCES `chuyen_bay` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `chang_bay_sanBayDenId_fkey` FOREIGN KEY (`sanBayDenId`) REFERENCES `san_bay` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `chang_bay_sanBayDiId_fkey` FOREIGN KEY (`sanBayDiId`) REFERENCES `san_bay` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chang_bay`
--

LOCK TABLES `chang_bay` WRITE;
/*!40000 ALTER TABLE `chang_bay` DISABLE KEYS */;
INSERT INTO `chang_bay` VALUES (1,1,1,1,2,'2026-01-04 01:00:00.000','2026-01-04 03:00:00.000',120,'2026-01-03 07:58:16.736','2026-01-03 07:58:16.736'),(2,2,1,1,2,'2026-01-04 03:00:00.000','2026-01-04 05:00:00.000',120,'2026-01-03 07:58:16.743','2026-01-03 07:58:16.743'),(3,3,1,1,2,'2026-01-04 05:00:00.000','2026-01-04 07:00:00.000',120,'2026-01-03 07:58:16.748','2026-01-03 07:58:16.748'),(9,8,1,1,2,'2026-03-01 06:00:00.000','2026-03-01 08:00:00.000',120,'2026-01-03 15:46:06.000','2026-01-03 15:46:06.000'),(10,9,1,2,1,'2026-03-02 18:00:00.000','2026-03-02 20:00:00.000',120,'2026-01-03 15:46:06.000','2026-01-03 15:46:06.000'),(11,10,1,1,3,'2026-03-03 07:30:00.000','2026-03-03 09:00:00.000',90,'2026-01-03 15:46:06.000','2026-01-03 15:46:06.000'),(12,11,1,3,2,'2026-03-04 14:00:00.000','2026-03-04 15:30:00.000',90,'2026-01-03 15:46:06.000','2026-01-03 15:46:06.000'),(13,12,1,1,4,'2026-03-05 10:00:00.000','2026-03-05 13:00:00.000',180,'2026-01-03 15:46:06.000','2026-01-03 15:46:06.000'),(14,13,1,1,5,'2026-03-06 09:00:00.000','2026-03-06 12:00:00.000',180,'2026-01-03 15:46:06.000','2026-01-03 15:46:06.000'),(15,14,1,2,5,'2026-03-07 08:00:00.000','2026-03-07 12:30:00.000',270,'2026-01-03 15:46:06.000','2026-01-03 15:46:06.000'),(16,15,1,3,1,'2026-03-08 16:00:00.000','2026-03-08 17:30:00.000',90,'2026-01-03 15:46:06.000','2026-01-03 15:46:06.000');
/*!40000 ALTER TABLE `chang_bay` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chuyen_bay`
--

DROP TABLE IF EXISTS `chuyen_bay`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chuyen_bay` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hangId` int NOT NULL,
  `soHieuChuyenBay` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `chuyen_bay_hangId_fkey` (`hangId`),
  CONSTRAINT `chuyen_bay_hangId_fkey` FOREIGN KEY (`hangId`) REFERENCES `hang_hang_khong` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chuyen_bay`
--

LOCK TABLES `chuyen_bay` WRITE;
/*!40000 ALTER TABLE `chuyen_bay` DISABLE KEYS */;
INSERT INTO `chuyen_bay` VALUES (1,1,'VN210','2026-01-03 07:58:16.720','2026-01-03 07:58:16.720'),(2,2,'VJ130','2026-01-03 07:58:16.726','2026-01-03 07:58:16.726'),(3,3,'QH1201','2026-01-03 07:58:16.731','2026-01-03 07:58:16.731'),(8,1,'VN221','2026-01-03 15:45:54.000','2026-01-03 15:45:54.000'),(9,1,'VN222','2026-01-03 15:45:54.000','2026-01-03 15:45:54.000'),(10,2,'VJ301','2026-01-03 15:45:54.000','2026-01-03 15:45:54.000'),(11,2,'VJ302','2026-01-03 15:45:54.000','2026-01-03 15:45:54.000'),(12,3,'QH201','2026-01-03 15:45:54.000','2026-01-03 15:45:54.000'),(13,3,'QH202','2026-01-03 15:45:54.000','2026-01-03 15:45:54.000'),(14,1,'VN651','2026-01-03 15:45:54.000','2026-01-03 15:45:54.000'),(15,2,'VJ888','2026-01-03 15:45:54.000','2026-01-03 15:45:54.000');
/*!40000 ALTER TABLE `chuyen_bay` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `don_dat_ve`
--

DROP TABLE IF EXISTS `don_dat_ve`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `don_dat_ve` (
  `id` int NOT NULL AUTO_INCREMENT,
  `maDatVe` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nguoiDungId` int DEFAULT NULL,
  `changBayId` int NOT NULL,
  `hangVeId` int NOT NULL,
  `nhomGiaId` int DEFAULT NULL,
  `trangThai` enum('TAO_MOI','GIU_CHO','HET_HAN','CHO_THANH_TOAN','DA_THANH_TOAN','DANG_XUAT_VE','DA_XUAT_VE','HUY','CHO_HOAN_TIEN','DA_HOAN_TIEN','THAT_BAI') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'TAO_MOI',
  `tongTien` decimal(15,2) NOT NULL,
  `tienTe` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'VND',
  `hetHanGiuCho` datetime(3) DEFAULT NULL,
  `searchSessionId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `don_dat_ve_maDatVe_key` (`maDatVe`),
  KEY `don_dat_ve_nguoiDungId_fkey` (`nguoiDungId`),
  KEY `don_dat_ve_changBayId_fkey` (`changBayId`),
  KEY `don_dat_ve_hangVeId_fkey` (`hangVeId`),
  CONSTRAINT `don_dat_ve_changBayId_fkey` FOREIGN KEY (`changBayId`) REFERENCES `chang_bay` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `don_dat_ve_hangVeId_fkey` FOREIGN KEY (`hangVeId`) REFERENCES `hang_ve` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `don_dat_ve_nguoiDungId_fkey` FOREIGN KEY (`nguoiDungId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `don_dat_ve`
--

LOCK TABLES `don_dat_ve` WRITE;
/*!40000 ALTER TABLE `don_dat_ve` DISABLE KEYS */;
INSERT INTO `don_dat_ve` VALUES (9,'SKY777',2,9,1,1,'DA_THANH_TOAN',1490000.00,'VND',NULL,NULL,'2026-01-03 15:48:16.000','2026-01-03 15:48:16.000'),(10,'SKY666',3,13,3,3,'DA_XUAT_VE',5750000.00,'VND',NULL,NULL,'2026-01-03 15:48:16.000','2026-01-03 15:48:16.000'),(11,'SKY555',4,11,1,1,'GIU_CHO',1040000.00,'VND',NULL,NULL,'2026-01-03 15:48:16.000','2026-01-03 15:48:16.000'),(12,'SKY444',2,15,1,1,'GIU_CHO',3420000.00,'VND',NULL,NULL,'2026-01-03 15:48:16.000','2026-01-03 15:48:16.000');
/*!40000 ALTER TABLE `don_dat_ve` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `gia_chang_bay`
--

DROP TABLE IF EXISTS `gia_chang_bay`;
/*!50001 DROP VIEW IF EXISTS `gia_chang_bay`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `gia_chang_bay` AS SELECT 
 1 AS `giaId`,
 1 AS `changBayId`,
 1 AS `hangVeId`,
 1 AS `nhomGiaId`,
 1 AS `giaCoSo`,
 1 AS `thue`,
 1 AS `phi`,
 1 AS `tongGia`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `giao_dich_thanh_toan`
--

DROP TABLE IF EXISTS `giao_dich_thanh_toan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `giao_dich_thanh_toan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `donDatVeId` int NOT NULL,
  `nguoiDungId` int NOT NULL,
  `maGiaoDich` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `soTien` decimal(15,2) NOT NULL,
  `phuongThuc` enum('VNPAY','MOMO','ZALOPAY','ATM','QR') COLLATE utf8mb4_unicode_ci NOT NULL,
  `trangThai` enum('KHOI_TAO','DANG_XU_LY','THANH_CONG','THAT_BAI') COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `idx_gdtt_donDatVeId` (`donDatVeId`),
  KEY `idx_gdtt_nguoiDungId` (`nguoiDungId`),
  CONSTRAINT `fk_gdtt_don_dat_ve` FOREIGN KEY (`donDatVeId`) REFERENCES `don_dat_ve` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_gdtt_users` FOREIGN KEY (`nguoiDungId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `giao_dich_thanh_toan`
--

LOCK TABLES `giao_dich_thanh_toan` WRITE;
/*!40000 ALTER TABLE `giao_dich_thanh_toan` DISABLE KEYS */;
INSERT INTO `giao_dich_thanh_toan` VALUES (1,9,2,'PAY-VNPAY-1001',1490000.00,'VNPAY','THANH_CONG','2026-01-03 15:56:09.085','2026-01-03 15:56:09.085'),(2,10,3,'PAY-VNPAY-1002',5750000.00,'VNPAY','THANH_CONG','2026-01-03 15:56:09.085','2026-01-03 15:56:09.085'),(3,11,4,'PAY-MOMO-1003',1040000.00,'MOMO','DANG_XU_LY','2026-01-03 15:56:09.085','2026-01-03 15:56:09.085'),(4,12,2,'PAY-ZALO-1004',3420000.00,'ZALOPAY','KHOI_TAO','2026-01-03 15:56:09.085','2026-01-03 15:56:09.085');
/*!40000 ALTER TABLE `giao_dich_thanh_toan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hang_hang_khong`
--

DROP TABLE IF EXISTS `hang_hang_khong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hang_hang_khong` (
  `id` int NOT NULL AUTO_INCREMENT,
  `maIata` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tenHang` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `hang_hang_khong_maIata_key` (`maIata`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hang_hang_khong`
--

LOCK TABLES `hang_hang_khong` WRITE;
/*!40000 ALTER TABLE `hang_hang_khong` DISABLE KEYS */;
INSERT INTO `hang_hang_khong` VALUES (1,'VN','Vietnam Airlines','https://logo.clearbit.com/vietnamairlines.com','2026-01-03 07:58:16.656'),(2,'VJ','VietJet Air','https://logo.clearbit.com/vietjetair.com','2026-01-03 07:58:16.662'),(3,'QH','Bamboo Airways','https://logo.clearbit.com/bambooairways.com','2026-01-03 07:58:16.667');
/*!40000 ALTER TABLE `hang_hang_khong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hang_ve`
--

DROP TABLE IF EXISTS `hang_ve`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hang_ve` (
  `id` int NOT NULL AUTO_INCREMENT,
  `khoangVeId` int NOT NULL,
  `maHang` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tenHang` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `moTa` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `hang_ve_maHang_key` (`maHang`),
  KEY `hang_ve_khoangVeId_fkey` (`khoangVeId`),
  CONSTRAINT `hang_ve_khoangVeId_fkey` FOREIGN KEY (`khoangVeId`) REFERENCES `khoang_ve` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hang_ve`
--

LOCK TABLES `hang_ve` WRITE;
/*!40000 ALTER TABLE `hang_ve` DISABLE KEYS */;
INSERT INTO `hang_ve` VALUES (1,1,'Y','Economy (Y)','Hạng phổ thông tiêu chuẩn','2026-01-03 07:58:16.684'),(2,1,'M','Economy (M)','Hạng phổ thông đặc biệt','2026-01-03 07:58:16.692'),(3,2,'J','Business (J)','Hạng thương gia','2026-01-03 07:58:16.697');
/*!40000 ALTER TABLE `hang_ve` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hanh_khach`
--

DROP TABLE IF EXISTS `hanh_khach`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hanh_khach` (
  `id` int NOT NULL AUTO_INCREMENT,
  `donDatVeId` int NOT NULL,
  `loai` enum('NGUOI_LON','TRE_EM','SO_SINH') COLLATE utf8mb4_unicode_ci NOT NULL,
  `ho` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ten` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gioiTinh` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ngaySinh` datetime(3) NOT NULL,
  `soCccd` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `soHoChieu` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ngayHetHan` datetime(3) DEFAULT NULL,
  `quocTich` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `hanh_khach_donDatVeId_fkey` (`donDatVeId`),
  CONSTRAINT `hanh_khach_donDatVeId_fkey` FOREIGN KEY (`donDatVeId`) REFERENCES `don_dat_ve` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hanh_khach`
--

LOCK TABLES `hanh_khach` WRITE;
/*!40000 ALTER TABLE `hanh_khach` DISABLE KEYS */;
INSERT INTO `hanh_khach` VALUES (7,9,'NGUOI_LON','Phạm','Công C','Nam','1988-08-08 00:00:00.000','111222333',NULL,NULL,'Việt Nam','2026-01-03 15:49:53.000'),(8,10,'NGUOI_LON','Trần','Thị D','Nữ','1992-09-09 00:00:00.000','444555666',NULL,NULL,'Việt Nam','2026-01-03 15:49:53.000'),(9,11,'NGUOI_LON','Nguyễn','Văn F','Nam','1995-03-03 00:00:00.000','777888999',NULL,NULL,'Việt Nam','2026-01-03 15:49:53.000'),(10,12,'NGUOI_LON','Lê','Minh G','Nam','1990-01-01 00:00:00.000','999888777',NULL,NULL,'Việt Nam','2026-01-03 15:49:53.000');
/*!40000 ALTER TABLE `hanh_khach` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `khoang_ve`
--

DROP TABLE IF EXISTS `khoang_ve`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `khoang_ve` (
  `id` int NOT NULL AUTO_INCREMENT,
  `maKhoang` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tenKhoang` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `khoang_ve_maKhoang_key` (`maKhoang`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `khoang_ve`
--

LOCK TABLES `khoang_ve` WRITE;
/*!40000 ALTER TABLE `khoang_ve` DISABLE KEYS */;
INSERT INTO `khoang_ve` VALUES (1,'ECONOMY','Phổ thông','2026-01-03 07:58:16.673'),(2,'BUSINESS','Thương gia','2026-01-03 07:58:16.679');
/*!40000 ALTER TABLE `khoang_ve` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nhom_gia_ve`
--

DROP TABLE IF EXISTS `nhom_gia_ve`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nhom_gia_ve` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tenNhom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hangVeId` int DEFAULT NULL,
  `hanhLyKy` int NOT NULL DEFAULT '0',
  `hanhLyXach` int NOT NULL DEFAULT '7',
  `choPhepDoi` tinyint(1) NOT NULL DEFAULT '0',
  `choPhepHoan` tinyint(1) NOT NULL DEFAULT '0',
  `phiDoi` decimal(15,2) NOT NULL DEFAULT '0.00',
  `phiHoan` decimal(15,2) NOT NULL DEFAULT '0.00',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nhom_gia_ve`
--

LOCK TABLES `nhom_gia_ve` WRITE;
/*!40000 ALTER TABLE `nhom_gia_ve` DISABLE KEYS */;
INSERT INTO `nhom_gia_ve` VALUES (1,'Eco Saver',NULL,0,7,0,0,0.00,0.00,'2026-01-03 07:58:16.702','2026-01-03 07:58:16.702'),(2,'Eco Flex',NULL,20,7,1,0,500000.00,0.00,'2026-01-03 07:58:16.709','2026-01-03 07:58:16.709'),(3,'Business Flex',NULL,30,10,1,1,0.00,0.00,'2026-01-03 07:58:16.714','2026-01-03 07:58:16.714');
/*!40000 ALTER TABLE `nhom_gia_ve` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quoc_gia`
--

DROP TABLE IF EXISTS `quoc_gia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quoc_gia` (
  `id` int NOT NULL AUTO_INCREMENT,
  `maQuocGia` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tenQuocGia` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `quoc_gia_maQuocGia_key` (`maQuocGia`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quoc_gia`
--

LOCK TABLES `quoc_gia` WRITE;
/*!40000 ALTER TABLE `quoc_gia` DISABLE KEYS */;
INSERT INTO `quoc_gia` VALUES (1,'VNM','Việt Nam','2026-01-03 07:58:16.605'),(2,'THA','Thái Lan','2026-01-03 07:58:16.610'),(3,'SGP','Singapore','2026-01-03 07:58:16.614');
/*!40000 ALTER TABLE `quoc_gia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `san_bay`
--

DROP TABLE IF EXISTS `san_bay`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `san_bay` (
  `id` int NOT NULL AUTO_INCREMENT,
  `maIata` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tenSanBay` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `thanhPho` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quocGiaId` int NOT NULL,
  `kinhDo` decimal(10,6) DEFAULT NULL,
  `viDo` decimal(10,6) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `san_bay_maIata_key` (`maIata`),
  KEY `san_bay_quocGiaId_fkey` (`quocGiaId`),
  CONSTRAINT `san_bay_quocGiaId_fkey` FOREIGN KEY (`quocGiaId`) REFERENCES `quoc_gia` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `san_bay`
--

LOCK TABLES `san_bay` WRITE;
/*!40000 ALTER TABLE `san_bay` DISABLE KEYS */;
INSERT INTO `san_bay` VALUES (1,'SGN','Sân bay Tân Sơn Nhất','Hồ Chí Minh',1,106.651700,10.823100,'2026-01-03 07:58:16.631'),(2,'HAN','Sân bay Nội Bài','Hà Nội',1,105.801900,21.221200,'2026-01-03 07:58:16.637'),(3,'DAD','Sân bay Đà Nẵng','Đà Nẵng',1,108.199100,16.054400,'2026-01-03 07:58:16.642'),(4,'BKK','Sân bay Suvarnabhumi','Bangkok',2,100.750100,13.690000,'2026-01-03 07:58:16.647'),(5,'SIN','Sân bay Changi','Singapore',3,103.989400,1.364400,'2026-01-03 07:58:16.651');
/*!40000 ALTER TABLE `san_bay` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thanh_toan`
--

DROP TABLE IF EXISTS `thanh_toan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thanh_toan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `donDatVeId` int NOT NULL,
  `nguoiDungId` int DEFAULT NULL,
  `maGiaoDich` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `soTien` decimal(15,2) NOT NULL,
  `tienTe` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'VND',
  `phuongThuc` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `trangThai` enum('KHOI_TAO','CHO_XU_LY','THANH_CONG','THAT_BAI','DA_HOAN') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'KHOI_TAO',
  `thongTinCong` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `thanh_toan_maGiaoDich_key` (`maGiaoDich`),
  KEY `thanh_toan_donDatVeId_fkey` (`donDatVeId`),
  KEY `thanh_toan_nguoiDungId_fkey` (`nguoiDungId`),
  CONSTRAINT `thanh_toan_donDatVeId_fkey` FOREIGN KEY (`donDatVeId`) REFERENCES `don_dat_ve` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `thanh_toan_nguoiDungId_fkey` FOREIGN KEY (`nguoiDungId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thanh_toan`
--

LOCK TABLES `thanh_toan` WRITE;
/*!40000 ALTER TABLE `thanh_toan` DISABLE KEYS */;
INSERT INTO `thanh_toan` VALUES (1,9,2,'VNPAY-20240101-0001',1490000.00,'VND','VNPAY','THANH_CONG','{\"bank\": \"VCB\", \"txnRef\": \"0001\"}','2026-01-03 19:23:28.651','2026-01-03 19:23:28.651'),(2,10,3,'VNPAY-20240101-0002',5750000.00,'VND','VNPAY','THANH_CONG','{\"bank\": \"ACB\", \"txnRef\": \"0002\"}','2026-01-03 19:23:28.651','2026-01-03 19:23:28.651'),(3,11,4,'MOMO-20240101-0003',1040000.00,'VND','MOMO','CHO_XU_LY','{\"payUrl\": \"https://test.momo.vn\", \"requestId\": \"MOMO0003\"}','2026-01-03 19:23:28.651','2026-01-03 19:23:28.651'),(4,12,2,'ZALO-20240101-0004',3420000.00,'VND','ZALOPAY','KHOI_TAO','{\"orderId\": \"ZALO0004\"}','2026-01-03 19:23:28.651','2026-01-03 19:23:28.651'),(5,12,2,'VNPAY-20240101-0005',3420000.00,'VND','VNPAY','THAT_BAI','{\"message\": \"User cancel payment\", \"errorCode\": \"99\"}','2026-01-03 19:23:28.651','2026-01-03 19:23:28.651'),(6,9,2,'REFUND-20240101-0006',1490000.00,'VND','VNPAY','DA_HOAN','{\"refundReason\": \"Khách huỷ vé\"}','2026-01-03 19:23:28.651','2026-01-03 19:23:28.651');
/*!40000 ALTER TABLE `thanh_toan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thong_tin_lien_he`
--

DROP TABLE IF EXISTS `thong_tin_lien_he`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thong_tin_lien_he` (
  `id` int NOT NULL AUTO_INCREMENT,
  `donDatVeId` int NOT NULL,
  `hoTen` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `soDienThoai` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `thong_tin_lien_he_donDatVeId_key` (`donDatVeId`),
  CONSTRAINT `thong_tin_lien_he_donDatVeId_fkey` FOREIGN KEY (`donDatVeId`) REFERENCES `don_dat_ve` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thong_tin_lien_he`
--

LOCK TABLES `thong_tin_lien_he` WRITE;
/*!40000 ALTER TABLE `thong_tin_lien_he` DISABLE KEYS */;
INSERT INTO `thong_tin_lien_he` VALUES (1,9,'Khách liên hệ','contact@demo.com','0900000000','2026-01-03 15:50:47.000'),(2,11,'Khách liên hệ','contact@demo.com','0900000000','2026-01-03 15:50:47.000'),(3,10,'Khách liên hệ','contact@demo.com','0900000000','2026-01-03 15:50:47.000'),(4,12,'Khách liên hệ','contact@demo.com','0900000000','2026-01-03 15:50:47.000');
/*!40000 ALTER TABLE `thong_tin_lien_he` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tien_te`
--

DROP TABLE IF EXISTS `tien_te`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tien_te` (
  `id` int NOT NULL AUTO_INCREMENT,
  `maTienTe` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tenTienTe` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tyGia` decimal(15,4) NOT NULL DEFAULT '1.0000',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `tien_te_maTienTe_key` (`maTienTe`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tien_te`
--

LOCK TABLES `tien_te` WRITE;
/*!40000 ALTER TABLE `tien_te` DISABLE KEYS */;
INSERT INTO `tien_te` VALUES (1,'VND','Việt Nam Đồng',1.0000,'2026-01-03 07:58:16.619'),(2,'USD','US Dollar',25000.0000,'2026-01-03 07:58:16.625');
/*!40000 ALTER TABLE `tien_te` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ton_cho`
--

DROP TABLE IF EXISTS `ton_cho`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ton_cho` (
  `id` int NOT NULL AUTO_INCREMENT,
  `changBayId` int NOT NULL,
  `hangVeId` int NOT NULL,
  `nhomGiaId` int DEFAULT NULL,
  `tongSoCho` int NOT NULL,
  `soChoCon` int NOT NULL,
  `giaCoSo` decimal(15,2) NOT NULL,
  `thue` decimal(15,2) NOT NULL DEFAULT '0.00',
  `phi` decimal(15,2) NOT NULL DEFAULT '0.00',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ton_cho_changBayId_hangVeId_nhomGiaId_key` (`changBayId`,`hangVeId`,`nhomGiaId`),
  KEY `ton_cho_hangVeId_fkey` (`hangVeId`),
  KEY `ton_cho_nhomGiaId_fkey` (`nhomGiaId`),
  CONSTRAINT `ton_cho_changBayId_fkey` FOREIGN KEY (`changBayId`) REFERENCES `chang_bay` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `ton_cho_hangVeId_fkey` FOREIGN KEY (`hangVeId`) REFERENCES `hang_ve` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `ton_cho_nhomGiaId_fkey` FOREIGN KEY (`nhomGiaId`) REFERENCES `nhom_gia_ve` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ton_cho`
--

LOCK TABLES `ton_cho` WRITE;
/*!40000 ALTER TABLE `ton_cho` DISABLE KEYS */;
INSERT INTO `ton_cho` VALUES (1,1,1,1,150,150,1500000.00,150000.00,50000.00,'2026-01-03 07:58:16.752','2026-01-03 07:58:16.752'),(2,1,1,2,50,50,2000000.00,200000.00,50000.00,'2026-01-03 07:58:16.757','2026-01-03 07:58:16.757'),(3,2,1,1,180,180,1200000.00,120000.00,40000.00,'2026-01-03 07:58:16.762','2026-01-03 07:58:16.762'),(4,3,1,2,120,120,1800000.00,180000.00,50000.00,'2026-01-03 07:58:16.766','2026-01-03 07:58:16.766'),(5,9,1,1,180,150,1300000.00,130000.00,60000.00,'2026-01-03 15:46:13.000','2026-01-03 15:46:13.000'),(6,9,3,3,20,18,3800000.00,380000.00,120000.00,'2026-01-03 15:46:13.000','2026-01-03 15:46:13.000'),(7,10,1,1,180,160,1250000.00,125000.00,60000.00,'2026-01-03 15:46:13.000','2026-01-03 15:46:13.000'),(8,11,1,1,180,170,900000.00,90000.00,50000.00,'2026-01-03 15:46:13.000','2026-01-03 15:46:13.000'),(9,12,1,1,180,165,950000.00,95000.00,50000.00,'2026-01-03 15:46:13.000','2026-01-03 15:46:13.000'),(10,13,1,1,200,180,2600000.00,260000.00,100000.00,'2026-01-03 15:46:13.000','2026-01-03 15:46:13.000'),(11,13,3,3,30,28,5200000.00,520000.00,150000.00,'2026-01-03 15:46:13.000','2026-01-03 15:46:13.000'),(12,14,3,3,25,22,5500000.00,550000.00,160000.00,'2026-01-03 15:46:13.000','2026-01-03 15:46:13.000'),(13,15,1,1,200,190,3000000.00,300000.00,120000.00,'2026-01-03 15:46:13.000','2026-01-03 15:46:13.000');
/*!40000 ALTER TABLE `ton_cho` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hoTen` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `soDienThoai` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vaiTro` enum('CUSTOMER','ADMIN','OPERATOR') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CUSTOMER',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin@flight.com','$2b$10$liCBHPm0hfwFiquv33YxMeXtPCGWHi/1yRAABbbDwIrB2icNfwxO6','Admin System','0909123456','ADMIN','2026-01-03 07:58:16.595','2026-01-03 07:58:16.595'),(2,'phamc@gmail.com','$2b$10$hash1','Phạm Công C','0901234567','CUSTOMER','2026-01-03 15:46:19.000','2026-01-03 15:46:19.000'),(3,'tranthid@gmail.com','$2b$10$hash2','Trần Thị D','0912345678','CUSTOMER','2026-01-03 15:46:19.000','2026-01-03 15:46:19.000'),(4,'staff01@flight.com','$2b$10$hash3','Nhân viên CSKH','0933333333','OPERATOR','2026-01-03 15:46:19.000','2026-01-03 15:46:19.000');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ve`
--

DROP TABLE IF EXISTS `ve`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ve` (
  `id` int NOT NULL AUTO_INCREMENT,
  `donDatVeId` int NOT NULL,
  `hanhKhachId` int NOT NULL,
  `soVe` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `trangThai` enum('HIEU_LUC','DA_SU_DUNG','DA_HUY','DA_HOAN') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'HIEU_LUC',
  `ngayXuat` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ve_soVe_key` (`soVe`),
  KEY `ve_donDatVeId_fkey` (`donDatVeId`),
  KEY `ve_hanhKhachId_fkey` (`hanhKhachId`),
  CONSTRAINT `ve_donDatVeId_fkey` FOREIGN KEY (`donDatVeId`) REFERENCES `don_dat_ve` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `ve_hanhKhachId_fkey` FOREIGN KEY (`hanhKhachId`) REFERENCES `hanh_khach` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ve`
--

LOCK TABLES `ve` WRITE;
/*!40000 ALTER TABLE `ve` DISABLE KEYS */;
INSERT INTO `ve` VALUES (6,11,9,'VN-SKY555-0009','HIEU_LUC','2026-01-03 19:27:25.075','2026-01-03 19:27:25.075'),(7,10,8,'VN-SKY666-0008','HIEU_LUC','2026-01-03 19:27:25.075','2026-01-03 19:27:25.075'),(8,9,7,'VN-SKY777-0007','DA_SU_DUNG','2026-01-03 19:27:25.075','2026-01-03 19:27:25.075');
/*!40000 ALTER TABLE `ve` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `gia_chang_bay`
--

/*!50001 DROP VIEW IF EXISTS `gia_chang_bay`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `gia_chang_bay` AS select `tc`.`id` AS `giaId`,`tc`.`changBayId` AS `changBayId`,`tc`.`hangVeId` AS `hangVeId`,`tc`.`nhomGiaId` AS `nhomGiaId`,`tc`.`giaCoSo` AS `giaCoSo`,`tc`.`thue` AS `thue`,`tc`.`phi` AS `phi`,((`tc`.`giaCoSo` + `tc`.`thue`) + `tc`.`phi`) AS `tongGia` from `ton_cho` `tc` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-03 19:29:37

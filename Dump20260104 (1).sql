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
INSERT INTO `_prisma_migrations` VALUES ('5e2591d7-6592-4c14-a165-8bf2f435cd1b','48d1fbbbc3923b6a578357bc81655372ba61b37a3ffcec2e426d6206b1258925','2026-01-04 02:19:42.604','20260103075805_init_flight_booking',NULL,NULL,'2026-01-04 02:19:41.007',1),('a6df70b6-5328-4c6c-956e-2201ea961806','56707326d9e95dd18c36cc7fd1cd03dc675acccd9990ce999eff77adcdb9406f','2026-01-04 02:21:14.945','20260104_add_google_id',NULL,NULL,'2026-01-04 02:21:14.850',1);
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chang_bay`
--

LOCK TABLES `chang_bay` WRITE;
/*!40000 ALTER TABLE `chang_bay` DISABLE KEYS */;
INSERT INTO `chang_bay` VALUES (1,1,1,1,2,'2026-02-01 08:00:00.000','2026-02-01 10:15:00.000',135,'2026-01-04 10:02:46.329','2026-01-04 10:02:46.000'),(2,2,1,2,3,'2026-02-01 13:30:00.000','2026-02-01 14:50:00.000',80,'2026-01-04 10:02:46.329','2026-01-04 10:02:46.000'),(3,3,1,1,4,'2026-02-02 09:00:00.000','2026-02-02 11:45:00.000',165,'2026-01-04 10:02:46.329','2026-01-04 10:02:46.000'),(4,4,1,1,2,'2026-02-03 07:00:00.000','2026-02-03 09:10:00.000',130,'2026-01-04 10:02:46.329','2026-01-04 10:02:46.000'),(5,4,2,2,5,'2026-02-03 10:30:00.000','2026-02-03 13:30:00.000',180,'2026-01-04 10:02:46.329','2026-01-04 10:02:46.000');
/*!40000 ALTER TABLE `chang_bay` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chinh_sach_ve`
--

DROP TABLE IF EXISTS `chinh_sach_ve`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chinh_sach_ve` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `maHangVe` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `hoanVe` tinyint(1) NOT NULL DEFAULT '0',
  `phiHoanVe` decimal(12,2) DEFAULT '0.00',
  `doiVe` tinyint(1) NOT NULL DEFAULT '0',
  `phiDoiVe` decimal(12,2) DEFAULT '0.00',
  `hanhLyKyGuiKg` int DEFAULT '0',
  `hanhLyXachTayKg` int DEFAULT '7',
  `ghiChu` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `fk_chinhsach_hangve` (`maHangVe`),
  CONSTRAINT `fk_chinhsach_hangve` FOREIGN KEY (`maHangVe`) REFERENCES `hang_ve_chi_tiet` (`maHangVe`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Chính sách hoàn/đổi/hành lý theo hạng vé';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chinh_sach_ve`
--

LOCK TABLES `chinh_sach_ve` WRITE;
/*!40000 ALTER TABLE `chinh_sach_ve` DISABLE KEYS */;
INSERT INTO `chinh_sach_ve` VALUES (1,'ECO_PROMO',0,0.00,0,0.00,20,7,'Không hoàn, không đổi','2026-01-04 09:58:12.143','2026-01-04 09:58:12.143'),(2,'ECO_SAVER',0,0.00,1,500000.00,20,7,'Đổi vé có phí','2026-01-04 09:58:12.143','2026-01-04 09:58:12.143'),(3,'ECO_FLEX',1,300000.00,1,300000.00,23,7,'Đổi/hoàn linh hoạt','2026-01-04 09:58:12.143','2026-01-04 09:58:12.143'),(4,'PECO_STD',1,200000.00,1,200000.00,25,7,'Ưu tiên check-in','2026-01-04 09:58:12.143','2026-01-04 09:58:12.143'),(5,'BUS_STD',1,0.00,1,0.00,32,10,'Suất ăn & phòng chờ','2026-01-04 09:58:12.143','2026-01-04 09:58:12.143'),(6,'BUS_FLEX',1,0.00,1,0.00,40,10,'Linh hoạt tối đa','2026-01-04 09:58:12.143','2026-01-04 09:58:12.143'),(7,'FST_STD',1,0.00,1,0.00,50,15,'Dịch vụ cao cấp nhất','2026-01-04 09:58:12.143','2026-01-04 09:58:12.143');
/*!40000 ALTER TABLE `chinh_sach_ve` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chuyen_bay`
--

LOCK TABLES `chuyen_bay` WRITE;
/*!40000 ALTER TABLE `chuyen_bay` DISABLE KEYS */;
INSERT INTO `chuyen_bay` VALUES (1,1,'VN123','2026-01-04 09:59:43.132','2026-01-04 09:59:43.000'),(2,1,'VN210','2026-01-04 09:59:43.132','2026-01-04 09:59:43.000'),(3,1,'VN245','2026-01-04 09:59:43.132','2026-01-04 09:59:43.000'),(4,1,'VN678','2026-01-04 09:59:43.132','2026-01-04 09:59:43.000'),(5,2,'VJ456','2026-01-04 09:59:43.132','2026-01-04 09:59:43.000'),(6,2,'VJ132','2026-01-04 09:59:43.132','2026-01-04 09:59:43.000'),(7,2,'VJ789','2026-01-04 09:59:43.132','2026-01-04 09:59:43.000'),(8,2,'VJ902','2026-01-04 09:59:43.132','2026-01-04 09:59:43.000'),(9,3,'QH201','2026-01-04 09:59:43.132','2026-01-04 09:59:43.000'),(10,3,'QH330','2026-01-04 09:59:43.132','2026-01-04 09:59:43.000'),(11,1,'VN123','2026-01-04 10:00:49.197','2026-01-04 10:00:49.000'),(12,1,'VN210','2026-01-04 10:00:49.197','2026-01-04 10:00:49.000'),(13,1,'VN245','2026-01-04 10:00:49.197','2026-01-04 10:00:49.000'),(14,1,'VN678','2026-01-04 10:00:49.197','2026-01-04 10:00:49.000'),(15,1,'VN782','2026-01-04 10:00:49.197','2026-01-04 10:00:49.000'),(16,2,'VJ456','2026-01-04 10:00:49.197','2026-01-04 10:00:49.000'),(17,2,'VJ132','2026-01-04 10:00:49.197','2026-01-04 10:00:49.000'),(18,2,'VJ389','2026-01-04 10:00:49.197','2026-01-04 10:00:49.000'),(19,2,'VJ789','2026-01-04 10:00:49.197','2026-01-04 10:00:49.000'),(20,2,'VJ902','2026-01-04 10:00:49.197','2026-01-04 10:00:49.000'),(21,3,'QH201','2026-01-04 10:00:49.197','2026-01-04 10:00:49.000'),(22,3,'QH330','2026-01-04 10:00:49.197','2026-01-04 10:00:49.000'),(23,3,'QH501','2026-01-04 10:00:49.197','2026-01-04 10:00:49.000');
/*!40000 ALTER TABLE `chuyen_bay` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `danh_gia`
--

DROP TABLE IF EXISTS `danh_gia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `danh_gia` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nguoiDungId` int NOT NULL,
  `khachSanId` int DEFAULT NULL,
  `hangId` int DEFAULT NULL,
  `soSao` int NOT NULL,
  `binhLuan` text,
  `hinhAnh` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `danh_gia_nguoiDungId_fkey` (`nguoiDungId`),
  CONSTRAINT `danh_gia_nguoiDungId_fkey` FOREIGN KEY (`nguoiDungId`) REFERENCES `users` (`id`),
  CONSTRAINT `danh_gia_chk_1` CHECK (((`soSao` >= 1) and (`soSao` <= 5)))
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `danh_gia`
--

LOCK TABLES `danh_gia` WRITE;
/*!40000 ALTER TABLE `danh_gia` DISABLE KEYS */;
INSERT INTO `danh_gia` VALUES (1,2,1,NULL,5,NULL,'[\"vinpearl_room.jpg\", \"vinpearl_view.jpg\"]','2026-01-04 10:16:32.218'),(2,3,10,NULL,4,NULL,'[\"muongthanh_lobby.jpg\"]','2026-01-04 10:16:37.500'),(3,4,11,NULL,5,NULL,'[\"intercontinental_beach.jpg\", \"intercontinental_room.jpg\"]','2026-01-04 10:16:42.974'),(4,4,18,NULL,5,NULL,'[\"intercontinental_beach.jpg\", \"intercontinental_room.jpg\"]','2026-01-04 10:16:42.974'),(6,4,11,NULL,5,NULL,'[\"intercontinental_beach.jpg\", \"intercontinental_room.jpg\"]','2026-01-04 10:16:47.056'),(7,4,18,NULL,5,NULL,'[\"intercontinental_beach.jpg\", \"intercontinental_room.jpg\"]','2026-01-04 10:16:47.056'),(9,3,NULL,2,3,NULL,'[\"vietjet_seat.jpg\"]','2026-01-04 10:16:52.390');
/*!40000 ALTER TABLE `danh_gia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dat_combo`
--

DROP TABLE IF EXISTS `dat_combo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dat_combo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nguoiDungId` int NOT NULL,
  `donDatVeId` int NOT NULL,
  `loaiPhongId` int NOT NULL,
  `tongTienCombo` decimal(15,2) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `dat_combo_user_fkey` (`nguoiDungId`),
  KEY `dat_combo_ve_fkey` (`donDatVeId`),
  KEY `dat_combo_phong_fkey` (`loaiPhongId`),
  CONSTRAINT `dat_combo_phong_fkey` FOREIGN KEY (`loaiPhongId`) REFERENCES `loai_phong` (`id`),
  CONSTRAINT `dat_combo_user_fkey` FOREIGN KEY (`nguoiDungId`) REFERENCES `users` (`id`),
  CONSTRAINT `dat_combo_ve_fkey` FOREIGN KEY (`donDatVeId`) REFERENCES `don_dat_ve` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dat_combo`
--

LOCK TABLES `dat_combo` WRITE;
/*!40000 ALTER TABLE `dat_combo` DISABLE KEYS */;
INSERT INTO `dat_combo` VALUES (1,1,21,1,4700000.00,'2026-01-04 10:15:25.073'),(2,1,21,14,4700000.00,'2026-01-04 10:15:25.073'),(4,2,23,9,6400000.00,'2026-01-04 10:15:30.504'),(5,2,23,22,6400000.00,'2026-01-04 10:15:30.504'),(7,3,25,3,8000000.00,'2026-01-04 10:15:35.848'),(8,3,25,16,8000000.00,'2026-01-04 10:15:35.848');
/*!40000 ALTER TABLE `dat_combo` ENABLE KEYS */;
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
  `trangThai` enum('CHO_THANH_TOAN','DA_THANH_TOAN','DA_HUY','HET_HAN') COLLATE utf8mb4_unicode_ci NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `don_dat_ve`
--

LOCK TABLES `don_dat_ve` WRITE;
/*!40000 ALTER TABLE `don_dat_ve` DISABLE KEYS */;
INSERT INTO `don_dat_ve` VALUES (21,'TVL2026ABC',1,1,1,NULL,'DA_THANH_TOAN',1200000.00,'VND',NULL,NULL,'2026-01-04 10:06:43.116','2026-01-04 10:06:43.000'),(22,'TVL2026DEF',1,2,1,NULL,'CHO_THANH_TOAN',950000.00,'VND',NULL,NULL,'2026-01-04 10:06:43.116','2026-01-04 10:06:43.000'),(23,'TVL2026GHI',2,3,2,NULL,'DA_THANH_TOAN',3200000.00,'VND',NULL,NULL,'2026-01-04 10:06:43.116','2026-01-04 10:06:43.000'),(24,'TVL2026JKL',2,4,1,NULL,'DA_HUY',4000000.00,'VND',NULL,NULL,'2026-01-04 10:06:43.116','2026-01-04 10:06:43.000'),(25,'TVL2026MNO',3,1,3,NULL,'DA_THANH_TOAN',1500000.00,'VND',NULL,NULL,'2026-01-04 10:06:43.116','2026-01-04 10:06:43.000');
/*!40000 ALTER TABLE `don_dat_ve` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hang_hang_khong`
--

LOCK TABLES `hang_hang_khong` WRITE;
/*!40000 ALTER TABLE `hang_hang_khong` DISABLE KEYS */;
INSERT INTO `hang_hang_khong` VALUES (1,'VN','Vietnam Airlines','vna_logo.png','2026-01-04 09:54:34.958'),(2,'VJ','Vietjet Air','vj_logo.png','2026-01-04 09:54:34.958'),(3,'QH','Bamboo Airways','qh_logo.png','2026-01-04 09:54:34.958'),(4,'BL','Pacific Airlines','bl_logo.png','2026-01-04 09:54:34.958'),(5,'SQ','Singapore Airlines','sq_logo.png','2026-01-04 09:54:34.958'),(6,'TR','Scoot','tr_logo.png','2026-01-04 09:54:34.958'),(7,'TG','Thai Airways','tg_logo.png','2026-01-04 09:54:34.958'),(8,'FD','Thai AirAsia','fd_logo.png','2026-01-04 09:54:34.958'),(9,'MH','Malaysia Airlines','mh_logo.png','2026-01-04 09:54:34.958'),(10,'AK','AirAsia','ak_logo.png','2026-01-04 09:54:34.958'),(11,'GA','Garuda Indonesia','ga_logo.png','2026-01-04 09:54:34.958'),(12,'JL','Japan Airlines','jl_logo.png','2026-01-04 09:54:34.958'),(13,'NH','All Nippon Airways','nh_logo.png','2026-01-04 09:54:34.958'),(14,'KE','Korean Air','ke_logo.png','2026-01-04 09:54:34.958'),(15,'OZ','Asiana Airlines','oz_logo.png','2026-01-04 09:54:34.958'),(16,'CX','Cathay Pacific','cx_logo.png','2026-01-04 09:54:34.958'),(17,'QF','Qantas','qf_logo.png','2026-01-04 09:54:34.958');
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
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hang_ve`
--

LOCK TABLES `hang_ve` WRITE;
/*!40000 ALTER TABLE `hang_ve` DISABLE KEYS */;
INSERT INTO `hang_ve` VALUES (1,1,'ECO_STANDARD','Phổ thông tiêu chuẩn',NULL,'2026-01-04 09:59:50.986'),(2,1,'ECO_SAVER','Phổ thông tiết kiệm',NULL,'2026-01-04 09:59:50.986'),(3,1,'ECO_FLEX','Phổ thông linh hoạt',NULL,'2026-01-04 09:59:50.986'),(4,2,'BUS_STANDARD','Thương gia tiêu chuẩn',NULL,'2026-01-04 09:59:50.986'),(5,2,'BUS_FLEX','Thương gia linh hoạt',NULL,'2026-01-04 09:59:50.986'),(6,3,'PECO_STANDARD','Phổ thông đặc biệt',NULL,'2026-01-04 09:59:50.986'),(7,4,'FST_STANDARD','Hạng nhất',NULL,'2026-01-04 09:59:50.986');
/*!40000 ALTER TABLE `hang_ve` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hang_ve_chi_tiet`
--

DROP TABLE IF EXISTS `hang_ve_chi_tiet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hang_ve_chi_tiet` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `maHangVe` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `maKhoang` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tenHangVe` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `moTa` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `hang_ve_chi_tiet_maHangVe_key` (`maHangVe`),
  KEY `fk_hangve_khoangve` (`maKhoang`),
  CONSTRAINT `fk_hangve_khoangve` FOREIGN KEY (`maKhoang`) REFERENCES `khoang_ve` (`maKhoang`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Hạng vé chi tiết theo khoang (Economy / Business / First)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hang_ve_chi_tiet`
--

LOCK TABLES `hang_ve_chi_tiet` WRITE;
/*!40000 ALTER TABLE `hang_ve_chi_tiet` DISABLE KEYS */;
INSERT INTO `hang_ve_chi_tiet` VALUES (1,'ECO_PROMO','ECO','Economy Promo','Giá rẻ nhất, không hoàn không đổi',1,'2026-01-04 09:58:05.831','2026-01-04 09:58:05.831'),(2,'ECO_SAVER','ECO','Economy Saver','Cho phép đổi vé, không hoàn',1,'2026-01-04 09:58:05.831','2026-01-04 09:58:05.831'),(3,'ECO_FLEX','ECO','Economy Flexible','Đổi và hoàn vé linh hoạt',1,'2026-01-04 09:58:05.831','2026-01-04 09:58:05.831'),(4,'PECO_STD','PECO','Premium Economy','Ghế rộng, ưu tiên check-in',1,'2026-01-04 09:58:05.831','2026-01-04 09:58:05.831'),(5,'BUS_STD','BUS','Business Standard','Ghế ngả phẳng, suất ăn cao cấp',1,'2026-01-04 09:58:05.831','2026-01-04 09:58:05.831'),(6,'BUS_FLEX','BUS','Business Flexible','Linh hoạt đổi hoàn, ưu tiên dịch vụ',1,'2026-01-04 09:58:05.831','2026-01-04 09:58:05.831'),(7,'FST_STD','FST','First Class','Dịch vụ cao cấp nhất',1,'2026-01-04 09:58:05.831','2026-01-04 09:58:05.831');
/*!40000 ALTER TABLE `hang_ve_chi_tiet` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hanh_khach`
--

LOCK TABLES `hanh_khach` WRITE;
/*!40000 ALTER TABLE `hanh_khach` DISABLE KEYS */;
INSERT INTO `hanh_khach` VALUES (29,21,'NGUOI_LON','Trần','Hoài Bảo','Nam','1995-12-31 00:00:00.000',NULL,NULL,NULL,NULL,'2026-01-04 10:09:07.146'),(30,22,'NGUOI_LON','Nguyễn','Minh Anh','Nữ','1998-05-20 00:00:00.000',NULL,NULL,NULL,NULL,'2026-01-04 10:09:07.146'),(31,23,'NGUOI_LON','Lê','Quang Huy','Nam','1990-08-15 00:00:00.000',NULL,NULL,NULL,NULL,'2026-01-04 10:09:07.146'),(32,23,'TRE_EM','Lê','Minh Khang','Nam','2018-06-10 00:00:00.000',NULL,NULL,NULL,NULL,'2026-01-04 10:09:07.146'),(33,24,'NGUOI_LON','Phạm','Thu Trang','Nữ','1993-11-02 00:00:00.000',NULL,NULL,NULL,NULL,'2026-01-04 10:09:07.146'),(34,25,'NGUOI_LON','Võ','Thanh Tùng','Nam','1987-03-12 00:00:00.000',NULL,NULL,NULL,NULL,'2026-01-04 10:09:07.146'),(35,25,'TRE_EM','Võ','Gia Hân','Nữ','2025-01-05 00:00:00.000',NULL,NULL,NULL,NULL,'2026-01-04 10:09:07.146');
/*!40000 ALTER TABLE `hanh_khach` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `khach_san`
--

DROP TABLE IF EXISTS `khach_san`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `khach_san` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tenKhachSan` varchar(191) NOT NULL,
  `diaChi` varchar(191) NOT NULL,
  `thanhPho` varchar(191) NOT NULL,
  `quocGiaId` int NOT NULL,
  `soSao` int DEFAULT '0',
  `moTa` text,
  `hinhAnh` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `khach_san_quocGiaId_fkey` (`quocGiaId`),
  CONSTRAINT `khach_san_quocGiaId_fkey` FOREIGN KEY (`quocGiaId`) REFERENCES `quoc_gia` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `khach_san`
--

LOCK TABLES `khach_san` WRITE;
/*!40000 ALTER TABLE `khach_san` DISABLE KEYS */;
INSERT INTO `khach_san` VALUES (1,'Vinpearl Landmark 81','720A Điện Biên Phủ','TP. Hồ Chí Minh',1,5,NULL,NULL,'2026-01-04 09:59:06.515'),(2,'Hotel Nikko Saigon','235 Nguyễn Văn Cừ','TP. Hồ Chí Minh',1,5,NULL,NULL,'2026-01-04 09:59:06.515'),(3,'Rex Hotel Saigon','141 Nguyễn Huệ','TP. Hồ Chí Minh',1,5,NULL,NULL,'2026-01-04 09:59:06.515'),(4,'Liberty Central Saigon','179 Lê Thánh Tôn','TP. Hồ Chí Minh',1,4,NULL,NULL,'2026-01-04 09:59:06.515'),(5,'Silverland Jolie Hotel','4D Thi Sách','TP. Hồ Chí Minh',1,4,NULL,NULL,'2026-01-04 09:59:06.515'),(6,'Sofitel Legend Metropole','15 Ngô Quyền','Hà Nội',1,5,NULL,NULL,'2026-01-04 09:59:06.515'),(7,'Lotte Hotel Hanoi','54 Liễu Giai','Hà Nội',1,5,NULL,NULL,'2026-01-04 09:59:06.515'),(8,'Melia Hanoi','44B Lý Thường Kiệt','Hà Nội',1,5,NULL,NULL,'2026-01-04 09:59:06.515'),(9,'La Siesta Classic','94 Mã Mây','Hà Nội',1,4,NULL,NULL,'2026-01-04 09:59:06.515'),(10,'Muong Thanh Luxury','Võ Nguyên Giáp','Đà Nẵng',1,4,NULL,NULL,'2026-01-04 09:59:06.515'),(11,'InterContinental Danang','Bán đảo Sơn Trà','Đà Nẵng',1,5,NULL,NULL,'2026-01-04 09:59:06.515'),(12,'Novotel Danang Premier','Bạch Đằng','Đà Nẵng',1,5,NULL,NULL,'2026-01-04 09:59:06.515'),(13,'Haian Beach Hotel','Võ Nguyên Giáp','Đà Nẵng',1,4,NULL,NULL,'2026-01-04 09:59:06.515'),(14,'Vinpearl Resort Nha Trang','Đảo Hòn Tre','Nha Trang',1,5,NULL,NULL,'2026-01-04 09:59:06.515'),(15,'Sheraton Nha Trang','26–28 Trần Phú','Nha Trang',1,5,NULL,NULL,'2026-01-04 09:59:06.515'),(16,'Havana Hotel','38 Trần Phú','Nha Trang',1,4,NULL,NULL,'2026-01-04 09:59:06.515'),(17,'Vinpearl Resort Phu Quoc','Bãi Dài','Phú Quốc',1,5,NULL,NULL,'2026-01-04 09:59:06.515'),(18,'InterContinental Phu Quoc','Bãi Trường','Phú Quốc',1,5,NULL,NULL,'2026-01-04 09:59:06.515'),(19,'Salinda Resort','Cửa Lấp','Phú Quốc',1,5,NULL,NULL,'2026-01-04 09:59:06.515'),(20,'Baiyoke Sky Hotel','Ratchaprarop','Bangkok',2,4,NULL,NULL,'2026-01-04 09:59:06.515'),(21,'Mandarin Oriental Bangkok','Charoen Krung','Bangkok',2,5,NULL,NULL,'2026-01-04 09:59:06.515'),(22,'Marina Bay Sands','10 Bayfront Avenue','Singapore',3,5,NULL,NULL,'2026-01-04 09:59:06.515'),(23,'Raffles Hotel','1 Beach Road','Singapore',3,5,NULL,NULL,'2026-01-04 09:59:06.515');
/*!40000 ALTER TABLE `khach_san` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `khoang_ve`
--

LOCK TABLES `khoang_ve` WRITE;
/*!40000 ALTER TABLE `khoang_ve` DISABLE KEYS */;
INSERT INTO `khoang_ve` VALUES (1,'ECO','Economy','2026-01-04 09:54:46.347'),(2,'PECO','Premium Economy','2026-01-04 09:54:46.347'),(3,'BUS','Business','2026-01-04 09:54:46.347'),(4,'FST','First Class','2026-01-04 09:54:46.347');
/*!40000 ALTER TABLE `khoang_ve` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loai_phong`
--

DROP TABLE IF EXISTS `loai_phong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loai_phong` (
  `id` int NOT NULL AUTO_INCREMENT,
  `khachSanId` int NOT NULL,
  `tenLoaiPhong` varchar(191) NOT NULL,
  `giaMoiDem` decimal(15,2) NOT NULL,
  `soNguoiToiDa` int DEFAULT '2',
  `coAnSang` tinyint(1) DEFAULT '0',
  `conTrong` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `loai_phong_khachSanId_fkey` (`khachSanId`),
  CONSTRAINT `loai_phong_khachSanId_fkey` FOREIGN KEY (`khachSanId`) REFERENCES `khach_san` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loai_phong`
--

LOCK TABLES `loai_phong` WRITE;
/*!40000 ALTER TABLE `loai_phong` DISABLE KEYS */;
INSERT INTO `loai_phong` VALUES (1,1,'Deluxe King Room',3500000.00,2,0,10),(2,1,'Deluxe Twin Room',3600000.00,2,0,8),(3,1,'Executive Suite',6500000.00,2,0,5),(4,1,'Presidential Suite',15000000.00,2,0,2),(5,2,'Superior Room',2200000.00,2,0,20),(6,2,'Deluxe Room',2800000.00,2,0,15),(7,2,'Junior Suite',4500000.00,2,0,6),(8,3,'Standard Room',1800000.00,2,0,25),(9,3,'Family Room',3200000.00,2,0,10),(10,4,'Ocean View Room',4000000.00,2,0,12),(11,4,'Beachfront Villa',12000000.00,2,0,3),(12,5,'Superior City View',2600000.00,2,0,18),(13,5,'Executive City View',4200000.00,2,0,7),(14,1,'Deluxe King Room',3500000.00,2,0,10),(15,1,'Deluxe Twin Room',3600000.00,2,0,8),(16,1,'Executive Suite',6500000.00,2,0,5),(17,1,'Presidential Suite',15000000.00,2,0,2),(18,2,'Superior Room',2200000.00,2,0,20),(19,2,'Deluxe Room',2800000.00,2,0,15),(20,2,'Junior Suite',4500000.00,2,0,6),(21,3,'Standard Room',1800000.00,2,0,25),(22,3,'Family Room',3200000.00,2,0,10),(23,4,'Ocean View Room',4000000.00,2,0,12),(24,4,'Beachfront Villa',12000000.00,2,0,3),(25,5,'Superior City View',2600000.00,2,0,18),(26,5,'Executive City View',4200000.00,2,0,7);
/*!40000 ALTER TABLE `loai_phong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ma_giam_gia`
--

DROP TABLE IF EXISTS `ma_giam_gia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ma_giam_gia` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `loaiDichVu` enum('FLIGHT','HOTEL','COMBO','ALL') NOT NULL,
  `giaTriGiam` decimal(15,2) NOT NULL,
  `phanTramGiam` int DEFAULT NULL,
  `donToiThieu` decimal(15,2) DEFAULT '0.00',
  `ngayHetHan` datetime(3) NOT NULL,
  `soLuong` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ma_giam_gia`
--

LOCK TABLES `ma_giam_gia` WRITE;
/*!40000 ALTER TABLE `ma_giam_gia` DISABLE KEYS */;
INSERT INTO `ma_giam_gia` VALUES (1,'XINCHAO2026','ALL',50000.00,NULL,0.00,'2026-12-31 23:59:59.000',100),(2,'FLYHIGH','FLIGHT',200000.00,10,1000000.00,'2026-06-30 23:59:59.000',50),(3,'STAYVUI','HOTEL',0.00,15,500000.00,'2026-12-31 23:59:59.000',200);
/*!40000 ALTER TABLE `ma_giam_gia` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nhom_gia_ve`
--

LOCK TABLES `nhom_gia_ve` WRITE;
/*!40000 ALTER TABLE `nhom_gia_ve` DISABLE KEYS */;
INSERT INTO `nhom_gia_ve` VALUES (1,'Gói tiết kiệm',1,0,7,0,0,0.00,0.00,'2026-01-04 10:02:51.415','2026-01-04 10:02:51.000'),(2,'Gói tiêu chuẩn',1,20,7,0,0,0.00,0.00,'2026-01-04 10:02:51.415','2026-01-04 10:02:51.000'),(3,'Gói linh hoạt',1,23,7,0,0,0.00,0.00,'2026-01-04 10:02:51.415','2026-01-04 10:02:51.000'),(4,'Saver Basic',2,20,7,0,0,0.00,0.00,'2026-01-04 10:02:51.415','2026-01-04 10:02:51.000'),(5,'Saver Plus',2,25,7,0,0,0.00,0.00,'2026-01-04 10:02:51.415','2026-01-04 10:02:51.000'),(6,'Business Standard',4,32,7,0,0,0.00,0.00,'2026-01-04 10:02:51.415','2026-01-04 10:02:51.000'),(7,'Business Flex',5,40,7,0,0,0.00,0.00,'2026-01-04 10:02:51.415','2026-01-04 10:02:51.000');
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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quoc_gia`
--

LOCK TABLES `quoc_gia` WRITE;
/*!40000 ALTER TABLE `quoc_gia` DISABLE KEYS */;
INSERT INTO `quoc_gia` VALUES (1,'VN','Việt Nam','2026-01-04 09:54:21.802'),(2,'TH','Thái Lan','2026-01-04 09:54:21.802'),(3,'SG','Singapore','2026-01-04 09:54:21.802'),(4,'MY','Malaysia','2026-01-04 09:54:21.802'),(5,'ID','Indonesia','2026-01-04 09:54:21.802'),(6,'PH','Philippines','2026-01-04 09:54:21.802'),(7,'JP','Nhật Bản','2026-01-04 09:54:21.802'),(8,'KR','Hàn Quốc','2026-01-04 09:54:21.802'),(9,'CN','Trung Quốc','2026-01-04 09:54:21.802'),(10,'HK','Hồng Kông','2026-01-04 09:54:21.802'),(11,'TW','Đài Loan','2026-01-04 09:54:21.802'),(12,'AU','Úc','2026-01-04 09:54:21.802'),(13,'FR','Pháp','2026-01-04 09:54:21.802'),(14,'DE','Đức','2026-01-04 09:54:21.802'),(15,'GB','Vương quốc Anh','2026-01-04 09:54:21.802'),(16,'US','Hoa Kỳ','2026-01-04 09:54:21.802');
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
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `san_bay`
--

LOCK TABLES `san_bay` WRITE;
/*!40000 ALTER TABLE `san_bay` DISABLE KEYS */;
INSERT INTO `san_bay` VALUES (1,'HAN','Sân bay Nội Bài','Hà Nội',1,NULL,NULL,'2026-01-04 09:58:58.825'),(2,'SGN','Sân bay Tân Sơn Nhất','TP. Hồ Chí Minh',1,NULL,NULL,'2026-01-04 09:58:58.825'),(3,'DAD','Sân bay Đà Nẵng','Đà Nẵng',1,NULL,NULL,'2026-01-04 09:58:58.825'),(4,'CXR','Sân bay Cam Ranh','Nha Trang',1,NULL,NULL,'2026-01-04 09:58:58.825'),(5,'PQC','Sân bay Phú Quốc','Phú Quốc',1,NULL,NULL,'2026-01-04 09:58:58.825'),(6,'VCA','Sân bay Cần Thơ','Cần Thơ',1,NULL,NULL,'2026-01-04 09:58:58.825'),(7,'HPH','Sân bay Cát Bi','Hải Phòng',1,NULL,NULL,'2026-01-04 09:58:58.825'),(8,'BKK','Sân bay Suvarnabhumi','Bangkok',2,NULL,NULL,'2026-01-04 09:58:58.825'),(9,'DMK','Sân bay Don Mueang','Bangkok',2,NULL,NULL,'2026-01-04 09:58:58.825'),(10,'CNX','Sân bay Chiang Mai','Chiang Mai',2,NULL,NULL,'2026-01-04 09:58:58.825'),(11,'HKT','Sân bay Phuket','Phuket',2,NULL,NULL,'2026-01-04 09:58:58.825'),(12,'SIN','Sân bay Changi','Singapore',3,NULL,NULL,'2026-01-04 09:58:58.825'),(13,'KUL','Sân bay Kuala Lumpur','Kuala Lumpur',4,NULL,NULL,'2026-01-04 09:58:58.825'),(14,'NRT','Sân bay Narita','Tokyo',7,NULL,NULL,'2026-01-04 09:58:58.825'),(15,'HND','Sân bay Haneda','Tokyo',7,NULL,NULL,'2026-01-04 09:58:58.825'),(16,'KIX','Sân bay Kansai','Osaka',7,NULL,NULL,'2026-01-04 09:58:58.825'),(17,'ICN','Sân bay Incheon','Seoul',8,NULL,NULL,'2026-01-04 09:58:58.825'),(18,'GMP','Sân bay Gimpo','Seoul',8,NULL,NULL,'2026-01-04 09:58:58.825');
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
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `thanh_toan_maGiaoDich_key` (`maGiaoDich`),
  KEY `thanh_toan_donDatVeId_fkey` (`donDatVeId`),
  KEY `thanh_toan_nguoiDungId_fkey` (`nguoiDungId`),
  CONSTRAINT `thanh_toan_donDatVeId_fkey` FOREIGN KEY (`donDatVeId`) REFERENCES `don_dat_ve` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `thanh_toan_nguoiDungId_fkey` FOREIGN KEY (`nguoiDungId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thanh_toan`
--

LOCK TABLES `thanh_toan` WRITE;
/*!40000 ALTER TABLE `thanh_toan` DISABLE KEYS */;
INSERT INTO `thanh_toan` VALUES (2,21,1,'TRANS_88991122',1200000.00,'VND','VNPAY','THANH_CONG','{\"bank\": \"NCB\", \"desc\": \"Thanh toan ve may bay\", \"cardType\": \"ATM\"}','2026-01-04 10:11:51.713','2026-01-04 10:11:51.000');
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thong_tin_lien_he`
--

LOCK TABLES `thong_tin_lien_he` WRITE;
/*!40000 ALTER TABLE `thong_tin_lien_he` DISABLE KEYS */;
INSERT INTO `thong_tin_lien_he` VALUES (1,21,'Trần Hoài Bảo','baohoaitran3112@gmail.com','0901234567','2026-01-04 10:08:07.411'),(2,22,'Nguyễn Minh Anh','minhanh.nguyen@gmail.com','0912345678','2026-01-04 10:08:07.411'),(3,23,'Lê Quang Huy','quanghuy.le@gmail.com','0923456789','2026-01-04 10:08:07.411'),(4,24,'Phạm Thu Trang','thutrang.pham@gmail.com','0934567890','2026-01-04 10:08:07.411'),(5,25,'Võ Thanh Tùng','thanhtung.vo@gmail.com','0945678901','2026-01-04 10:08:07.411');
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tien_te`
--

LOCK TABLES `tien_te` WRITE;
/*!40000 ALTER TABLE `tien_te` DISABLE KEYS */;
INSERT INTO `tien_te` VALUES (1,'VND','Việt Nam Đồng',1.0000,'2026-01-04 09:54:28.199'),(2,'USD','Đô la Mỹ',25000.0000,'2026-01-04 09:54:28.199'),(3,'EUR','Euro',27000.0000,'2026-01-04 09:54:28.199'),(4,'JPY','Yên Nhật',170.0000,'2026-01-04 09:54:28.199'),(5,'KRW','Won Hàn Quốc',19.0000,'2026-01-04 09:54:28.199'),(6,'SGD','Đô la Singapore',18500.0000,'2026-01-04 09:54:28.199'),(7,'THB','Baht Thái',720.0000,'2026-01-04 09:54:28.199'),(8,'MYR','Ringgit Malaysia',5500.0000,'2026-01-04 09:54:28.199'),(9,'AUD','Đô la Úc',16500.0000,'2026-01-04 09:54:28.199');
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ton_cho`
--

LOCK TABLES `ton_cho` WRITE;
/*!40000 ALTER TABLE `ton_cho` DISABLE KEYS */;
INSERT INTO `ton_cho` VALUES (1,1,1,1,180,160,1200000.00,0.00,0.00,'2026-01-04 10:02:56.710','2026-01-04 10:02:56.000'),(2,1,1,2,180,150,1350000.00,0.00,0.00,'2026-01-04 10:02:56.710','2026-01-04 10:02:56.000'),(3,1,1,3,180,140,1500000.00,0.00,0.00,'2026-01-04 10:02:56.710','2026-01-04 10:02:56.000'),(4,1,4,6,30,25,3500000.00,0.00,0.00,'2026-01-04 10:02:56.710','2026-01-04 10:02:56.000'),(5,2,1,1,160,140,900000.00,0.00,0.00,'2026-01-04 10:02:56.710','2026-01-04 10:02:56.000'),(6,2,1,2,160,130,1100000.00,0.00,0.00,'2026-01-04 10:02:56.710','2026-01-04 10:02:56.000'),(7,3,1,2,200,180,3200000.00,0.00,0.00,'2026-01-04 10:02:56.710','2026-01-04 10:02:56.000'),(8,3,1,3,200,170,3500000.00,0.00,0.00,'2026-01-04 10:02:56.710','2026-01-04 10:02:56.000'),(9,3,4,6,40,35,7200000.00,0.00,0.00,'2026-01-04 10:02:56.710','2026-01-04 10:02:56.000'),(10,4,1,1,150,130,1400000.00,0.00,0.00,'2026-01-04 10:02:56.710','2026-01-04 10:02:56.000'),(11,5,1,1,150,125,2600000.00,0.00,0.00,'2026-01-04 10:02:56.710','2026-01-04 10:02:56.000');
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
  `googleId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`),
  UNIQUE KEY `users_googleId_key` (`googleId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'baohoaitran3112@gmail.com','','Trần Hoài Bảo_0027',NULL,'CUSTOMER','2026-01-04 02:25:12.815','2026-01-04 02:25:12.815','117669513356195071747'),(2,'user1@test.com','hashed_pw','Nguyễn Văn A','0901111111','CUSTOMER','2026-01-04 10:05:10.000','2026-01-04 10:05:10.000',NULL),(3,'user2@test.com','hashed_pw','Trần Thị B','0902222222','CUSTOMER','2026-01-04 10:05:10.000','2026-01-04 10:05:10.000',NULL),(4,'user3@test.com','hashed_pw','Lê Văn C','0903333333','CUSTOMER','2026-01-04 10:05:10.000','2026-01-04 10:05:10.000',NULL);
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
INSERT INTO `ve` VALUES (2,21,29,'7382419000001','HIEU_LUC','2026-01-04 10:14:16.000','2026-01-04 10:14:16.678'),(3,22,30,'7382419000002','HIEU_LUC','2026-01-04 10:14:16.000','2026-01-04 10:14:16.678'),(4,23,31,'7382419000003','HIEU_LUC','2026-01-04 10:14:16.000','2026-01-04 10:14:16.678'),(5,23,32,'7382419000004','HIEU_LUC','2026-01-04 10:14:16.000','2026-01-04 10:14:16.678'),(6,24,33,'7382419000005','DA_HUY','2026-01-04 10:14:16.000','2026-01-04 10:14:16.678'),(7,25,34,'7382419000006','HIEU_LUC','2026-01-04 10:14:16.000','2026-01-04 10:14:16.678'),(8,25,35,'7382419000007','HIEU_LUC','2026-01-04 10:14:16.000','2026-01-04 10:14:16.678');
/*!40000 ALTER TABLE `ve` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-04 10:18:21

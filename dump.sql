-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: headhunt
-- ------------------------------------------------------
-- Server version	8.0.36

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
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account` (
  `id` char(36) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `business_profile_id` bigint DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `image_url` text,
  `gender` enum('MALE','FEMALE','OTHER') DEFAULT NULL,
  `auth_provider` enum('LOCAL','GOOGLE','FACEBOOK','LINKEDIN') DEFAULT NULL,
  `provider_id` varchar(255) DEFAULT NULL,
  `status` enum('PENDING','ACTIVE','SUSPENDED','DELETED') DEFAULT 'PENDING',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `account_business_profile_id_fk` (`business_profile_id`),
  CONSTRAINT `account_business_profile_id_fk` FOREIGN KEY (`business_profile_id`) REFERENCES `business_profile` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES ('22222222-2222-2222-2222-222222222222','cuonghr','cuongct.ce190026@gmail.com','$2a$10$eArw4uM2QObahGKrI2.egOGFOi8Duvv9qbaatF4iL8BuLVNjHfAD2',1,'Châu Tấn Cường','0901000002',NULL,'FEMALE','LOCAL',NULL,'ACTIVE','2026-02-11 05:25:21','2026-03-10 16:15:23'),('33333333-3333-3333-3333-333333333333','haohr','haona.ce190361','$2a$10$eArw4uM2QObahGKrI2.egOGFOi8Duvv9qbaatF4iL8BuLVNjHfAD2',2,'Nguyễn Anh Hào','0901000003',NULL,'MALE','LOCAL',NULL,'ACTIVE','2026-02-11 05:25:21','2026-02-11 05:25:21'),('44444444-4444-4444-4444-444444444444','phucctv','phucdc.ce190770','$2a$10$eArw4uM2QObahGKrI2.egOGFOi8Duvv9qbaatF4iL8BuLVNjHfAD2',NULL,'Đinh Công Phúc','0901000004',NULL,'MALE','LOCAL',NULL,'ACTIVE','2026-02-11 05:25:21','2026-02-11 05:25:21'),('55555555-5555-5555-5555-555555555555','loictv','loilt.ce190481@gmail.com','$2a$10$eArw4uM2QObahGKrI2.egOGFOi8Duvv9qbaatF4iL8BuLVNjHfAD2',NULL,'Lê Thành Lợi','0901000005',NULL,'MALE','LOCAL',NULL,'ACTIVE','2026-02-11 05:25:21','2026-02-11 05:25:21'),('66666666-6666-6666-6666-666666666666','sangctv','votansang1711@gmail.com','$2a$10$eArw4uM2QObahGKrI2.egOGFOi8Duvv9qbaatF4iL8BuLVNjHfAD2',NULL,'Võ Tấn Sang','0901000006',NULL,'MALE','LOCAL',NULL,'ACTIVE','2026-02-11 05:25:21','2026-02-11 05:25:21'),('77777777-7777-7777-7777-777777777777','ducdev','nguyentrungduc.forwork@gmail.com','$2a$10$eArw4uM2QObahGKrI2.egOGFOi8Duvv9qbaatF4iL8BuLVNjHfAD2',NULL,'Nguyễn Trung Đức','0901000007',NULL,'MALE','LOCAL',NULL,'ACTIVE','2026-02-11 05:25:21','2026-02-11 05:25:21'),('8156bb1b-e259-4999-8139-14064898c621','deptrai2','datnhce1807977@fpt.edu.vn','$2a$10$YxwzGTzKyRnJOI8zrgIhx.tcV1o29HVd9AJYWpVtxOLl.wuSbSlqi',1,'dep trai','0704716414','https://headhunterstorage.blob.core.windows.net/uploads/superman-matday_a1b034d6-0154-4f24-ae04-a928b1d5a34e.jpg','MALE','LOCAL',NULL,'PENDING','2026-03-08 15:47:17','2026-03-08 15:47:17'),('88888888-8888-8888-8888-888888888888','diendev','dien@gmail.com','$2a$10$eArw4uM2QObahGKrI2.egOGFOi8Duvv9qbaatF4iL8BuLVNjHfAD2',NULL,'Dien','07929733143','https://headhunterstorage.blob.core.windows.net/uploads/images_0f80428d-3630-4f29-8fd9-7f967761b3fe.jpg','MALE','LOCAL',NULL,'ACTIVE','2026-02-11 05:25:21','2026-02-27 17:17:30'),('8de8b1b6-54ef-4555-857f-fa99a411794a','deptrai','datnhce180797@fpt.edu.vn','$2a$10$rzJOPBWGnK.rZDiOqChUZebjU.XQp99XJtXcq9RPFIskpiYhoisSy',3,'dep trai','0704716414','https://headhunterstorage.blob.core.windows.net/uploads/superman-matday_a967eaf9-1660-4f47-b369-1a9d59fddebc.jpg','MALE','LOCAL',NULL,'PENDING','2026-03-08 15:26:31','2026-03-08 15:26:31'),('97aacef4-bf45-412e-bcc5-042d0657bd09','donaldtrump','makeamericagreatagain@gmail.com','$2a$10$DXc3C8TnQ1eGKi/1y9KBJOVX5.u/0coLpBwciUwPjRJzVQr64onjW',NULL,'Donald John Trump','0704716414','https://headhunterstorage.blob.core.windows.net/uploads/trump_a55fe560-8545-4712-8f71-0839e618d318.jpg','MALE','LOCAL',NULL,'PENDING','2026-03-08 23:46:28','2026-03-08 23:46:28'),('e403e186-80a0-4ed1-9b55-f3340efec998','admin','datnh.work@gmail.com','$2a$10$eArw4uM2QObahGKrI2.egOGFOi8Duvv9qbaatF4iL8BuLVNjHfAD2',NULL,'Admin','0123456789','src/main/resources/static/img/admin-avatar.webp','OTHER','LOCAL','','ACTIVE','2026-02-26 15:26:59','2026-02-26 15:26:59');
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `account_role`
--

DROP TABLE IF EXISTS `account_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account_role` (
  `account_id` varchar(36) NOT NULL,
  `role` varchar(255) NOT NULL,
  PRIMARY KEY (`account_id`,`role`),
  KEY `fk_account_role_role` (`role`),
  CONSTRAINT `fk_account_role_account` FOREIGN KEY (`account_id`) REFERENCES `account` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_role`
--

LOCK TABLES `account_role` WRITE;
/*!40000 ALTER TABLE `account_role` DISABLE KEYS */;
INSERT INTO `account_role` VALUES ('e403e186-80a0-4ed1-9b55-f3340efec998','ADMIN'),('77777777-7777-7777-7777-777777777777','CANDIDATE'),('88888888-8888-8888-8888-888888888888','CANDIDATE'),('44444444-4444-4444-4444-444444444444','COLLABORATOR'),('55555555-5555-5555-5555-555555555555','COLLABORATOR'),('66666666-6666-6666-6666-666666666666','COLLABORATOR'),('97aacef4-bf45-412e-bcc5-042d0657bd09','COLLABORATOR'),('22222222-2222-2222-2222-222222222222','HEADHUNTER'),('33333333-3333-3333-3333-333333333333','HEADHUNTER'),('8156bb1b-e259-4999-8139-14064898c621','HEADHUNTER'),('8de8b1b6-54ef-4555-857f-fa99a411794a','HEADHUNTER');
/*!40000 ALTER TABLE `account_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `account_skill`
--

DROP TABLE IF EXISTS `account_skill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account_skill` (
  `account_id` char(36) NOT NULL,
  `skill_id` bigint NOT NULL,
  PRIMARY KEY (`account_id`,`skill_id`),
  KEY `fk_account_skill_skill` (`skill_id`),
  CONSTRAINT `fk_account_skill_account` FOREIGN KEY (`account_id`) REFERENCES `account` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_account_skill_skill` FOREIGN KEY (`skill_id`) REFERENCES `skill` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_skill`
--

LOCK TABLES `account_skill` WRITE;
/*!40000 ALTER TABLE `account_skill` DISABLE KEYS */;
/*!40000 ALTER TABLE `account_skill` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `application`
--

DROP TABLE IF EXISTS `application`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `application` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `job_id` bigint NOT NULL,
  `candidate_account_id` char(36) NOT NULL,
  `collaborator_account_id` char(36) DEFAULT NULL,
  `cv_snapshot_url` text,
  `status` enum('SUBMITTED','HEADHUNTER_ACCEPTED','REJECTED','HIRED','CANCELLED') DEFAULT 'SUBMITTED',
  `applied_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_app_job` (`job_id`),
  KEY `fk_app_candidate` (`candidate_account_id`),
  KEY `fk_app_collaborator` (`collaborator_account_id`),
  CONSTRAINT `fk_app_candidate` FOREIGN KEY (`candidate_account_id`) REFERENCES `account` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_app_collaborator` FOREIGN KEY (`collaborator_account_id`) REFERENCES `account` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_app_job` FOREIGN KEY (`job_id`) REFERENCES `job` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application`
--

LOCK TABLES `application` WRITE;
/*!40000 ALTER TABLE `application` DISABLE KEYS */;
INSERT INTO `application` VALUES (1,1,'66666666-6666-6666-6666-666666666666',NULL,'/snapshot/sang_tv001.pdf','HEADHUNTER_ACCEPTED','2026-02-11 05:25:22'),(2,2,'77777777-7777-7777-7777-777777777777','55555555-5555-5555-5555-555555555555','/snapshot/duc_fs001.pdf','HIRED','2026-02-11 05:25:22');
/*!40000 ALTER TABLE `application` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_profile`
--

DROP TABLE IF EXISTS `business_profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `business_profile` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `company_name` varchar(255) NOT NULL,
  `tax_code` varchar(255) DEFAULT NULL,
  `website_url` varchar(255) DEFAULT NULL,
  `address_main` text,
  `company_scale` varchar(255) DEFAULT NULL,
  `verification_status` enum('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',
  `note_by_admin` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_profile`
--

LOCK TABLES `business_profile` WRITE;
/*!40000 ALTER TABLE `business_profile` DISABLE KEYS */;
INSERT INTO `business_profile` VALUES (1,'TechVision JSC','0312345678','https://techvision.vn','Quận 1, TP.HCM','SMALL','APPROVED',NULL),(2,'FinStar Group','0318765432','https://finstar.vn','Quận 3, TP.HCM','LARGE','APPROVED',NULL),(3,'dep trai company','deptrai','deptrai.com','dep trai district','LARGE','PENDING',NULL);
/*!40000 ALTER TABLE `business_profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidate_cv`
--

DROP TABLE IF EXISTS `candidate_cv`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidate_cv` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `candidate_account_id` char(36) NOT NULL,
  `cv_url` text NOT NULL,
  `is_visible` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_cv_candidate` (`candidate_account_id`),
  CONSTRAINT `fk_cv_candidate` FOREIGN KEY (`candidate_account_id`) REFERENCES `account` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidate_cv`
--

LOCK TABLES `candidate_cv` WRITE;
/*!40000 ALTER TABLE `candidate_cv` DISABLE KEYS */;
INSERT INTO `candidate_cv` VALUES (1,'66666666-6666-6666-6666-666666666666','/cv/sang_cv.pdf',1,'2026-02-11 05:25:21'),(2,'77777777-7777-7777-7777-777777777777','/cv/duc_cv.pdf',1,'2026-02-11 05:25:21'),(3,'88888888-8888-8888-8888-888888888888','/cv/dien_cv.pdf',1,'2026-02-11 05:25:21');
/*!40000 ALTER TABLE `candidate_cv` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidate_profile`
--

DROP TABLE IF EXISTS `candidate_profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidate_profile` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `account_id` char(36) NOT NULL,
  `current_title` varchar(255) DEFAULT NULL,
  `years_of_experience` float DEFAULT NULL,
  `expected_salary_min` double DEFAULT NULL,
  `expected_salary_max` double DEFAULT NULL,
  `bio` text,
  `city` varchar(255) DEFAULT NULL,
  `open_for_work` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_candidate_account` (`account_id`),
  CONSTRAINT `fk_candidate_account` FOREIGN KEY (`account_id`) REFERENCES `account` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidate_profile`
--

LOCK TABLES `candidate_profile` WRITE;
/*!40000 ALTER TABLE `candidate_profile` DISABLE KEYS */;
INSERT INTO `candidate_profile` VALUES (1,'66666666-6666-6666-6666-666666666666','Backend Developer',3,1000,1500,'Spring Boot developer','Ho Chi Minh',1,'2026-02-11 05:25:21'),(2,'77777777-7777-7777-7777-777777777777','Frontend Developer',2,800,1200,'ReactJS developer','Ho Chi Minh',1,'2026-02-11 05:25:21'),(3,'88888888-8888-8888-8888-888888888888','QA Engineer',4,900,1300,'Manual & Automation Tester','Da Nang',1,'2026-02-11 05:25:21');
/*!40000 ALTER TABLE `candidate_profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `collaborator_profile`
--

DROP TABLE IF EXISTS `collaborator_profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `collaborator_profile` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `account_id` char(36) NOT NULL,
  `managed_by_headhunter_id` char(36) DEFAULT NULL,
  `commission_rate` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_collab_account` (`account_id`),
  KEY `fk_collab_manager` (`managed_by_headhunter_id`),
  CONSTRAINT `fk_collab_account` FOREIGN KEY (`account_id`) REFERENCES `account` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_collab_manager` FOREIGN KEY (`managed_by_headhunter_id`) REFERENCES `account` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `collaborator_profile`
--

LOCK TABLES `collaborator_profile` WRITE;
/*!40000 ALTER TABLE `collaborator_profile` DISABLE KEYS */;
INSERT INTO `collaborator_profile` VALUES (1,'44444444-4444-4444-4444-444444444444','22222222-2222-2222-2222-222222222222',15),(2,'55555555-5555-5555-5555-555555555555','33333333-3333-3333-3333-333333333333',15),(4,'97aacef4-bf45-412e-bcc5-042d0657bd09',NULL,15.5);
/*!40000 ALTER TABLE `collaborator_profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `commission`
--

DROP TABLE IF EXISTS `commission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `commission` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `application_id` bigint NOT NULL,
  `collaborator_account_id` char(36) NOT NULL,
  `salary_amount` double DEFAULT NULL,
  `commission_amount` double DEFAULT NULL,
  `status` enum('PENDING','PAID','CANCELLED') DEFAULT 'PENDING',
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_commission_application` (`application_id`),
  KEY `fk_commission_collaborator` (`collaborator_account_id`),
  CONSTRAINT `fk_commission_application` FOREIGN KEY (`application_id`) REFERENCES `application` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_commission_collaborator` FOREIGN KEY (`collaborator_account_id`) REFERENCES `account` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commission`
--

LOCK TABLES `commission` WRITE;
/*!40000 ALTER TABLE `commission` DISABLE KEYS */;
INSERT INTO `commission` VALUES (1,2,'55555555-5555-5555-5555-555555555555',1500,225,'PENDING','2026-02-11 05:25:22');
/*!40000 ALTER TABLE `commission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forum_category`
--

DROP TABLE IF EXISTS `forum_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `forum_category` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forum_category`
--

LOCK TABLES `forum_category` WRITE;
/*!40000 ALTER TABLE `forum_category` DISABLE KEYS */;
INSERT INTO `forum_category` VALUES (6,'Java'),(7,'Marketing'),(8,'Spring Framework'),(9,'Database'),(10,'Business Analyst');
/*!40000 ALTER TABLE `forum_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forum_comment`
--

DROP TABLE IF EXISTS `forum_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `forum_comment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `post_id` bigint NOT NULL,
  `account_id` char(36) NOT NULL,
  `content` text NOT NULL,
  `parent_comment_id` bigint DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_comment_post` (`post_id`),
  KEY `fk_comment_account` (`account_id`),
  CONSTRAINT `fk_comment_account` FOREIGN KEY (`account_id`) REFERENCES `account` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_comment_post` FOREIGN KEY (`post_id`) REFERENCES `forum_post` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forum_comment`
--

LOCK TABLES `forum_comment` WRITE;
/*!40000 ALTER TABLE `forum_comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `forum_comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forum_post`
--

DROP TABLE IF EXISTS `forum_post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `forum_post` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `author_account_id` char(36) NOT NULL,
  `category_id` bigint DEFAULT NULL,
  `job_id` bigint NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text,
  `status` enum('VISIBLE','HIDDEN') DEFAULT 'VISIBLE',
  `created_at` datetime DEFAULT NULL,
  `account_id` varchar(255) NOT NULL,
  `parent_comment_id` bigint DEFAULT NULL,
  `post_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_post_author` (`author_account_id`),
  KEY `fk_post_category` (`category_id`),
  KEY `forum_post_job_id_fk` (`job_id`),
  KEY `FK260rlmwt9vaaqddq2r5n6q0xp` (`account_id`),
  KEY `FKhttt9od7sybpd33mhkocfp1us` (`parent_comment_id`),
  KEY `FK9eayc480vt4i5eseswirgmerq` (`post_id`),
  CONSTRAINT `FK260rlmwt9vaaqddq2r5n6q0xp` FOREIGN KEY (`account_id`) REFERENCES `account` (`id`),
  CONSTRAINT `FK9eayc480vt4i5eseswirgmerq` FOREIGN KEY (`post_id`) REFERENCES `forum_post` (`id`),
  CONSTRAINT `fk_post_author` FOREIGN KEY (`author_account_id`) REFERENCES `account` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_post_category` FOREIGN KEY (`category_id`) REFERENCES `forum_category` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FKhttt9od7sybpd33mhkocfp1us` FOREIGN KEY (`parent_comment_id`) REFERENCES `forum_post` (`id`),
  CONSTRAINT `forum_post_job_id_fk` FOREIGN KEY (`job_id`) REFERENCES `job` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forum_post`
--

LOCK TABLES `forum_post` WRITE;
/*!40000 ALTER TABLE `forum_post` DISABLE KEYS */;
/*!40000 ALTER TABLE `forum_post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invalidated_token`
--

DROP TABLE IF EXISTS `invalidated_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invalidated_token` (
  `token_id` varchar(500) NOT NULL,
  `expiry_time` datetime(6) NOT NULL,
  `invalidated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`token_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invalidated_token`
--

LOCK TABLES `invalidated_token` WRITE;
/*!40000 ALTER TABLE `invalidated_token` DISABLE KEYS */;
INSERT INTO `invalidated_token` VALUES ('eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvaGVhZGh1bnQiLCJzdWIiOiJhZG1pbiIsImV4cCI6MTc3MjcwNDgzMSwiaWF0IjoxNzcyNjE4NDMxLCJzY29wZSI6IkFETUlOIn0.9Z0OlHliEZgGtOAIqKOZNmCxhB_Rp5EfVBZ1i7H-O7NoQZ8NE1jwkwIwZUF8_eIOhbmdbRqbGP_wPU7aykP6fg','2026-03-05 10:00:31.000000','2026-03-04 10:02:02.265636');
/*!40000 ALTER TABLE `invalidated_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job`
--

DROP TABLE IF EXISTS `job`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `job_code` varchar(255) DEFAULT NULL,
  `headhunter_account_id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `quantity` int DEFAULT '1',
  `working_type` enum('ONSITE','REMOTE','HYBRID') DEFAULT NULL,
  `salary_min` double DEFAULT NULL,
  `salary_max` double DEFAULT NULL,
  `currency` varchar(255) DEFAULT NULL,
  `description` text,
  `deadline` date DEFAULT NULL,
  `status` enum('DRAFT','OPEN','CLOSED') DEFAULT 'DRAFT',
  `city` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_job_headhunter` (`headhunter_account_id`),
  CONSTRAINT `fk_job_headhunter` FOREIGN KEY (`headhunter_account_id`) REFERENCES `account` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job`
--

LOCK TABLES `job` WRITE;
/*!40000 ALTER TABLE `job` DISABLE KEYS */;
INSERT INTO `job` VALUES (1,'TV-001','22222222-2222-2222-2222-222222222222','Senior Backend Developer',2,'ONSITE',1200,2000,'USD','Spring Boot, MySQL','2026-12-31','OPEN','Ho Chi Minh','2026-02-11 05:25:21'),(2,'FS-001','33333333-3333-3333-3333-333333333333','ReactJS Developer',1,'HYBRID',1000,1800,'USD','ReactJS + TypeScript','2026-11-30','OPEN','Ho Chi Minh','2026-02-11 05:25:21');
/*!40000 ALTER TABLE `job` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_skill`
--

DROP TABLE IF EXISTS `job_skill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_skill` (
  `job_id` bigint NOT NULL,
  `skill_id` bigint NOT NULL,
  PRIMARY KEY (`job_id`,`skill_id`),
  KEY `fk_job_skill_skill` (`skill_id`),
  CONSTRAINT `fk_job_skill_job` FOREIGN KEY (`job_id`) REFERENCES `job` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_job_skill_skill` FOREIGN KEY (`skill_id`) REFERENCES `skill` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_skill`
--

LOCK TABLES `job_skill` WRITE;
/*!40000 ALTER TABLE `job_skill` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_skill` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otp_token`
--

DROP TABLE IF EXISTS `otp_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otp_token` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `account_id` varchar(36) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `code` varchar(6) NOT NULL,
  `token_type` enum('SIGN_UP','FORGOT_PASSWORD','CHANGE_EMAIL') NOT NULL,
  `used` bit(1) NOT NULL DEFAULT b'0',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `expires_at` datetime(6) NOT NULL,
  `attempt_count` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_otp_token_account` (`account_id`),
  CONSTRAINT `fk_otp_token_account` FOREIGN KEY (`account_id`) REFERENCES `account` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otp_token`
--

LOCK TABLES `otp_token` WRITE;
/*!40000 ALTER TABLE `otp_token` DISABLE KEYS */;
INSERT INTO `otp_token` VALUES (6,NULL,'hoangdat060504@gmail.com','511488','SIGN_UP',_binary '\0','2026-03-02 06:19:52.713778','2026-03-02 06:24:52.713778',0),(7,NULL,'datnhce180797@fpt.edu.vn','556948','SIGN_UP',_binary '\0','2026-03-02 06:20:55.118364','2026-03-02 06:25:55.118364',0),(8,NULL,'datnhce180797@fpt.edu.vn','573850','SIGN_UP',_binary '\0','2026-03-02 06:22:45.023540','2026-03-02 06:27:45.023540',0),(9,NULL,'datnhce180797@fpt.edu.vn','424510','SIGN_UP',_binary '\0','2026-03-02 06:32:52.658686','2026-03-02 06:37:52.658686',0),(10,NULL,'datnhce180797@fpt.edu.vn','727758','SIGN_UP',_binary '\0','2026-03-02 06:43:03.249780','2026-03-02 06:48:03.249780',0),(11,NULL,'datnhce180797@fpt.edu.vn','279824','SIGN_UP',_binary '','2026-03-02 06:56:29.535230','2026-03-02 07:01:29.535230',0),(12,NULL,'datnhce180797@fpt.edu.vn','849334','SIGN_UP',_binary '','2026-03-02 08:18:11.954330','2026-03-02 08:23:11.954330',0),(13,NULL,'datnhce180797@fpt.edu.vn','988410','SIGN_UP',_binary '\0','2026-03-02 08:41:30.769353','2026-03-02 08:46:30.769353',0),(14,NULL,'datnhce180797@fpt.edu.vn','913896','SIGN_UP',_binary '','2026-03-03 08:35:13.877729','2026-03-03 08:40:13.877729',0),(15,NULL,'datnhce180797@fpt.edu.vn','583858','SIGN_UP',_binary '\0','2026-03-04 09:37:17.081743','2026-03-04 09:42:17.081743',0),(16,'22222222-2222-2222-2222-222222222222','cuongct.ce190026@gmail.com','547703','FORGOT_PASSWORD',_binary '','2026-03-04 09:42:51.906586','2026-03-04 09:47:51.906586',0),(17,NULL,'datnhce180797@fpt.edu.vn','250629','SIGN_UP',_binary '\0','2026-03-05 07:37:26.030146','2026-03-05 07:42:26.030146',0);
/*!40000 ALTER TABLE `otp_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skill`
--

DROP TABLE IF EXISTS `skill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `skill` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `category` enum('PROGRAMMING_LANGUAGES','FRONTEND_DEVELOPMENT','BACKEND_DEVELOPMENT','DATABASES','DEVOPS_AND_CLOUD','TESTING','VERSION_CONTROL','SOFTWARE_ARCHITECTURE_AND_CONCEPTS','DATA_AND_AI','OTHERS') NOT NULL DEFAULT 'OTHERS',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `idx_skill_category` (`category`),
  KEY `idx_skill_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=137 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skill`
--

LOCK TABLES `skill` WRITE;
/*!40000 ALTER TABLE `skill` DISABLE KEYS */;
INSERT INTO `skill` VALUES (1,'Java','PROGRAMMING_LANGUAGES'),(2,'JavaScript','PROGRAMMING_LANGUAGES'),(3,'TypeScript','PROGRAMMING_LANGUAGES'),(4,'Python','PROGRAMMING_LANGUAGES'),(5,'C','PROGRAMMING_LANGUAGES'),(6,'C++','PROGRAMMING_LANGUAGES'),(7,'C#','PROGRAMMING_LANGUAGES'),(8,'Go','PROGRAMMING_LANGUAGES'),(9,'Kotlin','PROGRAMMING_LANGUAGES'),(10,'PHP','PROGRAMMING_LANGUAGES'),(11,'Ruby','PROGRAMMING_LANGUAGES'),(12,'Rust','PROGRAMMING_LANGUAGES'),(13,'Swift','PROGRAMMING_LANGUAGES'),(14,'Dart','PROGRAMMING_LANGUAGES'),(15,'SQL','PROGRAMMING_LANGUAGES'),(16,'Bash','PROGRAMMING_LANGUAGES'),(17,'HTML5','FRONTEND_DEVELOPMENT'),(18,'CSS3','FRONTEND_DEVELOPMENT'),(19,'Sass','FRONTEND_DEVELOPMENT'),(20,'Less','FRONTEND_DEVELOPMENT'),(21,'Tailwind CSS','FRONTEND_DEVELOPMENT'),(22,'Bootstrap','FRONTEND_DEVELOPMENT'),(23,'Material UI','FRONTEND_DEVELOPMENT'),(24,'React','FRONTEND_DEVELOPMENT'),(25,'Next.js','FRONTEND_DEVELOPMENT'),(26,'Vue.js','FRONTEND_DEVELOPMENT'),(27,'Nuxt.js','FRONTEND_DEVELOPMENT'),(28,'Angular','FRONTEND_DEVELOPMENT'),(29,'Vite','FRONTEND_DEVELOPMENT'),(30,'Webpack','FRONTEND_DEVELOPMENT'),(31,'Redux','FRONTEND_DEVELOPMENT'),(32,'jQuery','FRONTEND_DEVELOPMENT'),(33,'Spring Framework','BACKEND_DEVELOPMENT'),(34,'Spring Boot','BACKEND_DEVELOPMENT'),(35,'Node.js','BACKEND_DEVELOPMENT'),(36,'Express.js','BACKEND_DEVELOPMENT'),(37,'NestJS','BACKEND_DEVELOPMENT'),(38,'Django','BACKEND_DEVELOPMENT'),(39,'Flask','BACKEND_DEVELOPMENT'),(40,'Laravel','BACKEND_DEVELOPMENT'),(41,'ASP.NET Core','BACKEND_DEVELOPMENT'),(42,'Ruby on Rails','BACKEND_DEVELOPMENT'),(43,'Hibernate','BACKEND_DEVELOPMENT'),(44,'JPA','BACKEND_DEVELOPMENT'),(45,'RESTful API Development','BACKEND_DEVELOPMENT'),(46,'GraphQL','BACKEND_DEVELOPMENT'),(47,'Microservices','BACKEND_DEVELOPMENT'),(48,'Authentication & Authorization','BACKEND_DEVELOPMENT'),(49,'JWT','BACKEND_DEVELOPMENT'),(50,'OAuth2','BACKEND_DEVELOPMENT'),(51,'MySQL','DATABASES'),(52,'PostgreSQL','DATABASES'),(53,'MariaDB','DATABASES'),(54,'SQLite','DATABASES'),(55,'MongoDB','DATABASES'),(56,'Redis','DATABASES'),(57,'Oracle Database','DATABASES'),(58,'Microsoft SQL Server','DATABASES'),(59,'Elasticsearch','DATABASES'),(60,'Firebase Realtime Database','DATABASES'),(61,'Firestore','DATABASES'),(62,'Database Design','DATABASES'),(63,'Database Optimization','DATABASES'),(64,'Indexing','DATABASES'),(65,'Query Optimization','DATABASES'),(66,'Docker','DEVOPS_AND_CLOUD'),(67,'Kubernetes','DEVOPS_AND_CLOUD'),(68,'Jenkins','DEVOPS_AND_CLOUD'),(69,'GitHub Actions','DEVOPS_AND_CLOUD'),(70,'GitLab CI/CD','DEVOPS_AND_CLOUD'),(71,'CircleCI','DEVOPS_AND_CLOUD'),(72,'AWS','DEVOPS_AND_CLOUD'),(73,'Microsoft Azure','DEVOPS_AND_CLOUD'),(74,'Google Cloud Platform','DEVOPS_AND_CLOUD'),(75,'Terraform','DEVOPS_AND_CLOUD'),(76,'Ansible','DEVOPS_AND_CLOUD'),(77,'Nginx','DEVOPS_AND_CLOUD'),(78,'Apache','DEVOPS_AND_CLOUD'),(79,'Linux Server Administration','DEVOPS_AND_CLOUD'),(80,'CI/CD','DEVOPS_AND_CLOUD'),(81,'Containerization','DEVOPS_AND_CLOUD'),(82,'JUnit','TESTING'),(83,'Mockito','TESTING'),(84,'TestNG','TESTING'),(85,'Jest','TESTING'),(86,'Mocha','TESTING'),(87,'Chai','TESTING'),(88,'Cypress','TESTING'),(89,'Selenium','TESTING'),(90,'Playwright','TESTING'),(91,'Postman','TESTING'),(92,'Supertest','TESTING'),(93,'Unit Testing','TESTING'),(94,'Integration Testing','TESTING'),(95,'End-to-End Testing','TESTING'),(96,'Test Automation','TESTING'),(97,'Git','VERSION_CONTROL'),(98,'GitHub','VERSION_CONTROL'),(99,'GitLab','VERSION_CONTROL'),(100,'Bitbucket','VERSION_CONTROL'),(101,'Git Flow','VERSION_CONTROL'),(102,'Version Control','VERSION_CONTROL'),(103,'Code Review','VERSION_CONTROL'),(104,'Pull Requests','VERSION_CONTROL'),(105,'Object-Oriented Programming (OOP)','SOFTWARE_ARCHITECTURE_AND_CONCEPTS'),(106,'Functional Programming','SOFTWARE_ARCHITECTURE_AND_CONCEPTS'),(107,'Design Patterns','SOFTWARE_ARCHITECTURE_AND_CONCEPTS'),(108,'SOLID Principles','SOFTWARE_ARCHITECTURE_AND_CONCEPTS'),(109,'Clean Architecture','SOFTWARE_ARCHITECTURE_AND_CONCEPTS'),(110,'Domain-Driven Design (DDD)','SOFTWARE_ARCHITECTURE_AND_CONCEPTS'),(111,'MVC Architecture','SOFTWARE_ARCHITECTURE_AND_CONCEPTS'),(112,'MVVM Architecture','SOFTWARE_ARCHITECTURE_AND_CONCEPTS'),(113,'Event-Driven Architecture','SOFTWARE_ARCHITECTURE_AND_CONCEPTS'),(114,'API Design','SOFTWARE_ARCHITECTURE_AND_CONCEPTS'),(115,'REST Architecture','SOFTWARE_ARCHITECTURE_AND_CONCEPTS'),(116,'Microservices Architecture','SOFTWARE_ARCHITECTURE_AND_CONCEPTS'),(117,'Monolithic Architecture','SOFTWARE_ARCHITECTURE_AND_CONCEPTS'),(118,'Dependency Injection','SOFTWARE_ARCHITECTURE_AND_CONCEPTS'),(119,'Concurrency','SOFTWARE_ARCHITECTURE_AND_CONCEPTS'),(120,'Multithreading','SOFTWARE_ARCHITECTURE_AND_CONCEPTS'),(121,'Data Structures & Algorithms','SOFTWARE_ARCHITECTURE_AND_CONCEPTS'),(122,'Data Analysis','DATA_AND_AI'),(123,'Data Engineering','DATA_AND_AI'),(124,'Data Visualization','DATA_AND_AI'),(125,'Machine Learning','DATA_AND_AI'),(126,'Deep Learning','DATA_AND_AI'),(127,'Natural Language Processing (NLP)','DATA_AND_AI'),(128,'Computer Vision','DATA_AND_AI'),(129,'TensorFlow','DATA_AND_AI'),(130,'PyTorch','DATA_AND_AI'),(131,'Scikit-learn','DATA_AND_AI'),(132,'Pandas','DATA_AND_AI'),(133,'NumPy','DATA_AND_AI'),(134,'Apache Spark','DATA_AND_AI'),(135,'Big Data','DATA_AND_AI'),(136,'ETL Pipelines','DATA_AND_AI');
/*!40000 ALTER TABLE `skill` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'headhunt'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-11 14:02:00

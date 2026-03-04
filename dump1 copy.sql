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
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES ('22222222-2222-2222-2222-222222222222','cuonghr','cuongct.ce190026@gmail.com','$2a$10$eArw4uM2QObahGKrI2.egOGFOi8Duvv9qbaatF4iL8BuLVNjHfAD2','Châu Tấn Cường','0901000002',NULL,'FEMALE','LOCAL',NULL,'ACTIVE','2026-02-11 05:25:21','2026-02-11 05:25:21'),('33333333-3333-3333-3333-333333333333','haohr','haona.ce190361','$2a$10$eArw4uM2QObahGKrI2.egOGFOi8Duvv9qbaatF4iL8BuLVNjHfAD2','Nguyễn Anh Hào','0901000003',NULL,'MALE','LOCAL',NULL,'ACTIVE','2026-02-11 05:25:21','2026-02-11 05:25:21'),('44444444-4444-4444-4444-444444444444','phucctv','phucdc.ce190770','$2a$10$eArw4uM2QObahGKrI2.egOGFOi8Duvv9qbaatF4iL8BuLVNjHfAD2','Đinh Công Phúc','0901000004',NULL,'MALE','LOCAL',NULL,'ACTIVE','2026-02-11 05:25:21','2026-02-11 05:25:21'),('55555555-5555-5555-5555-555555555555','loictv','loilt.ce190481@gmail.com','$2a$10$eArw4uM2QObahGKrI2.egOGFOi8Duvv9qbaatF4iL8BuLVNjHfAD2','Lê Thành Lợi','0901000005',NULL,'MALE','LOCAL',NULL,'ACTIVE','2026-02-11 05:25:21','2026-02-11 05:25:21'),('66666666-6666-6666-6666-666666666666','sangctv','votansang1711@gmail.com','$2a$10$eArw4uM2QObahGKrI2.egOGFOi8Duvv9qbaatF4iL8BuLVNjHfAD2','Võ Tấn Sang','0901000006',NULL,'MALE','LOCAL',NULL,'ACTIVE','2026-02-11 05:25:21','2026-02-11 05:25:21'),('77777777-7777-7777-7777-777777777777','ducdev','nguyentrungduc.forwork@gmail.com','$2a$10$eArw4uM2QObahGKrI2.egOGFOi8Duvv9qbaatF4iL8BuLVNjHfAD2','Nguyễn Trung Đức','0901000007',NULL,'MALE','LOCAL',NULL,'ACTIVE','2026-02-11 05:25:21','2026-02-11 05:25:21'),('88888888-8888-8888-8888-888888888888','diendev','dien@gmail.com','$2a$10$eArw4uM2QObahGKrI2.egOGFOi8Duvv9qbaatF4iL8BuLVNjHfAD2','Dien','07929733143','https://headhunterstorage.blob.core.windows.net/uploads/images_0f80428d-3630-4f29-8fd9-7f967761b3fe.jpg','MALE','LOCAL',NULL,'ACTIVE','2026-02-11 05:25:21','2026-02-27 17:17:30'),('e403e186-80a0-4ed1-9b55-f3340efec998','admin','datnh.work@gmail.com','$2a$10$eArw4uM2QObahGKrI2.egOGFOi8Duvv9qbaatF4iL8BuLVNjHfAD2','Admin','0123456789','src/main/resources/static/img/admin-avatar.webp','OTHER','LOCAL','','ACTIVE','2026-02-26 15:26:59','2026-02-26 15:26:59');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_role`
--

LOCK TABLES `account_role` WRITE;
/*!40000 ALTER TABLE `account_role` DISABLE KEYS */;
INSERT INTO `account_role` VALUES ('e403e186-80a0-4ed1-9b55-f3340efec998','ADMIN'),('77777777-7777-7777-7777-777777777777','CANDIDATE'),('88888888-8888-8888-8888-888888888888','CANDIDATE'),('44444444-4444-4444-4444-444444444444','COLLABORATOR'),('55555555-5555-5555-5555-555555555555','COLLABORATOR'),('66666666-6666-6666-6666-666666666666','COLLABORATOR'),('22222222-2222-2222-2222-222222222222','HEADHUNTER'),('33333333-3333-3333-3333-333333333333','HEADHUNTER');
/*!40000 ALTER TABLE `account_role` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `account_id` char(36) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `tax_code` varchar(255) DEFAULT NULL,
  `website_url` varchar(255) DEFAULT NULL,
  `address_main` text,
  `company_scale` varchar(255) DEFAULT NULL,
  `verification_status` enum('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',
  `note_by_admin` text,
  PRIMARY KEY (`id`),
  KEY `fk_business_account` (`account_id`),
  CONSTRAINT `fk_business_account` FOREIGN KEY (`account_id`) REFERENCES `account` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_profile`
--

LOCK TABLES `business_profile` WRITE;
/*!40000 ALTER TABLE `business_profile` DISABLE KEYS */;
INSERT INTO `business_profile` VALUES (1,'22222222-2222-2222-2222-222222222222','TechVision JSC','0312345678','https://techvision.vn','Quận 1, TP.HCM','100-300','APPROVED',NULL),(2,'33333333-3333-3333-3333-333333333333','FinStar Group','0318765432','https://finstar.vn','Quận 3, TP.HCM','300-500','APPROVED',NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `bank_info` text,
  `commission_rate` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_collab_account` (`account_id`),
  KEY `fk_collab_manager` (`managed_by_headhunter_id`),
  CONSTRAINT `fk_collab_account` FOREIGN KEY (`account_id`) REFERENCES `account` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_collab_manager` FOREIGN KEY (`managed_by_headhunter_id`) REFERENCES `account` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `collaborator_profile`
--

LOCK TABLES `collaborator_profile` WRITE;
/*!40000 ALTER TABLE `collaborator_profile` DISABLE KEYS */;
INSERT INTO `collaborator_profile` VALUES (1,'44444444-4444-4444-4444-444444444444','22222222-2222-2222-2222-222222222222','Vietcombank - 0123456789 - Dinh Cong Phuc',15),(2,'55555555-5555-5555-5555-555555555555','33333333-3333-3333-3333-333333333333','ACB - 9876543210 - Le Thanh Loi',15);
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forum_post`
--

LOCK TABLES `forum_post` WRITE;
/*!40000 ALTER TABLE `forum_post` DISABLE KEYS */;
/*!40000 ALTER TABLE `forum_post` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  PRIMARY KEY (`id`),
  KEY `fk_otp_token_account` (`account_id`),
  CONSTRAINT `fk_otp_token_account` FOREIGN KEY (`account_id`) REFERENCES `account` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otp_token`
--

LOCK TABLES `otp_token` WRITE;
/*!40000 ALTER TABLE `otp_token` DISABLE KEYS */;
INSERT INTO `otp_token` VALUES (6,NULL,'hoangdat060504@gmail.com','511488','SIGN_UP',_binary '\0','2026-03-02 06:19:52.713778','2026-03-02 06:24:52.713778'),(7,NULL,'datnhce180797@fpt.edu.vn','556948','SIGN_UP',_binary '\0','2026-03-02 06:20:55.118364','2026-03-02 06:25:55.118364'),(8,NULL,'datnhce180797@fpt.edu.vn','573850','SIGN_UP',_binary '\0','2026-03-02 06:22:45.023540','2026-03-02 06:27:45.023540'),(9,NULL,'datnhce180797@fpt.edu.vn','424510','SIGN_UP',_binary '\0','2026-03-02 06:32:52.658686','2026-03-02 06:37:52.658686'),(10,NULL,'datnhce180797@fpt.edu.vn','727758','SIGN_UP',_binary '\0','2026-03-02 06:43:03.249780','2026-03-02 06:48:03.249780'),(11,NULL,'datnhce180797@fpt.edu.vn','279824','SIGN_UP',_binary '\x01','2026-03-02 06:56:29.535230','2026-03-02 07:01:29.535230');
/*!40000 ALTER TABLE `otp_token` ENABLE KEYS */;
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

-- Dump completed on 2026-03-02 14:24:12

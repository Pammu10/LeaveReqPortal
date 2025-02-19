CREATE DATABASE  IF NOT EXISTS `hod_leave` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `hod_leave`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: hod_leave
-- ------------------------------------------------------
-- Server version	8.0.41

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
-- Table structure for table `leave_requests`
--

DROP TABLE IF EXISTS `leave_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leave_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `leave_type` varchar(50) DEFAULT NULL,
  `visiting_place` varchar(100) DEFAULT NULL,
  `from_date` date DEFAULT NULL,
  `from_time` time DEFAULT NULL,
  `to_date` date DEFAULT NULL,
  `to_time` time DEFAULT NULL,
  `reason` text,
  `status` varchar(20) DEFAULT 'Pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `studentID` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_student` (`studentID`),
  CONSTRAINT `fk_student` FOREIGN KEY (`studentID`) REFERENCES `student_records` (`registration_number`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leave_requests`
--

LOCK TABLES `leave_requests` WRITE;
/*!40000 ALTER TABLE `leave_requests` DISABLE KEYS */;
INSERT INTO `leave_requests` VALUES (1,'sick','ecijeic','2025-02-03','16:56:00','2025-01-17','17:54:00','ecijwpejcpewqjdfpwejfpwjfipwjf','approved','2025-02-03 11:27:54',NULL),(2,'sick','ecijeic','2025-02-03','16:56:00','2025-01-17','17:54:00','ecijwpejcpewqjdfpwejfpwjfipwjf','rejected','2025-02-04 05:15:11',NULL),(3,'sick','ecijeic','2025-02-03','16:56:00','2025-01-17','17:54:00','ecijwpejcpewqjdfpwejfpwjfipwjf','approved','2025-02-04 05:15:13',NULL),(4,'sick','ecijeic','2025-02-03','16:56:00','2025-01-17','17:54:00','ecijwpejcpewqjdfpwejfpwjfipwjf','approved','2025-02-04 05:15:14',NULL),(5,'sick','ecijeic','2025-02-03','16:56:00','2025-01-17','17:54:00','ecijwpejcpewqjdfpwejfpwjfipwjf','rejected','2025-02-04 05:15:15',NULL),(6,'sick','ecijeic','2025-02-03','16:56:00','2025-01-17','17:54:00','ecijwpejcpewqjdfpwejfpwjfipwjf','approved','2025-02-04 05:15:15',NULL),(7,'sick','ecijeic','2025-02-03','16:56:00','2025-01-17','17:54:00','ecijwpejcpewqjdfpwejfpwjfipwjf','rejected','2025-02-04 05:15:15',NULL),(8,'sick','ecijeic','2025-02-03','16:56:00','2025-01-17','17:54:00','ecijwpejcpewqjdfpwejfpwjfipwjf','approved','2025-02-04 05:15:16',NULL),(9,'sick','HOIYYAAAA','2025-02-03','16:56:00','2025-01-17','17:54:00','ecijwpejcpewqjdfpwejfpwjfipwjf','approved','2025-02-04 05:15:24',NULL),(10,'emergency','IAMSUBMITTING','2025-02-04','10:50:00','2025-02-14','22:49:00','f35f43f','rejected','2025-02-04 05:18:35',NULL),(11,'sick','efdw2f','2025-02-06','23:33:00','2025-02-08','23:32:00','f2f2f','approved','2025-02-04 06:02:16',NULL),(12,'emergency','Emergency','2025-02-07','10:46:00','2025-02-08','22:46:00','EMERGENCY','approved','2025-02-07 05:16:43',NULL),(13,'emergency','Emergency ward','2025-02-14','10:47:00','2025-02-21','12:51:00','Emergency duhh','rejected','2025-02-14 05:17:42','REG123'),(14,'emergency','Emergency ward','2025-02-14','10:47:00','2025-02-21','12:51:00','Emergency duhh','rejected','2025-02-14 05:18:35','REG123'),(15,'medical','chennia','2025-02-14','13:19:00','2025-02-07','13:21:00','learning','rejected','2025-02-14 07:48:06','REG123'),(16,'od','hpiyaaa','2025-02-04','13:19:00','2025-02-21','13:21:00','sus activities','approved','2025-02-14 07:48:23','REG123'),(17,'od','chennai','2025-02-19','14:01:00','2025-02-13','14:02:00','some reason','approved','2025-02-18 09:30:03','REG123'),(18,'sick','mumbai','2025-02-19','14:01:00','2025-02-13','14:02:00','some other reason','rejected','2025-02-18 09:30:16','REG123'),(19,'sick','Emergency','2025-02-19','11:53:00','2025-02-20','23:54:00','hoiyaaaaa','rejected','2025-02-19 06:22:04','REG123'),(20,'emergency','ecijeic','2025-02-28','23:58:00','2025-02-07','23:58:00','frf','approved','2025-02-19 06:26:19','REG123'),(21,'sick','Emergency','2025-02-19','16:26:00','2025-02-27','13:30:00','efwknefoewf','approved','2025-02-19 08:01:47','REG345'),(22,'emergency','fwefwef','2025-02-13','13:35:00','2025-02-20','13:36:00','fwefwefwefwef','rejected','2025-02-19 08:02:31','REG345');
/*!40000 ALTER TABLE `leave_requests` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-19 16:34:27

-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: 100.115.107.83    Database: dsw_equipamentos
-- ------------------------------------------------------
-- Server version	8.0.46-37

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auth_sessions`
--

DROP TABLE IF EXISTS `auth_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_sessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `nome` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `photo_url` text COLLATE utf8mb4_general_ci,
  `token_usado` longtext COLLATE utf8mb4_general_ci NOT NULL,
  `last_login_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_sessions`
--

LOCK TABLES `auth_sessions` WRITE;
/*!40000 ALTER TABLE `auth_sessions` DISABLE KEYS */;
INSERT INTO `auth_sessions` VALUES (1,'joaovitor00220@gmail.com','João Vitor de Souza Costa','https://lh3.googleusercontent.com/a/ACg8ocI__30WsOckezWSD22Wmie5_2snUopcc-rcjRyPwAdeXR3dmPt4=s96-c','eyJhbGciOiJSUzI1NiIsImtpZCI6ImVlOTA0NmVhZDJlMDUwMDAxMGVkNTA0M2I0ODNkODRiMGM1MmM3YzQiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiSm_Do28gVml0b3IgZGUgU291emEgQ29zdGEiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSV9fMzBXc09ja2V6V1NEMjJXbWllNV8yc25Vb3BjYy1yY2pSeVB3QWRlWFIzZG1QdDQ9czk2LWMiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZHN3MjAyNi0xLTNmMmRmIiwiYXVkIjoiZHN3MjAyNi0xLTNmMmRmIiwiYXV0aF90aW1lIjoxNzgyMTgwODk3LCJ1c2VyX2lkIjoiSVduNEs3REJ0WVI5SnRRTmFTOTdTNlBra2E4MiIsInN1YiI6IklXbjRLN0RCdFlSOUp0UU5hUzk3UzZQa2thODIiLCJpYXQiOjE3ODIxODA4OTcsImV4cCI6MTc4MjE4NDQ5NywiZW1haWwiOiJqb2Fvdml0b3IwMDIyMEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjEwMzY3Njg0MjIxMTQwNDE2OTExMiJdLCJlbWFpbCI6WyJqb2Fvdml0b3IwMDIyMEBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.LFm8QcB5JnC8KJOENzscV1U1h6Ll-kpg-cKEx1IFvMVTGJij-IDkRCTHNZprxi7O6uKgQ9IsKuwOHwzb1EsM5PzZprpSaiS5xH83Pl5bncKyCd9cvPr9CzYpTbP0-DUNLWeusHanLIf8e-XsOVGQtdR4kN66WM-bVcO1W9Nrkvl9tRhUVRog1Nn9t6G_1tBFICSGNu3LoD5RTZI8UT9dGQH7pQrLuevnULCZZLRWGgSzPr9ax9sAWMC9ecxRJt6_g9KsY-myLSAZ9ak2DVCRQA1VNOYpsBji-xWSmehSNb_ZflUQCly45YKi2A6v8U4wAdGUoJzvHznKTeyzCJ7ZMg','2026-06-23 02:18:35');
/*!40000 ALTER TABLE `auth_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipamentos`
--

DROP TABLE IF EXISTS `equipamentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipamentos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `marca` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `modelo` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `setor` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `estado` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipamentos`
--

LOCK TABLES `equipamentos` WRITE;
/*!40000 ALTER TABLE `equipamentos` DISABLE KEYS */;
INSERT INTO `equipamentos` VALUES (1,'Notebook','Dell','Inspiron','TI','Bom'),(2,'Impressora','HP','LaserJet','Financeiro','Manutenção'),(3,'Projetor','Epson','X39','Sala de Aula','Bom'),(4,'Servidor Rack','Dell','PowerEdge R750','TI','Bom'),(5,'Ar Condicionado Split','Samsung','WindFree 12000 BTU','Administrativo','Bom'),(6,'Roteador Wireless','Cisco','ISR 1100','TI','Bom'),(7,'Câmera IP Dome','Intelbras','VIP 1130 D','Administrativo','Bom'),(8,'Monitor 24\"','LG','24MK430H','TI','Bom'),(9,'Nobreak 1500VA','APC','Back-UPS','TI','Bom'),(10,'Telefone IP','Intelbras','TIP 125 Lite','Financeiro','Bom'),(11,'Smart TV 55\" 4K','TCL','55P635','Sala de Aula','Bom'),(12,'Scanner de Mesa','Fujitsu','ScanSnap iX1600','Financeiro','Manutenção');
/*!40000 ALTER TABLE `equipamentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios_autorizados`
--

DROP TABLE IF EXISTS `usuarios_autorizados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios_autorizados` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `perfil` varchar(30) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'usuario',
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios_autorizados`
--

LOCK TABLES `usuarios_autorizados` WRITE;
/*!40000 ALTER TABLE `usuarios_autorizados` DISABLE KEYS */;
INSERT INTO `usuarios_autorizados` VALUES (1,'João Vitor','joaovitor00220@gmail.com','admin',1,'2026-06-23 01:55:07');
/*!40000 ALTER TABLE `usuarios_autorizados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'dsw_equipamentos'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-22 22:20:06

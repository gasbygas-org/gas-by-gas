-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jan 30, 2025 at 08:44 AM
-- Server version: 8.3.0
-- PHP Version: 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gasbygas`
--

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `audit_log_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `action` varchar(255) NOT NULL,
  `table_affected` varchar(255) NOT NULL,
  `record_id` int NOT NULL,
  `old_values` json DEFAULT NULL,
  `new_values` json DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`audit_log_id`),
  KEY `fk_audit_logs_users1_idx` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `audit_logs`
--

INSERT INTO `audit_logs` (`audit_log_id`, `user_id`, `action`, `table_affected`, `record_id`, `old_values`, `new_values`, `timestamp`) VALUES
(1, 1, 'INSERT', 'outlets', 4, NULL, '{\"phone\": \"0112345678\", \"address\": \"New Address\", \"district\": \"New District\", \"manager_id\": 2, \"outlet_name\": \"New Outlet\"}', '2025-01-29 18:26:30'),
(2, 2, 'UPDATE', 'deliveries', 1, '{\"status\": \"Scheduled\"}', '{\"status\": \"In Transit\"}', '2025-01-29 18:26:30');

-- --------------------------------------------------------

--
-- Table structure for table `deliveries`
--

DROP TABLE IF EXISTS `deliveries`;
CREATE TABLE IF NOT EXISTS `deliveries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `outlet_id` int NOT NULL,
  `delivery_date` date NOT NULL,
  `status` enum('Scheduled','In Transit','Delivered','Cancelled') NOT NULL,
  `outlet_request_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_deliveries_outlets1_idx` (`outlet_id`),
  KEY `outlet_request_id` (`outlet_request_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `deliveries`
--

INSERT INTO `deliveries` (`id`, `outlet_id`, `delivery_date`, `status`, `outlet_request_id`, `created_at`, `updated_at`) VALUES
(1, 1, '2025-02-10', 'Scheduled', 1, '2025-01-29 18:26:07', '2025-01-29 18:26:07'),
(2, 2, '2025-02-05', 'Delivered', 2, '2025-01-29 18:26:07', '2025-01-29 18:26:07'),
(3, 3, '2025-01-30', 'Delivered', 3, '2025-01-29 18:26:07', '2025-01-29 18:26:07');

-- --------------------------------------------------------

--
-- Table structure for table `delivery_details`
--

DROP TABLE IF EXISTS `delivery_details`;
CREATE TABLE IF NOT EXISTS `delivery_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `delivery_id` int NOT NULL,
  `gas_type_id` int NOT NULL,
  `quantity` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_delivery_details_deliveries1_idx` (`delivery_id`),
  KEY `fk_delivery_details_gas_types1_idx` (`gas_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `delivery_details`
--

INSERT INTO `delivery_details` (`id`, `delivery_id`, `gas_type_id`, `quantity`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 20, '2025-01-29 18:26:15', '2025-01-29 18:26:15'),
(2, 1, 2, 10, '2025-01-29 18:26:15', '2025-01-29 18:26:15'),
(3, 2, 1, 15, '2025-01-29 18:26:15', '2025-01-29 18:26:15'),
(4, 2, 3, 5, '2025-01-29 18:26:15', '2025-01-29 18:26:15'),
(5, 3, 1, 25, '2025-01-29 18:26:15', '2025-01-29 18:26:15');

-- --------------------------------------------------------

--
-- Table structure for table `gas_types`
--

DROP TABLE IF EXISTS `gas_types`;
CREATE TABLE IF NOT EXISTS `gas_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `gas_type_name` varchar(255) NOT NULL,
  `gas_category` enum('Domestic','Commercial') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `gas_types`
--

INSERT INTO `gas_types` (`id`, `gas_type_name`, `gas_category`, `created_at`, `updated_at`) VALUES
(1, '12.5 kg Domestic', 'Domestic', '2025-01-29 18:24:51', '2025-01-29 18:24:51'),
(2, '5 kg Domestic', 'Domestic', '2025-01-29 18:24:51', '2025-01-29 18:24:51'),
(3, '37.5 kg Commercial', 'Commercial', '2025-01-29 18:24:51', '2025-01-29 18:24:51');

-- --------------------------------------------------------

--
-- Table structure for table `head_office`
--

DROP TABLE IF EXISTS `head_office`;
CREATE TABLE IF NOT EXISTS `head_office` (
  `id` int NOT NULL AUTO_INCREMENT,
  `address` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `head_office`
--

INSERT INTO `head_office` (`id`, `address`, `phone`, `email`, `created_at`, `updated_at`) VALUES
(1, '123 Main Street, Colombo', '0112555111', 'info@gasbygas.lk', '2025-01-29 18:24:37', '2025-01-29 18:24:37'),
(2, '45 Galle Road, Dehiwala', '0112666222', 'admin@gasbygas.lk', '2025-01-29 18:24:37', '2025-01-29 18:24:37');

-- --------------------------------------------------------

--
-- Table structure for table `head_office_stocks`
--

DROP TABLE IF EXISTS `head_office_stocks`;
CREATE TABLE IF NOT EXISTS `head_office_stocks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `head_office_id` int NOT NULL,
  `gas_type_id` int NOT NULL,
  `quantity` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `head_office_id` (`head_office_id`),
  KEY `gas_type_id` (`gas_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `head_office_stocks`
--

INSERT INTO `head_office_stocks` (`id`, `head_office_id`, `gas_type_id`, `quantity`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 500, '2025-01-29 18:25:20', '2025-01-29 18:25:20'),
(2, 1, 2, 300, '2025-01-29 18:25:20', '2025-01-29 18:25:20'),
(3, 1, 3, 150, '2025-01-29 18:25:20', '2025-01-29 18:25:20'),
(4, 2, 1, 400, '2025-01-29 18:25:20', '2025-01-29 18:25:20'),
(5, 2, 2, 200, '2025-01-29 18:25:20', '2025-01-29 18:25:20'),
(6, 2, 3, 100, '2025-01-29 18:25:20', '2025-01-29 18:25:20');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE IF NOT EXISTS `notifications` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `request_id` int DEFAULT NULL,
  `message` text NOT NULL,
  `notification_type` enum('SMS','Email','Push') NOT NULL,
  `status` enum('Sent','Delivered','Failed') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  KEY `fk_notifications_users1_idx` (`user_id`),
  KEY `fk_notifications_user_requests1_idx` (`request_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`notification_id`, `user_id`, `request_id`, `message`, `notification_type`, `status`, `created_at`) VALUES
(1, 1, 1, 'Your gas request has been scheduled for delivery on 2025-02-10', 'SMS', 'Sent', '2025-01-29 18:26:37'),
(2, 5, 2, 'Your gas request has been approved. Please pick it up between 2025-02-05 and 2025-02-19', 'Email', 'Sent', '2025-01-29 18:26:37'),
(3, 1, 3, 'Your gas request has been delivered on 2025-01-30', 'Push', 'Delivered', '2025-01-29 18:26:37');

-- --------------------------------------------------------

--
-- Table structure for table `organization_certifications`
--

DROP TABLE IF EXISTS `organization_certifications`;
CREATE TABLE IF NOT EXISTS `organization_certifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `certification_path` varchar(255) NOT NULL,
  `status` enum('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending',
  `status_updated_by` int DEFAULT NULL,
  `status_updated_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_organization_certifications_users1_idx` (`user_id`),
  KEY `fk_organization_certifications_users2` (`status_updated_by`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `organization_certifications`
--

INSERT INTO `organization_certifications` (`id`, `user_id`, `certification_path`, `status`, `status_updated_by`, `status_updated_at`, `created_at`, `updated_at`) VALUES
(5, 5, '/path/to/certification1.pdf', 'Pending', NULL, NULL, '2025-01-29 18:28:17', '2025-01-30 08:36:59');

-- --------------------------------------------------------

--
-- Table structure for table `outlets`
--

DROP TABLE IF EXISTS `outlets`;
CREATE TABLE IF NOT EXISTS `outlets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `outlet_name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `district` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `manager_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone_UNIQUE` (`phone`),
  KEY `fk_outlets_users1_idx` (`manager_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `outlets`
--

INSERT INTO `outlets` (`id`, `outlet_name`, `address`, `district`, `phone`, `manager_id`, `created_at`, `updated_at`) VALUES
(1, 'City Gas Outlet', '10 Station Road, Colombo', 'Colombo', '0112777333', 4, '2025-01-29 18:25:10', '2025-01-30 08:38:37'),
(2, 'Suburban Gas Shop', '25 High Street, Dehiwala', 'Colombo', '0112888444', 4, '2025-01-29 18:25:10', '2025-01-30 08:38:40'),
(3, 'Kandy Gas Depot', '5 Temple Road, Kandy', 'Kandy', '0812999555', 4, '2025-01-29 18:25:10', '2025-01-30 08:38:44');

-- --------------------------------------------------------

--
-- Table structure for table `outlet_requests`
--

DROP TABLE IF EXISTS `outlet_requests`;
CREATE TABLE IF NOT EXISTS `outlet_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `outlet_id` int NOT NULL,
  `request_status` enum('Pending','Approved','Rejected','Delivered','Cancelled') NOT NULL,
  `status_updated_by` int DEFAULT NULL,
  `status_updated_at` timestamp NULL DEFAULT NULL,
  `delivery_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_outlet_requests_outlets1_idx` (`outlet_id`),
  KEY `fk_outlet_requests_users1` (`status_updated_by`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `outlet_requests`
--

INSERT INTO `outlet_requests` (`id`, `outlet_id`, `request_status`, `status_updated_by`, `status_updated_at`, `delivery_date`, `created_at`, `updated_at`) VALUES
(1, 1, 'Pending', NULL, NULL, '2025-02-10', '2025-01-29 18:25:52', '2025-01-29 18:25:52'),
(2, 2, 'Approved', NULL, NULL, '2025-02-05', '2025-01-29 18:25:52', '2025-01-29 18:25:52'),
(3, 3, 'Delivered', NULL, NULL, '2025-01-30', '2025-01-29 18:25:52', '2025-01-29 18:25:52');

-- --------------------------------------------------------

--
-- Table structure for table `outlet_request_details`
--

DROP TABLE IF EXISTS `outlet_request_details`;
CREATE TABLE IF NOT EXISTS `outlet_request_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `outlet_request_id` int NOT NULL,
  `gas_type_id` int NOT NULL,
  `quantity` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_outlet_request_details_outlet_requests1_idx` (`outlet_request_id`),
  KEY `fk_outlet_request_details_gas_types1_idx` (`gas_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `outlet_request_details`
--

INSERT INTO `outlet_request_details` (`id`, `outlet_request_id`, `gas_type_id`, `quantity`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 20, '2025-01-29 18:26:00', '2025-01-29 18:26:00'),
(2, 1, 2, 10, '2025-01-29 18:26:00', '2025-01-29 18:26:00'),
(3, 2, 1, 15, '2025-01-29 18:26:00', '2025-01-29 18:26:00'),
(4, 2, 3, 5, '2025-01-29 18:26:00', '2025-01-29 18:26:00'),
(5, 3, 1, 25, '2025-01-29 18:26:00', '2025-01-29 18:26:00');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `role_name`, `created_at`, `updated_at`) VALUES
(1, 'user', '2025-01-25 19:00:25', '2025-01-25 19:00:25'),
(2, 'admin', '2025-01-25 19:00:25', '2025-01-25 19:00:25'),
(3, 'dispatch_admin', '2025-01-29 17:11:19', '2025-01-29 17:11:19'),
(4, 'outlet_manager', '2025-01-29 17:11:19', '2025-01-29 17:11:19'),
(5, 'business', '2025-01-29 17:11:34', '2025-01-29 17:11:34');

-- --------------------------------------------------------

--
-- Table structure for table `stocks`
--

DROP TABLE IF EXISTS `stocks`;
CREATE TABLE IF NOT EXISTS `stocks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `outlet_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_stocks_outlets1_idx` (`outlet_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `stocks`
--

INSERT INTO `stocks` (`id`, `outlet_id`, `created_at`, `updated_at`) VALUES
(1, 1, '2025-01-29 18:25:29', '2025-01-29 18:25:29'),
(2, 2, '2025-01-29 18:25:29', '2025-01-29 18:25:29'),
(3, 3, '2025-01-29 18:25:29', '2025-01-29 18:25:29');

-- --------------------------------------------------------

--
-- Table structure for table `stock_details`
--

DROP TABLE IF EXISTS `stock_details`;
CREATE TABLE IF NOT EXISTS `stock_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `stock_id` int NOT NULL,
  `gas_type_id` int NOT NULL,
  `quantity` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_stock_details_stocks1_idx` (`stock_id`),
  KEY `fk_stock_details_gas_types1_idx` (`gas_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `stock_details`
--

INSERT INTO `stock_details` (`id`, `stock_id`, `gas_type_id`, `quantity`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 50, '2025-01-29 18:25:45', '2025-01-29 18:25:45'),
(2, 1, 2, 30, '2025-01-29 18:25:45', '2025-01-29 18:25:45'),
(3, 1, 3, 20, '2025-01-29 18:25:45', '2025-01-29 18:25:45'),
(4, 2, 1, 40, '2025-01-29 18:25:45', '2025-01-29 18:25:45'),
(5, 2, 2, 25, '2025-01-29 18:25:45', '2025-01-29 18:25:45'),
(6, 3, 1, 60, '2025-01-29 18:25:45', '2025-01-29 18:25:45'),
(7, 3, 2, 35, '2025-01-29 18:25:45', '2025-01-29 18:25:45');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_id` int NOT NULL,
  `nic` varchar(12) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `is_verified` tinyint DEFAULT '0',
  `uId` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nic_UNIQUE` (`nic`),
  UNIQUE KEY `phone_UNIQUE` (`phone`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  KEY `fk_users_roles1_idx` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `role_id`, `nic`, `name`, `phone`, `email`, `password`, `address`, `is_verified`, `uId`, `created_at`, `updated_at`) VALUES
(1, 1, '123451001V', 'GBG User', '1234561001', 'althaf.1035+gbg.user@gmail.com', '11111111', 'address', 0, 'JRhjLOO741eRqDlNSPcgylq45nP2', '2025-01-30 08:28:56', '2025-01-30 08:28:56'),
(2, 2, '123451002V', 'GBG Admin', '1234561002', 'althaf.1035+gbg.admin@gmail.com', '11111111', 'address', 0, 'yiAfz31GYsOjWLTpnWjMSKWcgsm1', '2025-01-30 08:29:47', '2025-01-30 08:29:47'),
(3, 3, '123451003V', 'GBG Dispatch Admin', '1234561003', 'althaf.1035+gbg.dispatch_admin@gmail.com', '11111111', 'address', 0, 'ebSWyb7LeUgzXRSWjEno8jvBP7d2', '2025-01-30 08:33:12', '2025-01-30 08:33:12'),
(4, 4, '123451004V', 'GBG Outlet Manager', '1234561004', 'althaf.1035+gbg.outlet_manager@gmail.com', '11111111', 'address', 0, 'Ci0bOJSh7hQ5z1MKeARbn3oYQR93', '2025-01-30 08:34:03', '2025-01-30 08:34:03'),
(5, 5, '123451005V', 'GBG Business', '1234561005', 'althaf.1035+gbg.business@gmail.com', '11111111', 'address', 0, 'p3PBkaD3QnRdsX21OC8yJynVtFV2', '2025-01-30 08:34:40', '2025-01-30 08:34:40');

-- --------------------------------------------------------

--
-- Table structure for table `user_requests`
--

DROP TABLE IF EXISTS `user_requests`;
CREATE TABLE IF NOT EXISTS `user_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `outlet_id` int NOT NULL,
  `gas_type_id` int NOT NULL,
  `quantity` int NOT NULL,
  `request_status` enum('Pending','Approved','Rejected','Delivered','Cancelled') NOT NULL,
  `token` varchar(255) NOT NULL,
  `delivery_date` date DEFAULT NULL,
  `pickup_period_start` date DEFAULT NULL,
  `pickup_period_end` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token_UNIQUE` (`token`),
  KEY `fk_user_requests_users1_idx` (`user_id`),
  KEY `fk_user_requests_outlets1_idx` (`outlet_id`),
  KEY `fk_user_requests_gas_types1_idx` (`gas_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `user_requests`
--

INSERT INTO `user_requests` (`id`, `user_id`, `outlet_id`, `gas_type_id`, `quantity`, `request_status`, `token`, `delivery_date`, `pickup_period_start`, `pickup_period_end`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, 1, 'Pending', 'TOKEN123', '2025-02-10', '2025-02-10', '2025-02-24', '2025-01-29 18:26:24', '2025-01-30 08:43:56'),
(2, 1, 2, 2, 2, 'Approved', 'TOKEN456', '2025-02-05', '2025-02-05', '2025-02-19', '2025-01-29 18:26:24', '2025-01-30 08:44:01'),
(3, 5, 3, 3, 1, 'Delivered', 'TOKEN789', '2025-01-30', '2025-01-30', '2025-02-13', '2025-01-29 18:26:24', '2025-01-30 08:43:43');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `fk_audit_logs_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `deliveries`
--
ALTER TABLE `deliveries`
  ADD CONSTRAINT `deliveries_ibfk_1` FOREIGN KEY (`outlet_request_id`) REFERENCES `outlet_requests` (`id`),
  ADD CONSTRAINT `fk_deliveries_outlets1` FOREIGN KEY (`outlet_id`) REFERENCES `outlets` (`id`);

--
-- Constraints for table `delivery_details`
--
ALTER TABLE `delivery_details`
  ADD CONSTRAINT `fk_delivery_details_deliveries1` FOREIGN KEY (`delivery_id`) REFERENCES `deliveries` (`id`),
  ADD CONSTRAINT `fk_delivery_details_gas_types1` FOREIGN KEY (`gas_type_id`) REFERENCES `gas_types` (`id`);

--
-- Constraints for table `head_office_stocks`
--
ALTER TABLE `head_office_stocks`
  ADD CONSTRAINT `head_office_stocks_ibfk_1` FOREIGN KEY (`head_office_id`) REFERENCES `head_office` (`id`),
  ADD CONSTRAINT `head_office_stocks_ibfk_2` FOREIGN KEY (`gas_type_id`) REFERENCES `gas_types` (`id`);

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `fk_notifications_user_requests1` FOREIGN KEY (`request_id`) REFERENCES `user_requests` (`id`),
  ADD CONSTRAINT `fk_notifications_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `organization_certifications`
--
ALTER TABLE `organization_certifications`
  ADD CONSTRAINT `fk_organization_certifications_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `fk_organization_certifications_users2` FOREIGN KEY (`status_updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `outlets`
--
ALTER TABLE `outlets`
  ADD CONSTRAINT `fk_outlets_users1` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `outlet_requests`
--
ALTER TABLE `outlet_requests`
  ADD CONSTRAINT `fk_outlet_requests_outlets1` FOREIGN KEY (`outlet_id`) REFERENCES `outlets` (`id`),
  ADD CONSTRAINT `fk_outlet_requests_users1` FOREIGN KEY (`status_updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `outlet_request_details`
--
ALTER TABLE `outlet_request_details`
  ADD CONSTRAINT `fk_outlet_request_details_gas_types1` FOREIGN KEY (`gas_type_id`) REFERENCES `gas_types` (`id`),
  ADD CONSTRAINT `fk_outlet_request_details_outlet_requests1` FOREIGN KEY (`outlet_request_id`) REFERENCES `outlet_requests` (`id`);

--
-- Constraints for table `stocks`
--
ALTER TABLE `stocks`
  ADD CONSTRAINT `fk_stocks_outlets1` FOREIGN KEY (`outlet_id`) REFERENCES `outlets` (`id`);

--
-- Constraints for table `stock_details`
--
ALTER TABLE `stock_details`
  ADD CONSTRAINT `fk_stock_details_gas_types1` FOREIGN KEY (`gas_type_id`) REFERENCES `gas_types` (`id`),
  ADD CONSTRAINT `fk_stock_details_stocks1` FOREIGN KEY (`stock_id`) REFERENCES `stocks` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_roles1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

--
-- Constraints for table `user_requests`
--
ALTER TABLE `user_requests`
  ADD CONSTRAINT `fk_user_requests_gas_types1` FOREIGN KEY (`gas_type_id`) REFERENCES `gas_types` (`id`),
  ADD CONSTRAINT `fk_user_requests_outlets1` FOREIGN KEY (`outlet_id`) REFERENCES `outlets` (`id`),
  ADD CONSTRAINT `fk_user_requests_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

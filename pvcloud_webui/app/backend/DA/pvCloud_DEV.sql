-- phpMyAdmin SQL Dump
-- version 4.1.12
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jul 04, 2015 at 12:45 AM
-- Server version: 5.6.16
-- PHP Version: 5.5.11

SET time_zone = "+00:00";

--
-- Database: `pvcloud`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
CREATE TABLE IF NOT EXISTS `accounts` (
  `account_id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(200) COLLATE utf8_bin NOT NULL,
  `nickname` varchar(50) COLLATE utf8_bin NOT NULL,
  `pwd_hash` varchar(256) COLLATE utf8_bin NOT NULL,
  `confirmed` tinyint(1) NOT NULL DEFAULT '0',
  `confirmation_guid` varchar(250) COLLATE utf8_bin DEFAULT NULL,
  `created_datetime` datetime NOT NULL,
  `modified_datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_datetime` datetime DEFAULT NULL,
  PRIMARY KEY (`account_id`),
  UNIQUE KEY `account_id` (`account_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='PV Cloud User Accounts' AUTO_INCREMENT=2 ;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`account_id`, `email`, `nickname`, `pwd_hash`, `confirmed`, `confirmation_guid`, `created_datetime`, `modified_datetime`, `deleted_datetime`) VALUES
(1, 'jose.a.nunez@gmail.com', '', '7110eda4d09e062aa5e4a390b0a572ac0d2c0220', 1, '5477970556927', '2014-11-27 15:26:29', '2015-03-25 04:56:43', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `accounts_association`
--

DROP TABLE IF EXISTS `accounts_association`;
CREATE TABLE IF NOT EXISTS `accounts_association` (
  `account_id_host` int(11) NOT NULL,
  `account_id_guest` int(11) NOT NULL,
  `requested_date` datetime NOT NULL,
  `accepted_date` datetime DEFAULT NULL,
  `rejected_date` datetime DEFAULT NULL,
  PRIMARY KEY (`account_id_host`,`account_id_guest`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `accounts_network`
--

DROP TABLE IF EXISTS `accounts_network`;
CREATE TABLE IF NOT EXISTS `accounts_network` (
  `account_network_id` int(11) NOT NULL AUTO_INCREMENT,
  `requester_account_id` int(11) NOT NULL COMMENT 'Account ID of the requester for friendship',
  `requested_account_id` int(11) NOT NULL COMMENT 'Account ID being requested to establish friendship',
  `accepted` tinyint(1) NOT NULL COMMENT 'TRUE if requested account holder accepts the friendship',
  `created_datetime` datetime NOT NULL COMMENT 'day and time created',
  `modified_datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'day and time last modified',
  `deleted_datetime` datetime DEFAULT NULL COMMENT 'day deleted',
  PRIMARY KEY (`account_network_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Network of associated accounts' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `app_registry`
--

DROP TABLE IF EXISTS `app_registry`;
CREATE TABLE IF NOT EXISTS `app_registry` (
  `app_id` int(11) NOT NULL AUTO_INCREMENT,
  `account_id` int(11) NOT NULL,
  `app_nickname` varchar(50) COLLATE utf8_bin NOT NULL,
  `app_description` varchar(1000) COLLATE utf8_bin NOT NULL,
  `api_key` varchar(200) COLLATE utf8_bin NOT NULL,
  `visibility_type_id` int(11) NOT NULL DEFAULT '1',
  `created_datetime` datetime NOT NULL,
  `modified_datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_datetime` datetime DEFAULT NULL,
  `last_connected_datetime` datetime DEFAULT NULL,
  PRIMARY KEY (`app_id`),
  KEY `app_nickname` (`app_nickname`),
  KEY `account_id` (`account_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=18 ;

--
-- Dumping data for table `app_registry`
--

INSERT INTO `app_registry` (`app_id`, `account_id`, `app_nickname`, `app_description`, `api_key`, `visibility_type_id`, `created_datetime`, `modified_datetime`, `deleted_datetime`, `last_connected_datetime`) VALUES
(1, 1, 'HOME SMART SECURITY', 'Cloud based security system for homes.', '09b508f1bdc25b6ec65af3f9b9d1eb357b87776d', 1, '2014-12-06 16:04:21', '2015-03-25 23:19:50', NULL, NULL),
(2, 1, 'SMART HOME DOMOTICS', 'SYSTEM TO CONTROL ACTUATORS AT HOME BASED ON CLOUD COMMANDS', 'f51c3ef0344384032c0ea2dd8be208542908497f', 2, '2014-12-16 23:56:35', '2015-03-25 23:25:47', NULL, NULL),
(3, 1, 'WATER DISPOSAL SYSTEM', 'Distribuidor de aguas jabonosas', 'b56c61555653deccc4d3d1fbadd8ae0837da9abd', 2, '2014-12-16 23:58:46', '2015-03-25 23:07:58', NULL, NULL),
(4, 1, 'test2', '2', '39a63dc622a6df57daaf6ac1ffcfd5a0c627ac6a', 1, '2015-03-25 16:36:19', '2015-03-25 22:49:22', '2015-03-25 16:49:22', NULL),
(5, 1, 'TEST2', '2', '99945a7551f228bed5aad74b916ad130c1a3b274', 1, '2015-03-25 16:37:54', '2015-03-25 22:49:02', '2015-03-25 16:49:02', NULL),
(6, 1, 'TEST3', '2', '64c463ecc53f4aada93be68f6de4fb96a3ee0acd', 0, '2015-03-25 16:39:52', '2015-03-25 22:47:06', '2015-03-25 16:47:06', NULL),
(7, 1, 'TEST3', '2', '8c093f565781aecd89dc37659202a2959d261d10', 0, '2015-03-25 16:40:23', '2015-03-25 22:48:19', '2015-03-25 16:48:19', NULL),
(8, 1, 'TEST3', '2', 'df100ad07bee4c8ced28d86b2b157376cea140ba', 0, '2015-03-25 16:41:00', '2015-03-25 22:47:35', '2015-03-25 16:47:35', NULL),
(9, 1, 'TEST3', 'TEST3D', '1ff73344d60297700b45b8368c927395ffedebec', 2, '2015-03-25 16:42:21', '2015-03-25 22:47:30', '2015-03-25 16:47:30', NULL),
(10, 1, 'test4', 'TEST4D', '0fb13c9776ebe3c6f28c87b342578ac9c6677cf0', 3, '2015-03-25 16:42:46', '2015-03-25 22:47:20', '2015-03-25 16:47:20', NULL),
(11, 1, 'BUS TRACKER', 'GPS BASED SYSTEM TO TRACK PUBLIC TRANSPORTATION ROUTE COMPLIANCE FOR GOVERNMENT', '14a9832eb5454c75f96ca726b1cc4314ebcc8bca', 3, '2015-03-25 16:49:59', '2015-03-25 23:22:12', NULL, NULL),
(12, 1, 'BLINK', 'just a blink', '2fdae3d43f23ba1b684a3a6cb5e40634cd6fbe8e', 2, '2015-03-25 17:07:27', '2015-03-25 23:39:31', NULL, NULL),
(13, 1, 'DISTRESS VEST', 'GPS WEARABLE', 'd1fdb84d3775c87b4437765b0cceb5db0b05c2b6', 3, '2015-03-25 17:23:46', '2015-03-27 00:10:16', NULL, NULL),
(14, 1, 'test', 'test', '6f463b67437fa20079cb61b278a7430d789735cd', 1, '2015-03-25 17:27:46', '2015-03-25 23:28:57', '2015-03-25 17:28:57', NULL),
(15, 1, 'retewart', 'tasfdsafdsa', 'e9f910fcbf9ccfa1ab1fb3199d166d372f818255', 1, '2015-03-25 17:28:09', '2015-03-25 23:29:06', '2015-03-25 17:29:06', NULL),
(16, 1, 'test', 'fdwfdsafdsa', '0d7d4b2bf23626ea80f537b846d7f72172775942', 1, '2015-03-25 17:28:44', '2015-03-25 23:29:01', '2015-03-25 17:29:01', NULL),
(17, 1, 'DHT 11 Experiment', 'In this app I plan to connect a DHT11 sensor to an Edison or Galileo and send the data over the cloud to display in a pvCloud Page', 'b10d47a9430c767d7cf962516a31210c373b6989', 2, '2015-03-25 20:22:54', '2015-03-26 02:22:54', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `app_visibility_type`
--

DROP TABLE IF EXISTS `app_visibility_type`;
CREATE TABLE IF NOT EXISTS `app_visibility_type` (
  `visibility_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `visibility_type_name` varchar(20) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`visibility_type_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Types of Visibility' AUTO_INCREMENT=4 ;

--
-- Dumping data for table `app_visibility_type`
--

INSERT INTO `app_visibility_type` (`visibility_type_id`, `visibility_type_name`) VALUES
(1, 'Privado'),
(2, 'Compartido'),
(3, 'Público');

-- --------------------------------------------------------

--
-- Table structure for table `invitations`
--

DROP TABLE IF EXISTS `invitations`;
CREATE TABLE IF NOT EXISTS `invitations` (
  `invitation_id` int(11) NOT NULL AUTO_INCREMENT,
  `host_email` varchar(200) COLLATE utf8_bin NOT NULL,
  `guest_email` varchar(200) COLLATE utf8_bin NOT NULL,
  `created_datetime` datetime NOT NULL,
  `expired_datetime` datetime DEFAULT NULL,
  `token` varchar(200) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`invitation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `pages`
--

DROP TABLE IF EXISTS `pages`;
CREATE TABLE IF NOT EXISTS `pages` (
  `page_id` int(11) NOT NULL AUTO_INCREMENT,
  `app_id` int(11) NOT NULL,
  `title` varchar(100) COLLATE utf8_bin NOT NULL,
  `description` varchar(1000) COLLATE utf8_bin NOT NULL,
  `visibility_type_id` int(11) NOT NULL,
  `created_datetime` datetime NOT NULL,
  `modified_datetime` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_datetime` datetime DEFAULT NULL,
  PRIMARY KEY (`page_id`),
  KEY `app_id` (`app_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=27 ;

--
-- Dumping data for table `pages`
--

INSERT INTO `pages` (`page_id`, `app_id`, `title`, `description`, `visibility_type_id`, `created_datetime`, `modified_datetime`, `deleted_datetime`) VALUES
(1, 17, 'DHT11 Dashboard', 'Dashboard to display latest DH11 H and T readings.', 3, '2015-03-25 20:20:33', '2015-04-17 02:58:12', NULL),
(2, 17, 'DHT11 PROJECT CONFIG TOOL', 'PÃ¡gina para configurar el sistema..', 1, '2015-03-25 20:23:44', '2015-03-28 02:16:54', NULL),
(3, 0, 'NewTitle', 'newDescription', 3, '2015-03-27 21:18:13', '2015-03-28 03:18:13', NULL),
(4, 0, 'NewTitle', 'newDescription', 3, '2015-03-27 21:18:25', '2015-03-28 03:18:25', NULL),
(5, 0, 'NewTitle', 'newDescription', 3, '2015-03-27 21:18:48', '2015-03-28 03:18:48', NULL),
(6, 0, 'NewTitle', 'newDescription', 3, '2015-03-27 21:19:24', '2015-03-28 03:19:24', NULL),
(7, 0, 'NewTitle', 'newDescription', 3, '2015-03-27 21:19:51', '2015-03-28 03:19:51', NULL),
(8, 0, 'NewTitle', 'newDescription', 3, '2015-03-27 21:20:12', '2015-03-28 03:20:12', NULL),
(9, 0, 'NewTitle', 'newDescription', 3, '2015-03-27 21:21:15', '2015-03-28 03:21:15', NULL),
(10, 0, 'NewTitle', 'newDescription', 3, '2015-03-27 21:21:20', '2015-03-28 03:21:20', NULL),
(11, 0, 'NewTitle', 'newDescription', 3, '2015-03-27 21:21:20', '2015-03-28 03:21:20', NULL),
(12, 0, 'NewTitle', 'newDescription', 3, '2015-03-27 21:21:20', '2015-03-28 03:21:20', NULL),
(13, 0, 'NewTitle', 'newDescription', 3, '2015-03-27 21:21:20', '2015-03-28 03:21:20', NULL),
(14, 0, 'NewTitle', 'newDescription', 3, '2015-03-27 21:21:20', '2015-03-28 03:21:20', NULL),
(15, 0, 'NewTitle', 'newDescription', 3, '2015-03-27 21:21:21', '2015-03-28 03:21:21', NULL),
(16, 17, 'MAIN PAGE', 'Latest Temperature and Humidity values read by the DHT11', 3, '2015-03-27 21:22:30', '2015-04-08 19:27:49', NULL),
(17, 17, 'NewTitle', 'newDescription', 3, '2015-03-27 21:22:32', '2015-03-28 05:53:12', '2015-03-27 23:53:12'),
(18, 17, 'NewTitle', 'newDescription', 3, '2015-03-27 21:22:33', '2015-03-28 05:53:07', '2015-03-27 23:53:07'),
(19, 17, 'NewTitle', 'newDescription', 3, '2015-03-27 21:22:33', '2015-03-28 05:53:01', '2015-03-27 23:53:01'),
(20, 17, 'NewTitle', 'newDescription', 3, '2015-03-27 21:22:33', '2015-03-28 05:52:57', '2015-03-27 23:52:57'),
(21, 17, 'NewTitle', 'newDescription', 3, '2015-03-27 21:22:33', '2015-03-28 05:50:02', '2015-03-27 23:50:02'),
(22, 17, 'NewTitle', 'newDescription', 3, '2015-03-27 21:22:33', '2015-03-28 05:49:57', '2015-03-27 23:49:57'),
(23, 17, 'PRUEBA DE DOMINGO', 'Es solo una prueba', 1, '2015-03-27 22:12:08', '2015-03-28 05:49:50', '2015-03-27 23:49:50'),
(24, 17, 'PRUEBA DE DOMINGO', 'Es solo una prueba', 1, '2015-03-27 22:12:16', '2015-03-28 05:43:21', '2015-03-27 23:43:21'),
(25, 17, 'PRUEBA DE DOMINGO', 'Es solo una prueba', 1, '2015-03-27 22:13:00', '2015-03-28 05:49:42', '2015-03-27 23:49:42'),
(26, 1, 'POWER METER DASHBOARD', 'tetdsagdsatgfea', 1, '2015-06-16 16:39:36', '2015-06-16 22:39:36', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` int(11) NOT NULL AUTO_INCREMENT,
  `account_id` int(11) NOT NULL,
  `token` varchar(200) COLLATE utf8_bin NOT NULL,
  `expiration_datetime` datetime NOT NULL,
  `created_datetime` datetime NOT NULL,
  `modified_datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`session_id`),
  UNIQUE KEY `token` (`token`),
  KEY `account_id` (`account_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Client Sessions' AUTO_INCREMENT=139 ;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`session_id`, `account_id`, `token`, `expiration_datetime`, `created_datetime`, `modified_datetime`) VALUES
(14, 1, '99aa3867e0d35758252f456b80d89c2b1bce167c', '2014-12-17 01:00:58', '2014-12-16 23:54:05', '2014-12-17 06:00:58'),
(15, 1, '021817a0fd8425d50b234ab26997654984e16a46', '2015-03-17 18:45:58', '2015-03-17 17:28:45', '2015-03-17 23:45:58'),
(16, 1, 'dd685f52e028a187d26f138364160985011f032a', '2015-03-17 22:17:09', '2015-03-17 21:06:30', '2015-03-18 03:17:09'),
(17, 1, '81d995c44a398e960bf249c410ed1798ec015866', '2015-03-18 10:57:40', '2015-03-18 09:14:04', '2015-03-18 15:57:40'),
(18, 1, '03ce3c0d6049fb810227f7ec2a7aa2237c93e5ff', '2015-03-18 18:19:40', '2015-03-18 17:19:39', '2015-03-18 23:19:40'),
(19, 1, 'fe5a9db0edc3f54ede8eae0a460b66f87b1b7265', '2015-03-19 15:37:42', '2015-03-19 15:26:49', '2015-03-19 21:37:42'),
(20, 1, 'bb7b45c2ad95f601127e5d0e2700a5ab9850fc34', '2015-03-19 15:42:56', '2015-03-19 15:38:04', '2015-03-19 21:42:56'),
(21, 1, '90129a2051bebf0080fed2b8a65da92e9bea6889', '2015-03-19 16:43:12', '2015-03-19 15:43:11', '2015-03-19 21:43:12'),
(22, 1, '751527dbbf40c7dd278188c7afb637d9339fa46b', '2015-03-24 22:12:49', '2015-03-24 20:05:28', '2015-03-25 04:12:49'),
(23, 1, 'd0cb096bbb696e07e1fbcfe8994d1c28d0acc7f2', '2015-03-24 22:56:30', '2015-03-24 22:12:54', '2015-03-25 04:56:30'),
(24, 1, 'c5d97e0bb7a7af326fd37f2240fc8f24352e6c68', '2015-03-24 22:56:47', '2015-03-24 22:56:32', '2015-03-25 04:56:47'),
(25, 1, '694c41343aed1bcaacf66fed8ec1d53a88beb1d1', '2015-03-24 23:59:28', '2015-03-24 22:56:51', '2015-03-25 04:59:28'),
(26, 1, 'e7906786db97f23a94cda01e7323cbb5c4ac8fa0', '2015-03-25 00:04:28', '2015-03-24 23:03:21', '2015-03-25 05:04:28'),
(27, 1, '3ae5cb7d56bfd6d75ff4afdd7c31f1b5e1d34fce', '2015-03-25 09:31:39', '2015-03-25 09:05:06', '2015-03-25 15:31:39'),
(28, 1, '08ab5e63fbe841f6c7207612ec7e2078f9e2b42f', '2015-03-25 10:03:55', '2015-03-25 09:31:46', '2015-03-25 16:03:55'),
(29, 1, '2567e776877204a01767ada10a7b2f5f31c49292', '2015-03-25 11:47:51', '2015-03-25 10:19:13', '2015-03-25 16:47:51'),
(30, 1, '387743dfdd2c327ee485aa06364567b22ad95d48', '2015-03-25 15:04:36', '2015-03-25 11:41:39', '2015-03-25 20:04:36'),
(31, 1, '8257b9eecfb2622e2cb624c1a4204dd1d4739b4b', '2015-03-25 14:26:50', '2015-03-25 12:33:55', '2015-03-25 19:26:50'),
(32, 1, '43712b3917ada1d746c8dc35c14a48df408b67a3', '2015-03-25 19:15:55', '2015-03-25 15:26:48', '2015-03-26 00:15:55'),
(33, 1, 'b627107c69ad488597ca21975a2b01b8c91eabed', '2015-03-25 18:11:28', '2015-03-25 16:57:42', '2015-03-25 23:11:28'),
(34, 1, '042dab5bcdb15b38da479ed4e23075d5a0bffe1c', '2015-03-25 19:24:13', '2015-03-25 18:18:09', '2015-03-26 00:24:13'),
(35, 1, 'd9becdae3e4d5b5c69c2fa342f4d12270fe20e49', '2015-03-25 21:23:03', '2015-03-25 20:21:47', '2015-03-26 02:23:03'),
(36, 1, '2a94cec555a36ffd99fd662c9d4bc1ca74172641', '2015-03-25 22:39:03', '2015-03-25 21:25:20', '2015-03-26 03:39:03'),
(37, 1, 'f0c585f783b71a7de841e020f015083e96251ca6', '2015-03-25 22:06:51', '2015-03-25 21:42:15', '2015-03-26 04:06:51'),
(38, 1, '0671318230faea2c1c1ac2fbe17059d16acb1df2', '2015-03-25 23:32:31', '2015-03-25 22:07:34', '2015-03-26 04:32:31'),
(39, 1, '46d41523d0c66088b813757861cfd92d132e7aed', '2015-03-26 11:00:02', '2015-03-26 09:19:57', '2015-03-26 16:00:02'),
(40, 1, 'e9066e614f28609816d2501aa4acd7b63892be04', '2015-03-26 12:06:04', '2015-03-26 10:15:59', '2015-03-26 17:06:04'),
(41, 1, '415ddc3e240f677c5a4b5b443ccffe11d0ff1d33', '2015-03-26 12:18:29', '2015-03-26 11:06:29', '2015-03-26 17:18:29'),
(42, 1, '224b930f9768058e44a20ff0398e4977c0be3955', '2015-03-26 16:33:39', '2015-03-26 15:21:32', '2015-03-26 21:33:39'),
(43, 1, 'f40d375b097ab7254eff566d72adcc2cff1ba913', '2015-03-26 20:54:20', '2015-03-26 17:49:18', '2015-03-27 01:54:20'),
(44, 1, '4af8d9496f9d19989b3bcdd38cef96ffaf7d4759', '2015-03-26 22:56:21', '2015-03-26 21:05:12', '2015-03-27 03:56:21'),
(45, 1, '77d0a0bd72746070c226a9464ee8f70670f80ce3', '2015-03-26 22:56:20', '2015-03-26 21:23:26', '2015-03-27 03:56:20'),
(46, 1, '84ac45d771591453f4e925587281dfd642ae545f', '2015-03-27 23:08:31', '2015-03-27 20:16:30', '2015-03-28 04:08:31'),
(47, 1, 'f85038f5a760fb74f50ba233aed7b5fe4c439f44', '2015-03-28 01:21:55', '2015-03-27 22:11:42', '2015-03-28 06:21:55'),
(48, 1, 'b26c052fd05a1a764f6803607a470e5397003fc2', '2015-03-28 01:15:12', '2015-03-27 23:12:29', '2015-03-28 06:15:12'),
(49, 1, '3dc1f978768fc3f6b860bd33ab0b830bc736c740', '2015-04-08 14:28:44', '2015-04-08 12:33:02', '2015-04-08 19:28:44'),
(50, 1, 'd571c0860ceb284547556798c14b3593079e5f7d', '2015-04-09 16:33:10', '2015-04-09 16:31:28', '2015-04-09 22:33:10'),
(51, 1, '95c0d254f5229915a3012e53e374ec0512367d31', '2015-04-09 17:58:00', '2015-04-09 16:33:14', '2015-04-09 22:58:00'),
(52, 1, 'bf6b475c3a18cb9c158fcfaabc2bb6cf1f23784a', '2015-04-09 17:58:04', '2015-04-09 16:36:55', '2015-04-09 22:58:04'),
(53, 1, 'b3a431a32a06bfd7b9f9ddf077800d0493ef49f8', '2015-04-09 20:09:21', '2015-04-09 19:09:06', '2015-04-10 01:09:21'),
(54, 1, 'ef7d8ecf8a3a3fc5726b8be0758f54a8d1101a0d', '2015-04-15 17:03:19', '2015-04-15 15:59:46', '2015-04-15 22:03:19'),
(55, 1, 'db2cf259775d0725018af10ab17bc53110d77444', '2015-04-16 14:08:04', '2015-04-16 13:01:59', '2015-04-16 19:08:04'),
(56, 1, '6f70072c02cb08207a3c055cc942a933ed798dc4', '2015-04-16 21:58:58', '2015-04-16 18:29:22', '2015-04-17 02:58:58'),
(57, 1, 'f3b3f1bbde88d96cc17a6403c0fefd374905272c', '2015-04-16 21:59:22', '2015-04-16 20:12:00', '2015-04-17 02:59:22'),
(58, 1, 'f0b455894dc81e80fe8a9048334ba1c7cdf57c8a', '2015-04-20 16:27:03', '2015-04-20 14:46:13', '2015-04-20 21:27:03'),
(59, 1, 'b669ed800717f457b4b4c77732d0a1e721c97fe5', '2015-04-20 16:41:03', '2015-04-20 15:18:01', '2015-04-20 21:41:03'),
(60, 1, '41f7f522399baf23e9bcf25632eb4c5bb614ea9c', '2015-04-21 11:00:57', '2015-04-21 09:07:02', '2015-04-21 16:00:57'),
(61, 1, 'b876d3b0d492b2738861accd8f349245ab1a7bce', '2015-04-21 17:54:44', '2015-04-21 16:54:35', '2015-04-21 22:54:44'),
(62, 1, '2be8ead8c80200d63cdd4e4f0e72e8e50ce4e625', '2015-04-21 18:27:47', '2015-04-21 17:27:29', '2015-04-21 23:27:47'),
(63, 1, 'e6635f5ad01c44aff9e1ba8ce0dde56f2764f929', '2015-04-21 18:56:54', '2015-04-21 17:36:52', '2015-04-21 23:56:54'),
(64, 1, '01b69dc11a966b86d9d8465308de07a05848e2cb', '2015-04-22 10:31:08', '2015-04-22 09:18:49', '2015-04-22 15:31:08'),
(65, 1, '15579c09a0b52748cd16b4806bcc4ae19730b1d5', '2015-04-22 19:48:16', '2015-04-22 18:42:12', '2015-04-23 00:48:16'),
(66, 1, '3e49282dc585e728233e6d6036a6a6a284b8414b', '2015-05-06 12:13:52', '2015-05-06 11:53:34', '2015-05-06 18:13:52'),
(67, 1, '0a9eb2efc451d2514b47461a7a7573cc722f5fea', '2015-05-07 17:05:59', '2015-05-07 15:53:01', '2015-05-07 22:05:59'),
(68, 1, 'f9b9bf4ae8cfa1bde38ab79cfb22bba9ee61c560', '2015-05-07 16:39:08', '2015-05-07 16:22:58', '2015-05-07 22:39:08'),
(69, 1, '801a4d3228d69297f0dc5a9c4638322c69b38c4e', '2015-05-07 16:43:01', '2015-05-07 16:41:39', '2015-05-07 22:43:01'),
(70, 1, '2d66f7df7b8daebe1a24ead601e8fb6f391b96cd', '2015-05-07 17:52:34', '2015-05-07 17:50:30', '2015-05-07 23:52:34'),
(71, 1, '785ec53277b2d4856ac5ebd901cfb53b7e20877c', '2015-05-07 17:52:40', '2015-05-07 17:52:37', '2015-05-07 23:52:40'),
(72, 1, '5d75a00f258ef65db5da91fe6e0595d09f3a316d', '2015-05-08 15:33:56', '2015-05-08 14:33:55', '2015-05-08 20:33:56'),
(73, 1, '1dcb80cced6a746848d6bc035ac530f07c61777b', '2015-05-13 09:21:02', '2015-05-13 08:40:15', '2015-05-13 15:21:02'),
(74, 1, 'd6a7edd08ee1f362bcd9b4f694408a3accfadd25', '2015-05-13 09:25:28', '2015-05-13 09:21:49', '2015-05-13 15:25:28'),
(75, 1, '55d6919df4548c2dc1630649f8ba173b089790c4', '2015-05-13 09:26:03', '2015-05-13 09:25:35', '2015-05-13 15:26:03'),
(76, 1, '4d6832b3c190855111d5c34a9f01db0e9dac167f', '2015-05-13 09:26:53', '2015-05-13 09:26:13', '2015-05-13 15:26:53'),
(77, 1, '6664382b24021d160c7a77a15ad2860b58d49d47', '2015-05-13 09:28:20', '2015-05-13 09:27:53', '2015-05-13 15:28:20'),
(78, 1, 'fd2be13d1d6093e9488299d0c9eb4462761d63f8', '2015-05-13 09:29:07', '2015-05-13 09:28:24', '2015-05-13 15:29:07'),
(79, 1, '4e750c59697aa906d2c25e0c6cf7883b3be13043', '2015-05-13 09:30:14', '2015-05-13 09:29:16', '2015-05-13 15:30:14'),
(80, 1, '9c24bdda7f5af43a80d706f2801b65c19cdada39', '2015-05-13 09:34:23', '2015-05-13 09:30:19', '2015-05-13 15:34:23'),
(81, 1, '89cb67d0d0aa8ef28a9f6bf846837bc4de52195a', '2015-05-13 10:35:42', '2015-05-13 09:35:41', '2015-05-13 15:35:42'),
(82, 1, '10d410234ec1f78c63db225e2d821c48aa3c7e89', '2015-05-13 10:38:04', '2015-05-13 09:36:51', '2015-05-13 15:38:04'),
(83, 1, '59c42ab6a7cd5b28a2ce6e4a781f1a6b2762f817', '2015-05-13 10:41:30', '2015-05-13 09:38:44', '2015-05-13 15:41:30'),
(84, 1, 'a65a004e3b087963b7ee9d1b35221d1125105698', '2015-05-13 10:43:00', '2015-05-13 09:42:59', '2015-05-13 15:43:00'),
(85, 1, 'f3a220989efe213e163b36583574373ab7f5b08e', '2015-05-13 09:44:16', '2015-05-13 09:43:32', '2015-05-13 15:44:16'),
(86, 1, '96484a3bbe99aaa0087d66b73f83223c84256cf2', '2015-05-13 10:44:50', '2015-05-13 09:44:49', '2015-05-13 15:44:50'),
(87, 1, '45c9da00d023617b432424e2697215b8e4ad9a58', '2015-05-13 16:04:37', '2015-05-13 15:00:57', '2015-05-13 21:04:37'),
(88, 1, 'ec8b7de396172b85a325fde1541cae43ff8b889f', '2015-05-14 15:25:44', '2015-05-14 15:25:28', '2015-05-14 21:25:44'),
(89, 1, '2e8b0d61504e9d2b009a812778d80df160ff353c', '2015-05-14 16:25:47', '2015-05-14 15:25:46', '2015-05-14 21:25:47'),
(90, 1, 'd59617ca41b2ebf1260cf074d223ef835b191ebc', '2015-05-14 17:27:43', '2015-05-14 17:25:49', '2015-05-14 23:27:43'),
(91, 1, '1fa3482fd1c524b4f92a5cad7d21208d9e92c08d', '2015-05-14 17:50:13', '2015-05-14 17:29:42', '2015-05-14 23:50:13'),
(92, 1, 'b27a348bfb241f05a15051fb80f64a533258747e', '2015-05-14 17:50:33', '2015-05-14 17:50:15', '2015-05-14 23:50:33'),
(93, 1, '40d561b1adf2dfe3b0983b25bfe8d24a3b526671', '2015-05-14 17:51:14', '2015-05-14 17:50:35', '2015-05-14 23:51:14'),
(94, 1, '26a319e50bda74b6f418faddbab996cfba6ba100', '2015-05-14 17:52:15', '2015-05-14 17:51:15', '2015-05-14 23:52:15'),
(95, 1, '12c32c83e6b0663bfb87b1f228c25499eea40bac', '2015-05-14 17:52:21', '2015-05-14 17:52:16', '2015-05-14 23:52:21'),
(96, 1, '58fa4fa5b4e4be42dda5464df95c2e862f176234', '2015-05-14 17:52:43', '2015-05-14 17:52:23', '2015-05-14 23:52:43'),
(97, 1, '8d1af1c91f2f2c5634abe8db2f8b3954de079ed3', '2015-05-14 17:52:48', '2015-05-14 17:52:44', '2015-05-14 23:52:48'),
(98, 1, '0637cd0ca7c19a06909a1bc84912f1b0c2b1c5a9', '2015-05-14 17:53:49', '2015-05-14 17:52:51', '2015-05-14 23:53:49'),
(99, 1, '9c7612f757663d770430359804f636f05d02c4b3', '2015-05-14 17:54:05', '2015-05-14 17:53:53', '2015-05-14 23:54:05'),
(100, 1, 'a1c3d62979e8ea9c22b2ca52b7ffaadd172a6f2d', '2015-05-14 17:54:41', '2015-05-14 17:54:11', '2015-05-14 23:54:41'),
(101, 1, 'ada2cebce798aab9294ede041b40005335f64ac1', '2015-05-14 17:56:10', '2015-05-14 17:54:44', '2015-05-14 23:56:10'),
(102, 1, 'a248be06abfac06d4ed95aa97742d44d6566daff', '2015-05-14 17:57:06', '2015-05-14 17:56:13', '2015-05-14 23:57:06'),
(103, 1, '74727519b860ea2cbfcde45616cbbac6a0ea8839', '2015-05-14 18:57:10', '2015-05-14 17:57:10', '2015-05-14 23:57:10'),
(104, 1, '58abd1cda50f78bcf3458a4ae906f941aa38f532', '2015-05-14 17:57:55', '2015-05-14 17:57:11', '2015-05-14 23:57:55'),
(105, 1, '933056e18773ce48d0ad7b4ef6035452858dc98a', '2015-05-14 17:58:06', '2015-05-14 17:58:02', '2015-05-14 23:58:06'),
(106, 1, 'c84b931bf7b9174730639d6a8474ec52237431b1', '2015-05-14 17:59:26', '2015-05-14 17:58:14', '2015-05-14 23:59:26'),
(107, 1, 'e56b8c08acd0897e2b060813277cef4e925af2a5', '2015-05-14 17:59:39', '2015-05-14 17:59:32', '2015-05-14 23:59:39'),
(108, 1, '582de03789d80bb0d1a8773460eaa589b92f99db', '2015-05-14 18:07:17', '2015-05-14 17:59:44', '2015-05-15 00:07:17'),
(109, 1, '578f0e2fdf5ca6ad267e9db960415c5866a66014', '2015-05-14 18:12:20', '2015-05-14 18:07:25', '2015-05-15 00:12:20'),
(110, 1, 'c233bcee50a6a342a6a0607a9471243a5c2cabb0', '2015-05-14 18:21:12', '2015-05-14 18:21:08', '2015-05-15 00:21:12'),
(111, 1, 'bfa3bf5d2dfdcdcfb639d8d8ef835f8513c9ad4d', '2015-05-14 19:10:04', '2015-05-14 18:21:23', '2015-05-15 01:10:04'),
(112, 1, '5b6c3b29991adb42300f3d0819d0803f0498356e', '2015-05-14 20:17:15', '2015-05-14 19:10:18', '2015-05-15 01:17:15'),
(113, 1, 'c3cee95eefd8d85f12609cd1e8675ee68e6bcd00', '2015-05-14 20:34:47', '2015-05-14 19:18:10', '2015-05-15 01:34:47'),
(114, 1, 'a43eca649f7d84d64ee8bff0f33b03962cdbe245', '2015-05-14 21:48:27', '2015-05-14 20:48:02', '2015-05-15 02:48:27'),
(115, 1, 'fd156980ef3dd006eaf4af350c6a99bb2817bde2', '2015-06-11 18:39:18', '2015-06-11 18:36:30', '2015-06-12 00:39:18'),
(116, 1, 'b6c46f09f4cfe9b00d2d164f896956dbc472ac00', '2015-06-11 18:49:56', '2015-06-11 18:39:32', '2015-06-12 00:49:56'),
(117, 1, '85a23eb00f68340c31026f5fbfc2186439e3fb12', '2015-06-11 20:09:56', '2015-06-11 18:50:27', '2015-06-12 01:09:56'),
(118, 1, '05660eb2d8d82fe85840ceb07fe231870b1ca07f', '2015-06-16 18:30:42', '2015-06-16 16:38:24', '2015-06-16 23:30:42'),
(119, 1, 'c61fb03605e9063ef68ee849097146069af1920b', '2015-06-22 15:43:24', '2015-06-22 14:43:21', '2015-06-22 20:43:24'),
(120, 1, 'b5b4ec2770034972668906164b225275ffd05e6e', '2015-06-23 12:59:56', '2015-06-23 12:59:56', '2015-06-23 18:59:56'),
(121, 1, 'dc10be4523b64b688f3268de52b7f5a95c57aa6e', '2015-06-27 23:55:49', '2015-06-27 22:55:49', '2015-06-28 04:55:49'),
(122, 1, 'be8499784e179c8f0bf2164e24caefa57b9c2329', '2015-06-29 10:47:24', '2015-06-29 09:47:24', '2015-06-29 15:47:24'),
(123, 1, '3c3b6ab7a5f8e2da27b5a1ddf8b49f577299f91a', '2015-06-29 11:07:35', '2015-06-29 10:06:50', '2015-06-29 16:07:35'),
(124, 1, 'e7a09f01396be0c2db992efc6fae8c77f504fc58', '2015-06-30 20:59:50', '2015-06-30 19:31:52', '2015-07-01 01:59:50'),
(125, 1, 'ddec1d667570c67795b068d4f17059a2b81f6859', '2015-07-01 12:51:44', '2015-07-01 11:51:44', '2015-07-01 17:51:44'),
(126, 1, '029fd95c196b6f37d967723bd594b1252df61e1d', '2015-07-01 18:27:28', '2015-07-01 17:25:39', '2015-07-01 23:27:28'),
(127, 1, '6050407584261d8334e3d89e4c0df48bc0d7a9fa', '2015-07-01 17:45:32', '2015-07-01 17:45:22', '2015-07-01 23:45:32'),
(128, 1, 'a1b10dffa5f33848675a245d03d6b852a3811041', '2015-07-01 17:48:47', '2015-07-01 17:48:22', '2015-07-01 23:48:47'),
(129, 1, 'a3fbbf1b02c8bef1a5eac36c4050bb9820add2a1', '2015-07-01 17:49:51', '2015-07-01 17:48:54', '2015-07-01 23:49:51'),
(130, 1, 'c22dc93402c3c686836017e5078eb566c2bc5cbe', '2015-07-01 17:53:28', '2015-07-01 17:52:42', '2015-07-01 23:53:28'),
(131, 1, '670a61a66720e6d6e33c12f887aecd6451c3a2ef', '2015-07-01 17:54:05', '2015-07-01 17:53:38', '2015-07-01 23:54:05'),
(132, 1, '50fd803fb9afd94cf439c5dace9e1402923c8751', '2015-07-01 17:56:53', '2015-07-01 17:56:33', '2015-07-01 23:56:53'),
(133, 1, '141f03e538fffa97b0c02b5dc824126bf08c6eb9', '2015-07-01 18:37:40', '2015-07-01 18:37:06', '2015-07-02 00:37:40'),
(134, 1, 'cf01d7944b90442db2df74c31416b25bdbb63bd1', '2015-07-01 20:58:51', '2015-07-01 19:58:37', '2015-07-02 01:58:51'),
(135, 1, 'd0c1515ebad6ab0fd1f78e224b8ab2913079a3b0', '2015-07-02 18:51:57', '2015-07-02 17:39:11', '2015-07-02 23:51:57'),
(136, 1, '91a377f5fdb4b8494c0cc265304cdbf6498767e0', '2015-07-03 10:59:57', '2015-07-03 09:59:57', '2015-07-03 15:59:57'),
(137, 1, '2bf8f266c967299c894242ca40db6c4515859e68', '2015-07-03 10:01:33', '2015-07-03 10:01:13', '2015-07-03 16:01:33'),
(138, 1, 'f36b5541b45d474c60d7b44d7d4725224df6f33b', '2015-07-03 10:01:58', '2015-07-03 10:01:56', '2015-07-03 16:01:58');

-- --------------------------------------------------------

--
-- Table structure for table `vse_data`
--

DROP TABLE IF EXISTS `vse_data`;
CREATE TABLE IF NOT EXISTS `vse_data` (
  `entry_id` int(11) NOT NULL AUTO_INCREMENT,
  `app_id` int(11) NOT NULL,
  `vse_label` varchar(50) COLLATE utf8_bin NOT NULL,
  `vse_value` varchar(200) COLLATE utf8_bin NOT NULL,
  `vse_type` varchar(50) COLLATE utf8_bin NOT NULL,
  `vse_annotations` text COLLATE utf8_bin,
  `captured_datetime` datetime NOT NULL,
  `created_datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`entry_id`),
  KEY `app_id` (`app_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=81 ;

--
-- Dumping data for table `vse_data`
--

INSERT INTO `vse_data` (`entry_id`, `app_id`, `vse_label`, `vse_value`, `vse_type`, `vse_annotations`, `captured_datetime`, `created_datetime`) VALUES
(2, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:09'),
(3, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:10'),
(4, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:10'),
(5, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:11'),
(6, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:11'),
(7, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:11'),
(8, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:11'),
(9, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:11'),
(10, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:11'),
(11, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:11'),
(12, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:12'),
(13, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:12'),
(14, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:12'),
(15, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:12'),
(16, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:12'),
(17, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:13'),
(18, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:13'),
(19, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:13'),
(20, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:13'),
(21, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:13'),
(22, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:13'),
(23, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:14'),
(24, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:14'),
(25, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:14'),
(26, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:14'),
(27, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:14'),
(28, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:14'),
(29, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:14'),
(30, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:14'),
(31, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:14'),
(32, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:14'),
(33, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:14'),
(34, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:14'),
(35, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:14'),
(36, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:14'),
(37, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:14'),
(38, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:14'),
(39, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:14'),
(40, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:14'),
(41, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:14'),
(42, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:14'),
(43, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:14'),
(44, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:14'),
(45, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:14'),
(46, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:14'),
(47, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:14'),
(48, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:14'),
(49, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:14'),
(50, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:14'),
(51, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:14'),
(52, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:14'),
(53, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:14'),
(54, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:14'),
(55, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:15'),
(56, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:15'),
(57, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:15'),
(58, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:15'),
(59, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:15'),
(60, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:15'),
(61, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:15'),
(62, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:15'),
(63, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:15'),
(64, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:15'),
(65, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:15'),
(66, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:15'),
(67, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:15'),
(68, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:15'),
(69, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:15'),
(70, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:15'),
(71, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:15'),
(72, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:15'),
(73, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:15'),
(74, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:15'),
(75, 1, 'DIRECT pvCloud TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:15'),
(76, 1, 'DIRECT pvCloud "" TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:15'),
(77, 1, 'DIRECT pvCloud TEST""', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:15'),
(78, 1, '"DIRECT pvCloud TEST"', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:15'),
(79, 1, 'DIRECT pvCloud "TEST', '{"t":"42","h":"40"}', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:15'),
(80, 1, 'DIRECT "pvCloud" TEST', '12345', 'NUNMERICO', NULL, '2015-03-18 17:19:47', '2015-03-18 19:42:15');

-- --------------------------------------------------------

--
-- Table structure for table `widgets`
--

DROP TABLE IF EXISTS `widgets`;
CREATE TABLE IF NOT EXISTS `widgets` (
  `widget_id` int(11) NOT NULL AUTO_INCREMENT,
  `page_id` int(11) NOT NULL,
  `widget_type_id` int(11) NOT NULL,
  `title` varchar(100) COLLATE utf8_bin NOT NULL,
  `description` varchar(1000) COLLATE utf8_bin NOT NULL,
  `refresh_frequency_sec` int(11) NOT NULL DEFAULT '10',
  `order` int(11) NOT NULL,
  `created_datetime` datetime NOT NULL,
  `modified_datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_datetime` datetime DEFAULT NULL,
  PRIMARY KEY (`widget_id`),
  KEY `page_id` (`page_id`),
  KEY `order` (`order`),
  KEY `widget_type_id` (`widget_type_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=48 ;

--
-- Dumping data for table `widgets`
--

INSERT INTO `widgets` (`widget_id`, `page_id`, `widget_type_id`, `title`, `description`, `refresh_frequency_sec`, `order`, `created_datetime`, `modified_datetime`, `deleted_datetime`) VALUES
(1, 1, 1, 'generic title', 'generic description', 10, 2, '2015-04-16 18:37:25', '2015-04-16 18:37:25', NULL),
(2, 1, 1, 'test 2', 'generic description', 10, 4, '2015-04-16 18:38:20', '2015-04-16 18:38:20', NULL),
(3, 1, 1, 'prueba 001', 'generic description', 10, 5, '2015-04-16 18:38:21', '2015-04-16 18:38:21', NULL),
(4, 1, 1, 'prueba 002', 'generic description', 10, 6, '2015-04-16 18:38:22', '2015-04-16 18:38:22', NULL),
(5, 1, 1, 'generic title', 'generic description', 10, 7, '2015-04-16 18:44:19', '2015-04-16 18:44:19', NULL),
(6, 1, 1, 'generic title', 'generic description', 10, 18, '2015-04-16 18:44:19', '2015-04-16 18:44:19', NULL),
(7, 1, 1, 'generic title', 'generic description', 10, 17, '2015-04-16 18:44:19', '2015-04-16 18:44:19', NULL),
(8, 1, 1, 'generic title', 'generic description', 10, 19, '2015-04-16 18:44:19', '2015-04-16 18:44:19', NULL),
(9, 1, 1, 'generic title', 'generic description', 10, 20, '2015-04-16 18:44:20', '2015-04-16 18:44:20', NULL),
(10, 1, 1, 'generic title', 'generic description', 10, 21, '2015-04-16 18:44:20', '2015-04-16 18:44:20', NULL),
(11, 1, 1, 'generic title', 'generic description', 10, 22, '2015-04-16 18:44:20', '2015-04-16 18:44:20', NULL),
(12, 1, 1, 'generic title', 'generic description', 10, 23, '2015-04-16 18:44:20', '2015-04-16 18:44:20', NULL),
(13, 1, 1, 'generic title', 'generic description', 10, 24, '2015-04-16 19:02:12', '2015-04-16 19:02:12', NULL),
(14, 1, 1, 'generic title', 'generic description', 10, 25, '2015-04-16 19:02:14', '2015-04-16 19:02:14', NULL),
(15, 1, 1, 'generic title', 'generic description', 10, 26, '2015-04-16 19:02:14', '2015-04-16 19:02:14', NULL),
(16, 1, 1, 'generic title', 'generic description', 10, 27, '2015-04-16 19:02:14', '2015-04-16 19:02:14', NULL),
(17, 1, 1, 'generic title', 'generic description', 10, 28, '2015-04-16 19:02:14', '2015-04-16 19:02:14', NULL),
(18, 1, 1, 'generic title', 'generic description', 10, 29, '2015-04-16 19:02:14', '2015-04-16 19:02:14', NULL),
(19, 1, 1, 'generic title', 'generic description', 10, 30, '2015-04-16 19:02:15', '2015-04-16 19:02:15', NULL),
(20, 1, 1, 'generic title', 'generic description', 10, 31, '2015-04-16 19:02:36', '2015-04-16 19:02:36', NULL),
(21, 1, 1, 'generic title', 'generic description', 10, 32, '2015-04-16 19:03:22', '2015-04-16 19:03:22', NULL),
(22, 1, 1, 'generic title', 'generic description', 10, 33, '2015-04-16 19:03:25', '2015-04-16 19:03:25', NULL),
(23, 1, 1, 'generic title', 'generic description', 10, 34, '2015-04-16 19:03:56', '2015-04-16 19:03:56', NULL),
(24, 1, 1, 'generic title', 'generic description', 10, 35, '2015-04-16 19:07:03', '2015-04-16 19:07:03', NULL),
(25, 1, 1, 'generic title', 'generic description', 10, 36, '2015-04-16 19:45:15', '2015-04-16 19:45:15', NULL),
(26, 1, 1, 'generic title', 'generic description', 10, 37, '2015-04-16 19:45:36', '2015-04-16 19:45:36', NULL),
(27, 1, 1, 'generic title', 'generic description', 10, 38, '2015-04-16 19:46:01', '2015-04-16 19:46:01', NULL),
(28, 1, 1, 'generic title', 'generic description', 10, 39, '2015-04-16 19:46:03', '2015-04-16 19:46:03', NULL),
(29, 1, 1, 'generic title', 'generic description', 10, 40, '2015-04-16 19:46:03', '2015-04-16 19:46:03', NULL),
(30, 1, 1, 'generic title', 'generic description', 10, 41, '2015-04-16 19:46:17', '2015-04-16 19:46:17', NULL),
(31, 1, 1, 'generic title', 'generic description', 10, 42, '2015-04-16 19:47:02', '2015-04-16 19:47:02', NULL),
(32, 1, 1, 'generic title', 'generic description', 10, 43, '2015-04-16 19:48:11', '2015-04-16 19:48:11', NULL),
(33, 1, 1, 'generic title', 'generic description', 10, 44, '2015-04-16 19:48:59', '2015-04-16 19:48:59', NULL),
(34, 1, 1, 'generic title', 'generic description', 10, 45, '2015-04-16 19:57:37', '2015-04-16 19:57:37', NULL),
(35, 1, 1, 'generic title', 'generic description', 10, 46, '2015-04-16 19:58:22', '2015-04-16 19:58:22', NULL),
(36, 1, 1, 'generic title', 'generic description', 10, 16, '2015-04-16 19:59:02', '2015-04-16 19:59:02', NULL),
(37, 1, 1, 'test 1', 'generic description', 10, 3, '2015-04-16 19:59:15', '2015-04-16 19:59:15', NULL),
(38, 1, 1, 'generic title', 'generic description', 10, 1, '2015-04-16 19:59:34', '2015-04-16 19:59:34', NULL),
(39, 1, 1, 'generic title', 'generic description', 10, 15, '2015-04-16 19:59:36', '2015-04-16 19:59:36', NULL),
(40, 1, 1, 'generic title', 'generic description', 10, 11, '2015-04-16 19:59:57', '2015-04-16 19:59:57', NULL),
(41, 1, 1, 'generic title', 'monitor 01', 10, 8, '2015-04-16 20:01:24', '2015-04-16 20:01:24', NULL),
(42, 1, 1, 'generic title', 'generic description', 10, 14, '2015-04-16 20:02:02', '2015-04-16 20:02:02', NULL),
(43, 1, 1, 'generic title', 'generic description', 10, 13, '2015-04-16 20:04:09', '2015-04-16 20:04:09', NULL),
(44, 1, 1, 'generic title', 'generic description', 10, 12, '2015-04-16 20:04:10', '2015-04-16 20:04:10', NULL),
(45, 1, 1, 'generic title', 'generic description', 10, 10, '2015-04-16 20:04:11', '2015-04-16 20:04:11', NULL),
(46, 1, 1, 'generic title', 'monitor 02', 10, 9, '2015-04-16 20:04:31', '2015-04-16 20:04:31', NULL),
(47, 16, 1, 'generic title', 'generic description', 10, 1, '2015-04-16 20:12:25', '2015-04-16 20:12:25', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `widget_config`
--

DROP TABLE IF EXISTS `widget_config`;
CREATE TABLE IF NOT EXISTS `widget_config` (
  `widget_config_id` int(11) NOT NULL AUTO_INCREMENT,
  `widget_id` int(11) NOT NULL,
  `vse_label` varchar(50) COLLATE utf8_bin NOT NULL,
  `simple_object_property` varchar(100) COLLATE utf8_bin NOT NULL,
  `friendly_label` varchar(50) COLLATE utf8_bin NOT NULL,
  `options_json` varchar(500) COLLATE utf8_bin NOT NULL,
  `created_datetime` datetime NOT NULL,
  `modified_datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_datetime` datetime DEFAULT NULL,
  PRIMARY KEY (`widget_config_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=166 ;

--
-- Dumping data for table `widget_config`
--

INSERT INTO `widget_config` (`widget_config_id`, `widget_id`, `vse_label`, `simple_object_property`, `friendly_label`, `options_json`, `created_datetime`, `modified_datetime`, `deleted_datetime`) VALUES
(1, 1, 'FRIDGE', '', 'Refrierador', '{"color":"red","outline":"dotted"}', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(2, 1, 'TV', 'LaserPresence', 'Sala', '{"color":"geen","outline":"dotted"}', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(3, 1, 'KITCHEN', 'Temp', 'Cocina', '{"color":"blue","outline":"dotted"}', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(4, 2, 'FAN', '', 'FAN', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(5, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(6, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(7, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(8, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(9, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(10, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(11, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(12, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(13, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(14, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(15, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(16, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(17, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(18, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(19, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(20, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(21, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(22, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(23, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(24, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(25, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(26, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(27, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(28, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(29, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(30, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(31, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(32, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(33, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(34, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(35, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(36, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(37, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(38, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(39, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(40, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(41, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(42, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(43, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(44, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(45, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(46, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(47, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(48, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(49, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(50, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(51, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(52, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(53, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(54, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(55, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(56, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(57, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(58, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(59, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(60, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(61, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(62, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(63, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(64, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(65, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(66, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(67, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(68, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(69, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(70, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(71, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(72, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(73, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(74, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(75, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(76, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(77, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(78, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(79, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(80, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(81, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(82, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(83, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(84, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(85, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(86, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(87, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(88, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(89, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(90, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(91, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(92, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(93, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(94, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(95, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(96, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(97, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(98, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(99, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(100, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(101, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(102, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(103, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(104, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(105, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(106, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(107, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(108, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(109, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(110, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(111, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(112, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(113, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(114, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(115, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(116, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(117, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(118, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(119, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(120, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(121, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(122, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(123, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(124, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(125, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(126, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(127, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(128, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(129, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(130, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(131, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(132, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(133, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(134, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(135, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(136, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(137, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(138, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(139, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(140, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(141, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(142, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(143, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(144, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(145, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(146, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(147, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(148, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(149, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(150, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(151, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(152, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(153, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(154, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(155, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(156, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(157, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(158, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(159, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(160, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(161, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(162, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(163, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(164, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL),
(165, 1, 'TEST', '', 'PRUEBA', '0', '0000-00-00 00:00:00', '2015-07-03 22:44:14', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `widget_config_ispec`
--

DROP TABLE IF EXISTS `widget_config_ispec`;
CREATE TABLE IF NOT EXISTS `widget_config_ispec` (
  `comparison_operator_cd` varchar(2) COLLATE utf8_bin NOT NULL,
  `comparison_value` varchar(50) COLLATE utf8_bin NOT NULL,
  `text` varchar(100) COLLATE utf8_bin NOT NULL,
  `icon_class` varchar(40) COLLATE utf8_bin NOT NULL,
  `color` varchar(10) COLLATE utf8_bin NOT NULL,
  `widget_config_id` int(11) NOT NULL,
  `ispec_id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`ispec_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Interpretation Spec' AUTO_INCREMENT=8 ;

--
-- Dumping data for table `widget_config_ispec`
--

INSERT INTO `widget_config_ispec` (`comparison_operator_cd`, `comparison_value`, `text`, `icon_class`, `color`, `widget_config_id`, `ispec_id`) VALUES
('=', '30', 'NORMAL', 'gyphicon-ok', '#00FF00', 3, 1),
('<', '30', 'COLD', 'glyphicon-ice-lolly', '#0000FF', 3, 2),
('>', '30', 'HOT', 'glyphicon-fire', '#FF0000', 3, 3),
('=', 'S', 'STABLE', 'glyphicon-ok', 'GREEN', 2, 4),
('=', 'A', 'ABSENT', 'glyphicon-remove', 'RED', 2, 5),
('=', 'H', 'OK', 'glyphicon-ok', 'GREEN', 1, 6),
('=', 'L', 'ALARM', 'glyphicon-volume-up', 'RED', 1, 7);

-- --------------------------------------------------------

--
-- Table structure for table `widget_types`
--

DROP TABLE IF EXISTS `widget_types`;
CREATE TABLE IF NOT EXISTS `widget_types` (
  `widget_type_id` int(11) NOT NULL,
  `widget_type_name` varchar(100) COLLATE utf8_bin NOT NULL,
  `description` varchar(1000) COLLATE utf8_bin DEFAULT NULL,
  `created_datetime` datetime NOT NULL,
  `modified_datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_datetime` datetime DEFAULT NULL,
  `interpretation_properties` varchar(1000) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`widget_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `widget_types`
--

INSERT INTO `widget_types` (`widget_type_id`, `widget_type_name`, `description`, `created_datetime`, `modified_datetime`, `deleted_datetime`, `interpretation_properties`) VALUES
(1, 'Display Last Values (Simple Value)', 'Displays last value for given set of value_label''s', '2015-04-07 16:28:44', '2015-04-09 16:33:01', NULL, ''),
(2, 'Display Last Values (Simple Object)', 'Displays last values out JSON Simple Object for a given set of value label''s', '2015-04-07 16:28:44', '2015-04-09 16:33:28', NULL, ''),
(3, 'Basic Control Knobs', 'Provides ways for end users to interact and send values to pvCloud that could be consumed by devices or apps as well', '2015-04-08 10:36:56', '2015-04-09 16:34:00', NULL, '');

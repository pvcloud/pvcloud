-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Feb 23, 2016 at 02:55 AM
-- Server version: 10.1.9-MariaDB
-- PHP Version: 5.6.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pvcloud`
--

-- --------------------------------------------------------

--
-- Table structure for table `iot_elements`
--

CREATE TABLE `iot_elements` (
  `iot_element_id` int(11) NOT NULL,
  `element_key` varchar(50) COLLATE utf8_bin NOT NULL,
  `account_id` int(11) NOT NULL,
  `created_datetime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `iot_elements`
--

INSERT INTO `iot_elements` (`iot_element_id`, `element_key`, `account_id`, `created_datetime`) VALUES
(1, '56cba1d703651', 2, '2016-02-22 18:03:35'),
(2, '56cba28512730', 2, '2016-02-22 18:06:29'),
(3, '56cba2972f69b', 2, '2016-02-22 18:06:47'),
(4, '56cba2fab7579', 2, '2016-02-22 18:08:26'),
(5, '56cba3163902c', 2, '2016-02-22 18:08:54'),
(6, '56cba31d6338c', 2, '2016-02-22 18:09:01'),
(7, '56cba32b0c734', 2, '2016-02-22 18:09:15'),
(8, '56cba334a57b1', 2, '2016-02-22 18:09:24'),
(9, '56cba33adfef2', 2, '2016-02-22 18:09:30'),
(10, '56cba33bbf903', 2, '2016-02-22 18:09:31'),
(11, '56cba33c5f176', 2, '2016-02-22 18:09:32'),
(12, '56cba33d16c82', 2, '2016-02-22 18:09:33'),
(13, '56cba3f6b15fd', 2, '2016-02-22 18:12:38'),
(14, '56cba3ff77f56', 2, '2016-02-22 18:12:47'),
(15, '56cba44625466', 2, '2016-02-22 18:13:58'),
(16, '56cba44c4793a', 2, '2016-02-22 18:14:04'),
(17, '56cba538ca8eb', 2, '2016-02-22 18:18:00'),
(18, '56cba54ed9c91', 2, '2016-02-22 18:18:22'),
(19, '56cba56062b69', 2, '2016-02-22 18:18:40'),
(20, '56cba56599f21', 2, '2016-02-22 18:18:45'),
(21, '56cba590e3143', 2, '2016-02-22 18:19:28'),
(22, '56cba5acc750f', 2, '2016-02-22 18:19:56'),
(23, '56cba5c03c5ad', 2, '2016-02-22 18:20:16'),
(24, '56cba5da346b6', 2, '2016-02-22 18:20:42'),
(25, '56cba5e848720', 2, '2016-02-22 18:20:56'),
(26, '56cba5f10dae1', 2, '2016-02-22 18:21:05'),
(27, '56cba60b9e60e', 2, '2016-02-22 18:21:31'),
(28, '56cba629277c5', 2, '2016-02-22 18:22:01'),
(29, '56cba62fbe0be', 2, '2016-02-22 18:22:07'),
(30, '56cba633bcdcb', 2, '2016-02-22 18:22:11'),
(31, '56cba6348eea5', 2, '2016-02-22 18:22:12');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `iot_elements`
--
ALTER TABLE `iot_elements`
  ADD PRIMARY KEY (`iot_element_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `iot_elements`
--
ALTER TABLE `iot_elements`
  MODIFY `iot_element_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

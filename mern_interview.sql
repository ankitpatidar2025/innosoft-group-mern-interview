-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 08, 2026 at 01:33 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mern_interview`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `status` tinyint(4) NOT NULL COMMENT '1: active, 0:inactive',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Ankit', 'ankit@gmail.com', 1, '2026-10-08 08:42:26', '2026-10-08 15:52:44'),
(2, 'Jack', 'jack@gmail.com', 1, '2026-10-08 08:47:45', '2026-10-08 15:52:34'),
(3, 'Alex', 'alex@gmail.com', 1, '2026-10-08 10:40:42', '2026-10-08 16:10:42');

-- --------------------------------------------------------

--
-- Table structure for table `wallets`
--

CREATE TABLE `wallets` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `balance` decimal(30,2) NOT NULL DEFAULT 0.00,
  `currency` varchar(10) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1 COMMENT '1:active, 0:inactive',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wallets`
--

INSERT INTO `wallets` (`id`, `user_id`, `balance`, `currency`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 70.00, 'INR', 1, '2026-10-08 08:52:12', '2026-10-08 11:32:13'),
(2, 2, 10.00, 'INR', 1, '2026-10-08 08:52:48', '2026-10-08 11:33:00'),
(3, 3, 5010.00, 'INR', 1, '2026-10-08 10:42:45', '2026-10-08 11:33:00');

-- --------------------------------------------------------

--
-- Table structure for table `wallet_history`
--

CREATE TABLE `wallet_history` (
  `id` int(11) NOT NULL,
  `wallet_id` int(11) NOT NULL,
  `amount` decimal(30,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wallet_history`
--

INSERT INTO `wallet_history` (`id`, `wallet_id`, `amount`, `created_at`) VALUES
(1, 1, 60.00, '2026-10-08 11:20:24'),
(2, 1, 6.00, '2026-10-08 11:20:35'),
(3, 1, 4.00, '2026-10-08 11:20:39'),
(4, 1, 10.00, '2026-10-08 11:20:56');

-- --------------------------------------------------------

--
-- Table structure for table `wallet_transactions`
--

CREATE TABLE `wallet_transactions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `wallet_id` int(11) NOT NULL,
  `reference_id` varchar(100) NOT NULL,
  `transaction_type` enum('CREDIT','DEBIT','TRANSFER') NOT NULL,
  `type` varchar(10) NOT NULL,
  `amount` decimal(30,2) NOT NULL DEFAULT 0.00,
  `balance_before` decimal(30,2) NOT NULL DEFAULT 0.00,
  `balance_after` decimal(30,2) NOT NULL DEFAULT 0.00,
  `description` varchar(1000) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wallet_transactions`
--

INSERT INTO `wallet_transactions` (`id`, `user_id`, `wallet_id`, `reference_id`, `transaction_type`, `type`, `amount`, `balance_before`, `balance_after`, `description`, `created_at`) VALUES
(17, 1, 1, 'efd80d50-ab86-4702-b2e8-ee2aa57cca03', 'DEBIT', '', 10.00, 10.00, 0.00, 'test', '2026-10-08 10:44:41'),
(18, 2, 2, 'efd80d50-ab86-4702-b2e8-ee2aa57cca03', 'CREDIT', '', 10.00, 700.00, 710.00, 'test', '2026-10-08 10:44:41'),
(21, 1, 1, '007c9506-2df7-48aa-8ceb-29996cdacc0b', 'DEBIT', '', 10.00, 90.00, 80.00, 'test', '2026-10-08 11:32:08'),
(22, 2, 2, '007c9506-2df7-48aa-8ceb-29996cdacc0b', 'CREDIT', '', 10.00, 0.00, 10.00, 'test', '2026-10-08 11:32:08'),
(23, 1, 1, '562d044c-458b-4e8d-b4f5-86a0493b0dcf', 'DEBIT', '', 10.00, 80.00, 70.00, 'test', '2026-10-08 11:32:13'),
(24, 2, 2, '562d044c-458b-4e8d-b4f5-86a0493b0dcf', 'CREDIT', '', 10.00, 10.00, 20.00, 'test', '2026-10-08 11:32:13'),
(25, 2, 2, '349b800d-39bf-45ec-9cb4-96ae64aa6df0', 'DEBIT', '', 10.00, 20.00, 10.00, 'test', '2026-10-08 11:33:00'),
(26, 3, 3, '349b800d-39bf-45ec-9cb4-96ae64aa6df0', 'CREDIT', '', 10.00, 5000.00, 5010.00, 'test', '2026-10-08 11:33:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `wallets`
--
ALTER TABLE `wallets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `wallet_history`
--
ALTER TABLE `wallet_history`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `wallet_transactions`
--
ALTER TABLE `wallet_transactions`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `wallets`
--
ALTER TABLE `wallets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `wallet_history`
--
ALTER TABLE `wallet_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `wallet_transactions`
--
ALTER TABLE `wallet_transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

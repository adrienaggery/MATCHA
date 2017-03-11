SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

CREATE DATABASE IF NOT EXISTS `matcha` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `matcha`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `age` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `orientation` varchar(255) DEFAULT NULL,
  `bio` varchar(255) DEFAULT NULL,
  `login` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '0',
  `position` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `lastConnected` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `users` (`id`, `name`, `firstName`, `age`, `email`, `gender`, `orientation`, `bio`, `login`, `password`, `token`, `active`, `position`, `createdAt`, `lastConnected`) VALUES
(1, 'Ceccato', 'Mathieu', NULL, 'mathieu.ceccato@gmail.com', 'male', 'female', NULL, 'Lumpy', 'b5685971aa17f23e5781b426e454d6ab1a88c8ad80862a24c688a372147887757b06734be386f5f22f654d57e7bf46a23384ef421d19fac0b0b811b20a91c342', '0ff921a73e8cecf9c5d651fc1589d70a7818ef4fd4ebd305c8ec0d5199d6b7238484e860f94b11748ab834926cf70d59', 1, '{\"city\":\"\"}', '2017-03-10 22:26:32', '2017-03-11 18:17:50');


ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

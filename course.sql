CREATE TABLE `course` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `department` char(4) DEFAULT NULL,
  `number` char(9) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` varchar(2000) DEFAULT NULL,
  `hours` int(11) DEFAULT NULL,
  `level` char(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3146 DEFAULT CHARSET=utf8mb4;

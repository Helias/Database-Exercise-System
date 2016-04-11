-- Table structure for table `barca_marinai`
DROP TABLE IF EXISTS `barca_marinai`;
CREATE TABLE `barca_marinai` (
  `idm` varchar(255) NOT NULL,
  `nomem` varchar(255) NOT NULL,
  `rating` varchar(255) NOT NULL,
  `eta` varchar(255) NOT NULL,
  PRIMARY KEY (`idm`)
);

-- table `barca_marinai`
INSERT INTO `barca_marinai` VALUES ('1','marco','10','40'),('10','giovanni','11','42'),('2','giacomo','12','35'),('3','alessandro','20','37'),('4','salvatore','13','38'),('5','vincenzo','5','43'),('6','stefano','6','56'),('7','mario','7','34'),('8','aldo','8','33'),('9','ludovico','9','49');

-- Table structure for table `barca_barche`
DROP TABLE IF EXISTS `barca_barche`;
CREATE TABLE `barca_barche` (
  `idb` varchar(255) NOT NULL,
  `nomeb` varchar(255) NOT NULL,
  `colore` varchar(255) NOT NULL,
  PRIMARY KEY (`idb`)
);

-- table `barca_barche`
INSERT INTO `barca_barche` VALUES ('1','bluefish','rosso'),('10','shark','bianco'),('103','linuxfish','verde'),('2','bluefish','verde'),('3','bluefish','giallo'),('4','goldfish','rosso'),('5','goldfish','rosso'),('6','goldfish','blu'),('7','goldfish','giallo'),('8','shark','verde'),('9','shark','nero');

-- Table structure for table `barca_prenotazioni`
DROP TABLE IF EXISTS `barca_prenotazioni`;
CREATE TABLE `barca_prenotazioni` (
  `idm` varchar(255) NOT NULL REFERENCES `barca_marinai` (`idm`),
  `idb` varchar(255) NOT NULL REFERENCES `barca_barche` (`idb`),
  `data` varchar(255) NOT NULL,
  KEY `idm` (`idm`),
  KEY `idb` (`idb`)
);

-- table `barca_prenotazioni`
INSERT INTO `barca_prenotazioni` VALUES ('1','1','20-06-2016'),('2','2','30-08-2016'),('1','3','28-04-2016'),('1','4','10-10-2016'),('10','9','21-09-2016'),('9','10','22-05-2016'),('8','8','12-04-2016'),('7','7','01-13-2016'),('6','6','05-05-2016'),('5','5','03-12-2016'),('2','103','20-10-2016'),('3','103','15-03-2016'),('4','103','11-01-2016');

INSERT INTO `soluzioni` VALUES
(5, 'SELECT DISTINCT colore FROM barca_marinai JOIN barca_prenotazioni JOIN barca_barche WHERE nomem=\'marco\''),
(6, 'SELECT idm FROM barca_marinai WHERE rating >= 8 UNION SELECT idm FROM barca_prenotazioni WHERE idb=103');

INSERT INTO `domandeALG` VALUES
(4, 'Trovare i colori della barca prenotata dal marinaio Marco', 'barca', 5, 1),
(5, 'Stampare gli id dei marinai che hanno un rating di almeno 8 o che hanno prenotato la barca 103', 'barca', 6, 1);

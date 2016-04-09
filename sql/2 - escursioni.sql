-- Table structure for table `escursioni_escursione`
DROP TABLE IF EXISTS `escursioni_escursione`;
CREATE TABLE `escursioni_escursione` (
  `id` varchar(255) NOT NULL,
  `titolo` varchar(255) NOT NULL,
  `descrizione` varchar(255) NOT NULL,
  `durata` varchar(255) NOT NULL,
  `difficolta` varchar(255) NOT NULL,
  `costo` varchar(255) NOT NULL
);

-- Dumping data for table `escursioni_escursione`
INSERT INTO `escursioni_escursione` VALUES ('1','move on','move on description','10','1','15'),('2','dmi','dmi escursion','20','2','20'),('3','new adventure','adventure escursion','15','5','12'),('4','climb it!','climb it description','33','4','40');

-- Table structure for table `escursioni_persona`
DROP TABLE IF EXISTS `escursioni_persona`;
CREATE TABLE `escursioni_persona` (
  `id` varchar(255) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `cognome` varchar(255) NOT NULL
);

-- Dumping data for table `escursioni_persona`
INSERT INTO `escursioni_persona` VALUES ('1','giacomo','calabro'),('2','paolo','rossi'),('3','giacomo','borzi'),('4','alfredo','maggio'),('5','salvatore','calabro'),('6','ludovico','calabro'),('7','stefano','calabro'),('8','mario','pulvirenti'),('9','salvatore','calabro'),('10','mario','rossi'),('11','andrea','foti'),('12','stefano','pulvirenti'),('13','giovanni','calabro'),('14','salvatore','rossi'),('15','alfredo','trupia');

-- Table structure for table `escursioni_dataescursione`
DROP TABLE IF EXISTS `escursioni_dataescursione`;
CREATE TABLE `escursioni_dataescursione` (
  `id` varchar(255) NOT NULL,
  `data` varchar(255) NOT NULL,
  `idescursione` varchar(255) NOT NULL,
  `idguida` varchar(255) NOT NULL
);

-- Dumping data for table `escursioni_dataescursione`
INSERT INTO `escursioni_dataescursione` VALUES ('1','10-11-2016','1','6'),('2','10-06-2016','2','7'),('3','05-03-2016','3','8'),('4','01-02-2016','4','9'),('5','20-10-2016','3','11'),('6','30-07-2016','4','14');

-- Table structure for table `escursioni_partecipante`
DROP TABLE IF EXISTS `escursioni_partecipante`;
CREATE TABLE `escursioni_partecipante` (
  `idpartecipante` varchar(255) NOT NULL,
  `idescursione` varchar(255) NOT NULL
);

-- Dumping data for table `escursioni_partecipante`
INSERT INTO `escursioni_partecipante` VALUES ('1','1'),('2','2'),('4','3'),('13','4'),('1','2'),('1','3'),('1','4'),('1','5'),('1','6');


INSERT INTO `soluzioni` VALUES (4, 'SELECT nome,cognome FROM escursioni_persona AS p WHERE NOT EXISTS (SELECT * FROM escursioni_escursione AS e WHERE NOT EXISTS (SELECT * FROM  escursioni_partecipante AS ep, escursioni_dataescursione AS de WHERE idpartecipante = p.id AND ep.idescursione = de.id AND de.idescursione = e.id))');
INSERT INTO `domandeSQL` (`id`, `testo`, `db_connesso`, `soluzione`, `argomento`) VALUES (5, 'Trovare i partecipanti (dando nome e cognome in output) che hanno aprtecipato a tutte le escursioni', 'escursioni', 4,  3);

-- Create db 'des' (Database-Exercise-System)
-- CREATE DATABASE IF NOT EXISTS des;

-- Create 'argomenti' table
CREATE TABLE IF NOT EXISTS argomenti(
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    argomento varchar(255) NOT NULL
) ENGINE=InnoDB CHARACTER SET=utf8;

-- Create 'soluzioni' table
CREATE TABLE IF NOT EXISTS soluzioni(
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    soluzione varchar(1000) NOT NULL
) ENGINE=InnoDB CHARACTER SET=utf8;

-- Create 'domandeALG' table
CREATE TABLE IF NOT EXISTS domandeALG(
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    testo varchar(1000) NOT NULL,
    db_connesso varchar(255) NOT NULL,
    soluzione INT NOT NULL,
    argomento INT NOT NULL,
    FOREIGN KEY (soluzione) REFERENCES soluzioni(id),
    FOREIGN KEY (argomento) REFERENCES argomenti(id)
) ENGINE=InnoDB CHARACTER SET=utf8;

-- Create 'domandeSQL' table
CREATE TABLE IF NOT EXISTS domandeSQL(
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    testo varchar(1000) NOT NULL,
    db_connesso varchar(255) NOT NULL,
    soluzione INT NOT NULL,
    argomento INT NOT NULL,
    FOREIGN KEY (soluzione) REFERENCES soluzioni(id),
    FOREIGN KEY (argomento) REFERENCES argomenti(id)
) ENGINE=InnoDB CHARACTER SET=utf8;

CREATE TABLE IF NOT EXISTS utenti(
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    username varchar(255) NOT NULL,
    psw varchar(255) NOT NULL
) ENGINE=InnoDB CHARACTER SET=utf8;

-- Data of table 'argomenti'
INSERT INTO argomenti VALUES
(1, 'SELECT'),
(2, 'MAX/MIN'),
(3, 'GROUP BY'),
(4, 'NOT EXISTS');

INSERT INTO utenti(username,psw) VALUES ('admin', md5('dbex'));

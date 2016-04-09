-- Create db 'des' (Database-Exercise-System)
-- CREATE DATABASE IF NOT EXISTS des;

-- Create 'argomenti' table
CREATE TABLE IF NOT EXISTS argomenti(
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    argomento varchar(255) NOT NULL
);

-- Create 'soluzioni' table
CREATE TABLE IF NOT EXISTS soluzioni(
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    soluzione varchar(255) NOT NULL
);

-- Create 'domandeALG' table
CREATE TABLE IF NOT EXISTS domandeALG(
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    testo varchar(255) NOT NULL,
    db_connesso varchar(255) NOT NULL,
    soluzione INT NOT NULL,
    argomento INT NOT NULL,
    FOREIGN KEY (soluzione) REFERENCES soluzioni(id),
    FOREIGN KEY (argomento) REFERENCES argomenti(id)
);


-- Create 'domandeSQL' table
CREATE TABLE IF NOT EXISTS domandeSQL(
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    testo varchar(255) NOT NULL,
    db_connesso varchar(255) NOT NULL,
    soluzione INT NOT NULL,
    argomento INT NOT NULL,
    FOREIGN KEY (soluzione) REFERENCES soluzioni(id),
    FOREIGN KEY (argomento) REFERENCES argomenti(id)
);

-- Test population argomenti
INSERT INTO argomenti VALUES
(1, 'MAX/MIN'),
(2, 'GROUP BY');

CREATE TABLE IF NOT EXISTS utenti(
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    username varchar(255) NOT NULL,
    psw varchar(255) NOT NULL
);

INSERT INTO utenti(username,psw) VALUES ('admin',md5('dbex'));

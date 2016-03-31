#Create db 'des' (Database-Exercise-System)
CREATE DATABASE IF NOT EXISTS des; 

#Create 'argomenti' table
CREATE TABLE IF NOT EXISTS des.argomenti(
	id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    argomento varchar(255) NOT NULL
);

#Create 'soluzioni' table
CREATE TABLE IF NOT EXISTS des.soluzioni(
	id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    soluzione varchar(255) NOT NULL
);

#Create 'domandeALG' table
CREATE TABLE IF NOT EXISTS des.domandeALG(
	id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	testo varchar(255) NOT NULL,
	db_connesso varchar(255) NOT NULL,
	soluzione INT NOT NULL,
	argomento INT NOT NULL,
	FOREIGN KEY (soluzione) REFERENCES soluzioni(id),
	FOREIGN KEY (argomento) REFERENCES argomenti(id)
);


#Create 'domandeSQL' table
CREATE TABLE IF NOT EXISTS des.domandeSQL(
	id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	testo varchar(255) NOT NULL,
	db_connesso varchar(255) NOT NULL,
	soluzione INT NOT NULL,
	argomento INT NOT NULL,
	FOREIGN KEY (soluzione) REFERENCES soluzioni(id),
	FOREIGN KEY (argomento) REFERENCES argomenti(id)
);

#Test population argomenti
INSERT INTO des.argomenti(argomento) VALUES ('Argomento1'),('Argomento2'),('Argomento3'),('Argomento4');

#Test population soluzioni
INSERT INTO des.soluzioni(soluzione) VALUES ('Soluzione1'),('Soluzione2'),('Soluzione3'),('Soluzione4');

#Test population domandeALG
INSERT INTO des.domandeALG(testo,db_connesso,soluzione,argomento) VALUES ('Seleziona una barca etc','eh',1,1);

SELECT DISTINCT soluzioni.id, soluzioni.soluzione FROM domandeALG INNER JOIN soluzioni WHERE domandeALG.argomento = 1 AND domandeALG.soluzione = soluzioni.id;

CREATE TABLE IF NOT EXISTS des.utenti(
	id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    username varchar(255) NOT NULL,
	psw varchar(255) NOT NULL
);

INSERT INTO des.utenti(username,psw) VALUES ('admin',md5('dbex'));

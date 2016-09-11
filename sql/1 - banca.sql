CREATE TABLE IF NOT EXISTS banca_contocorrente (
	id_conto INT PRIMARY KEY,
	saldo INT,
	data_apertura VARCHAR(255)
) ENGINE=InnoDB CHARACTER SET=utf8;

CREATE TABLE IF NOT EXISTS banca_prodottofinanziario (
	id_conto INT REFERENCES banca_contocorrente(id_conto),
	id_prodotto INT,
	data_stipula VARCHAR(255),
	numero_rate INT,
	id_contraente INT
) ENGINE=InnoDB CHARACTER SET=utf8;

CREATE TABLE IF NOT EXISTS banca_persona (
	id_persona INT PRIMARY KEY,
	nome VARCHAR(255),
	cognome VARCHAR(255),
	data_nascita VARCHAR(255)
) ENGINE=InnoDB CHARACTER SET=utf8;

CREATE TABLE IF NOT EXISTS banca_titolarecc (
	id_persona INT REFERENCES banca_persona(id_persona),
	id_conto INT REFERENCES banca_contocorrente(id_conto)
) ENGINE=InnoDB CHARACTER SET=utf8;

CREATE TABLE IF NOT EXISTS banca_transazione (
	id_contoin INT REFERENCES banca_contocorrente(id_conto),
	id_contoout INT REFERENCES banca_contocorrente(id_conto),
	data VARCHAR(255),
	causale VARCHAR(255),
	dare_avere VARCHAR(255),
	importo INT
) ENGINE=InnoDB CHARACTER SET=utf8;

CREATE TABLE IF NOT EXISTS banca_transazioneprodottofinanziario (
	id_conto INT REFERENCES banca_contocorrente(id_conto),
	data VARCHAR(255),
	causale VARCHAR(255),
	importo INT,
	id_prodotto INT REFERENCES banca_prodottofinanziario(id_prodotto)
) ENGINE=InnoDB CHARACTER SET=utf8;

-- DELETE FROM banca_contocorrente WHERE id_conto IN (1,2,3);
INSERT INTO `banca_contocorrente` (`id_conto`, `saldo`, `data_apertura`) VALUES ('1', '10', '10-12-2015');
INSERT INTO `banca_contocorrente` (`id_conto`, `saldo`, `data_apertura`) VALUES ('2', '20', '10-10-2015');
INSERT INTO `banca_contocorrente` (`id_conto`, `saldo`, `data_apertura`) VALUES ('3', '500', '05-05-2015');

-- DELETE FROM banca_persona WHERE id_persona IN (1,2,3,4);
INSERT INTO `banca_persona` (`id_persona`, `nome`, `cognome`, `data_nascita`) VALUES ('1', 'Stefano', 'Borzì', '12-04-1996');
INSERT INTO `banca_persona` (`id_persona`, `nome`, `cognome`, `data_nascita`) VALUES ('2', 'Alessandro', 'Maggio', '10-05-1996');
INSERT INTO `banca_persona` (`id_persona`, `nome`, `cognome`, `data_nascita`) VALUES ('3', 'Gabriele', 'Musco', '10-05-1996');
INSERT INTO `banca_persona` (`id_persona`, `nome`, `cognome`, `data_nascita`) VALUES ('4', 'Ludovico', 'Trupia', '10-05-1995');

-- DELETE FROM banca_titolarecc WHERE id_conto IN (1,2,3);
INSERT INTO banca_titolarecc VALUES
(1, 3),
(2, 2),
(3, 1);

-- DELETE FROM banca_prodottofinanziario WHERE id_prodotto IN (1,2,3);
INSERT INTO banca_prodottofinanziario VALUES
(1, 1, '10-10-2016', 10, 1),
(2, 2, '10-10-2016', 20, 2),
(3, 3, '10-10-2016', 30, 3);


-- DELETE FROM soluzioni WHERE id IN (1,2,3);
INSERT INTO soluzioni VALUES
(1, 'SELECT id_conto FROM banca_contocorrente CC WHERE NOT EXISTS (SELECT * FROM banca_contocorrente CC1 WHERE CC1.saldo > CC.saldo)'),
(2, 'SELECT id_persona, sum(saldo) FROM banca_contocorrente AS cc NATURAL JOIN banca_titolarecc GROUP BY id_PERSONA HAVING sum(saldo) >= ALL (SELECT sum(saldo) AS saldo_tot FROM banca_contocorrente NATURAL JOIN banca_titolarecc GROUP BY id_PERSONA)'),
(3, 'SELECT id_prodotto FROM banca_prodottofinanziario AS PF WHERE NOT EXISTS (SELECT * FROM banca_prodottofinanziario AS PF1 WHERE PF1.numero_rate > PF.numero_rate)');

-- DELETE FROM domandeSQL WHERE id IN (1,2,3);
INSERT INTO domandeSQL VALUES
(1, 'Trovare il contocorrente con il saldo più alto', 'banca', 1, 2),
(2, 'Trovare la persona che ha il saldo più alto', 'banca', 2, 3),
(3, 'Trovare il prodotto finanziario che ha più rate', 'banca', 3, 2);

-- DELETE FROM domandeALG WHERE id IN (1,2,3);
INSERT INTO domandeALG VALUES
(1, 'Trovare il contocorrente con il saldo più alto', 'banca', 1, 2),
-- (2, 'Trovare la persona che ha il saldo più alto', 'banca', 2, 2),
(3, 'Trovare il prodotto finanziario che ha più rate', 'banca', 3, 2);

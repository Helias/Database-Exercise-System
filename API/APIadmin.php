<?php
session_start();
include "config.php";

$db = new PDO('mysql:host='.$host.';dbname='.$database, $username, $password);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

try {

    //Login "function".
    if ((isset($_GET['username']) && $_GET['username'] != "") &&
        (isset($_GET['password']) && $_GET['password'] != "")
       ) {
        $stmt = $db->query('SELECT * FROM des.utenti WHERE username = "' . $_GET['username'] .'";');
        if ( $stmt->fetchColumn() != "" ) {
            $stmt = $db->query('SELECT * FROM des.utenti WHERE psw = "' . md5($_GET['password']) .'";');
            if ( $stmt->fetchColumn() != "" ) {
                $_SESSION["username"] = $_GET['username'];
                $_SESSION["password"] = md5($_GET['password']);
            }else
                $json = '{ "Error": "Password non corretta!" }';
        }else
            $json = '{ "Error": "Nome utente non esistente!" }';
        header('Content-Type: application/json');
        echo $json;
        return;
    }

    //Blacklist word.
    if (isset($_GET['sql']) && $_GET['sql'] != NULL) {
        $sql = strtolower($_GET['sql']);

        if (strpos($sql, "select") == -1)
            $json = '{ "Error": "Non è stata eseguita una query SELECT!" }';
        else {
            if (   strpos($sql, "delete") > -1
                || strpos($sql, "insert") > -1
                || strpos($sql, "create") > -1
                || strpos($sql, "drop") > -1
                || strpos($sql, "replication") > -1
                || strpos($sql, "replace") > -1
                || strpos($sql, "grant") > -1
                || strpos($sql, "trigger") > -1) {

                $json = '{ "Error": "Non è stata eseguita una query SELECT!" }';

            } else {
                /* TO DO: confronto tra il risultatotra la query soluzione e la query $sql */

                /* Query Utente */
                $stmt = $db->query($sql);

                $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo count($data);

                /* Query souzione */
                $stmt = $db->query("SELECT id_conto FROM banca_contocorrente CC WHERE NOT EXISTS (SELECT * FROM banca_contocorrente CC1 WHERE CC1.saldo > CC.saldo)");

                $data2 = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo " " . count($data2);

                // COUNT : righe

                /*
                foreach($data as $mydata) {
                    var_dump($mydata);
                    foreach($mydata as $d) {
                        echo "<br>";
                        var_dump($d);
                    }
                    echo "<br><br>";
                }
                */

                return;
                $json = json_encode($data);
            }
        }

        header('Content-Type: application/json');
        echo $json;
        return;
    }

    //Check if the user is logged.
    if ( isset($_GET['checklogin']) ) {
        if ( $_SESSION["username"] == "" || $_SESSION["password"] == "" )
            $json = '{ "Error": "Login non effettuato!" }';
    }

    //If user is logged.
    if ( $_SESSION["username"] != "" || $_SESSION["password"] != "" ) {


        //Show all "databases".
        if (isset($_GET['database'])) {
            $stmt = $db->query('SHOW TABLES FROM des');

            $arr = array();

            foreach ($stmt as $dbs) {
            if ( strpos($dbs[0], "_") && !in_array(substr($dbs[0], 0, strpos($dbs[0], "_")), $arr) )
                array_push($arr, substr($dbs[0], 0, strpos($dbs[0], "_")));
            }

            $json = json_encode($arr);
        }

        //Execute query CREATE, ALTER, INSERT.
        if (isset($_GET['query']) && $_GET['query'] != "" && 
            isset($_GET['nameDB']) && $_GET['nameDB'] != ""
            ){
            
            $stmt = $db->query('SHOW TABLES FROM des WHERE Tables_in_des LIKE "' . $_GET['nameDB'] . '_%"');
            if ( $stmt->fetchColumn() == ""){

                $query = explode('|', $_GET['query']);
            
                foreach($query as $q){
                    $sql = strtolower($q);
                    $stmt = $db->query($sql);
                }

                $json = '{ "Success": "Database aggiunto!" }';
            }else
                $json = '{ "Error": "Database già esistente!" }';
        }

        //Show all arguments.
        if ( isset($_GET['arguments']) ) {
            $stmt = $db->query('SELECT * FROM des.argomenti;');
            $json = json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        }

        //Show all solutions.
        if ( isset($_GET['solutions']) &&
            (isset($_GET['argument']) && $_GET['argument'] != "") &&
            (isset($_GET['question']) && $_GET['question'] != "")
           ) {

            $stmt = $db->query('SELECT DISTINCT soluzioni.id, soluzioni.soluzione
                                    FROM ' . $_GET['question'] . ' INNER JOIN soluzioni
                                    WHERE ' . $_GET['question'] . '.argomento = ' . $_GET['argument'] . ' AND ' . $_GET['question'] . '.soluzione = soluzioni.id;');
            $json = json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        }

        //Submit newQuestion, INSERT argomento, soluzioni and domandeALG/SQL.
        function submitNewQuestion($db, $argumentId, $solutionId) {
            $stmt = $db->query("INSERT INTO des." . $_GET['type'] . " (testo,db_connesso,soluzione,argomento)
                                VALUES ('" . $_GET['text'] . "','" . $_GET['db'] . "'," . $solutionId . "," . $argumentId . ");");
            $json = '{ "Success": "Domanda aggiunta!" }';
        }

        function getIdArgument($db){
            $stmt = $db->query("SELECT id FROM des.argomenti WHERE argomento = '" . $_GET['new_argument'] . "';");
            return $stmt->fetchColumn();
        }

        function getIdSolution($db){
            $stmt = $db->query("SELECT id FROM soluzioni WHERE soluzione = '" . $_GET['new_solution'] . "' ");
            return $stmt->fetchColumn();
        }

        if ((isset($_GET['text']) && $_GET['text'] != "") &&
            (isset($_GET['type']) && $_GET['type'] != "") &&
            (isset($_GET['new_argument']) && $_GET['new_argument'] != "") &&
            (isset($_GET['new_solution']) && $_GET['new_solution'] != "") &&
            (isset($_GET['db']) && $_GET['db'] != "")
           ) {

            if ( getIdArgument($db) == "" ){
                if ( getIdSolution($db) == "" ){
                    $stmt = $db->query("INSERT INTO des.argomenti(argomento) VALUES ('" . $_GET['new_argument'] . "') ;");
                    $stmt = $db->query("INSERT INTO des.soluzioni(soluzione) VALUES ('" . $_GET['new_solution'] . "') ;");

                    submitNewQuestion($db, getIdArgument($db), getIdSolution($db));
                }
                else
                    $json = '{ "Error": "Soluzione esistente!" }';
            }
            else
                $json = '{ "Error": "Argomento esistente!" }';
        }

        if ((isset($_GET['text']) && $_GET['text'] != "") &&
            (isset($_GET['type']) && $_GET['type'] != "") &&
            (isset($_GET['ex_argument']) && $_GET['ex_argument'] != "") &&
            (isset($_GET['ex_solution']) && $_GET['ex_solution'] != "") &&
            (isset($_GET['db']) && $_GET['db'] != "")
           )
            submitNewQuestion($db, $_GET['ex_argument'], $_GET['ex_solution']);

        if ((isset($_GET['text']) && $_GET['text'] != "") &&
            (isset($_GET['type']) && $_GET['type'] != "") &&
            (isset($_GET['ex_argument']) && $_GET['ex_argument'] != "") &&
            (isset($_GET['new_solution']) && $_GET['new_solution'] != "") &&
            (isset($_GET['db']) && $_GET['db'] != "")
           ) {

            if ( getIdSolution($db) == "" ) {
                $stmt = $db->query("INSERT INTO des.soluzioni(soluzione) VALUES ('" . $_GET['new_solution'] . "') ;");

                submitNewQuestion($db, $_GET['ex_argument'], getIdSolution($db));
            }
            else
                $json = '{ "Error": "Soluzione esistente!" }';
        }
    } else
        $json = '{ "Error": "Non è stato effettuato il login!" }';

} catch(PDOException $exception) {
    $json = '{ "Error":"' . $exception->getMessage() . '" }';
}

header('Content-Type: application/json');
echo $json;
?>

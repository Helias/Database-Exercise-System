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
        $stmt = $db->query('SELECT * FROM utenti WHERE username = "' . $_GET['username'] .'";');
        if ( $stmt->fetchColumn() != "" ) {
            $stmt = $db->query('SELECT * FROM utenti WHERE psw = "' . md5($_GET['password']) .'";');
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

    //Check if the user is logged.
    if ( isset($_GET['checklogin']) ) {
        if ( $_SESSION["username"] == "" || $_SESSION["password"] == "" )
            $json = '{ "Error": "Login non effettuato!" }';
    }

    //If user is logged.
    if ( $_SESSION["username"] != "" || $_SESSION["password"] != "" ) {


        //Show all "databases".
        if (isset($_GET['database'])) {
            $stmt = $db->query('SHOW TABLES FROM ' . $database);

            $arr = array();

            foreach ($stmt as $dbs) {
                if ( strpos($dbs[0], "_") && !in_array(substr($dbs[0], 0, strpos($dbs[0], "_")), $arr) )
                    array_push($arr, substr($dbs[0], 0, strpos($dbs[0], "_")));
            }

            $json = getJson($arr);
        }

        //Execute query CREATE, ALTER, INSERT.
        if (isset($_GET['query']) && $_GET['query'] != "" &&
            isset($_GET['nameDB']) && $_GET['nameDB'] != ""
           ){

            $stmt = $db->query('SHOW TABLES FROM ' . $database . ' WHERE Tables_in_' . $database . ' LIKE "' . $_GET['nameDB'] . '_%"');
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
            $stmt = $db->query('SELECT * FROM argomenti;');
            $json = getJson($stmt->fetchAll(PDO::FETCH_ASSOC));
        }

        //Show all solutions.
        if ( isset($_GET['solutions']) &&
            (isset($_GET['argument']) && $_GET['argument'] != "") &&
            (isset($_GET['question']) && $_GET['question'] != "")
           ) {

            $stmt = $db->query('SELECT DISTINCT soluzioni.id, soluzioni.soluzione
                                    FROM ' . $_GET['question'] . ' INNER JOIN soluzioni
                                    WHERE ' . $_GET['question'] . '.argomento = ' . $_GET['argument'] . ' AND ' . $_GET['question'] . '.soluzione = soluzioni.id;');
            $json = getJson($stmt->fetchAll(PDO::FETCH_ASSOC));
        }

        //Submit newQuestion, INSERT argomento, soluzioni and domandeALG/SQL.
        function submitNewQuestion($db, $argumentId, $solutionId) {
            $stmt = $db->query("INSERT INTO " . $_GET['type'] . " (testo,db_connesso,soluzione,argomento)
                                VALUES ('" . $_GET['text'] . "','" . $_GET['db'] . "'," . $solutionId . "," . $argumentId . ");");
            $json = '{ "Success": "Domanda aggiunta!" }';
        }

        function getIdArgument($db){
            $stmt = $db->query("SELECT id FROM argomenti WHERE argomento = '" . $_GET['new_argument'] . "';");
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
                    $stmt = $db->query("INSERT INTO argomenti(argomento) VALUES ('" . $_GET['new_argument'] . "') ;");
                    $stmt = $db->query("INSERT INTO soluzioni(soluzione) VALUES ('" . $_GET['new_solution'] . "') ;");

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
                $stmt = $db->query("INSERT INTO soluzioni(soluzione) VALUES ('" . $_GET['new_solution'] . "') ;");

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

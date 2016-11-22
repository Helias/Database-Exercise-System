<?php
include "config.php";

$db = new PDO('mysql:host='.$host.';dbname='.$database, $username, $password);

if (isset($_GET['arguments']))
{
    $stmt = $db->query('SELECT * FROM argomenti');
    $json = getJson($stmt->fetchAll(PDO::FETCH_ASSOC));
    print_json($json);
    return;
}
else if (isset($_GET['exerciseSQL']) && $_GET['exerciseSQL'] != "")
{
    // select all SQL exercises for argument
    $stmt = $db->query('SELECT * FROM domandeSQL WHERE argomento = ' . $_GET['exerciseSQL']);
    $json = getJson($stmt->fetchAll(PDO::FETCH_ASSOC));
    print_json($json);
    return;
}
else if (isset($_GET['exerciseALG']) && $_GET['exerciseALG'] != "")
{
    // select all algebra exercises for argument
    $stmt = $db->query('SELECT * FROM domandeALG WHERE argomento = ' . $_GET['exerciseALG']);
    $json = getJson($stmt->fetchAll(PDO::FETCH_ASSOC));
    print_json($json);
    return;
}
else if (isset($_GET['database'])) {
    // show all "databases"
    $stmt = $db->query('SHOW TABLES FROM ' . $database);

    $arr = array();

    foreach ($stmt as $dbs) {
        if ( strpos($dbs[0], "_") && !in_array(substr($dbs[0], 0, strpos($dbs[0], "_")), $arr) )
            array_push($arr, substr($dbs[0], 0, strpos($dbs[0], "_")));
    }

    $json = getJson($arr);
    print_json($json);
    return;
}
else if (isset($_GET['db_tables']) && $_GET['db_tables'] != "") {
    // show tables from database
    $prefix = $_GET['db_tables'];
    $stmt = $db->query('SHOW TABLES FROM ' . $database . ' WHERE Tables_in_' . $database . ' LIKE "' . $prefix . '_%"');

    $tables = array();

    foreach($stmt as $table) {
        $t = str_replace($prefix . "_", "", $table[0]) . " (";
        $t = strtoupper($t);

        $columns = $db->query("SHOW COLUMNS FROM " . $prefix . "_" . str_replace($prefix . "_", "", $table[0]));
        foreach ($columns as $column) {
            $t .= $column[0] . ", ";
        }
        $t = substr($t, 0, -2) . ")";
        array_push($tables, $t);
    }

    $json = getJson($tables);
    print_json($json);
    return;
}

// Get solution
if (isset($_GET['getSoluzione']) && $_GET['getSoluzione'] != "") {
    $stmt = $db->query("SELECT soluzione FROM soluzioni WHERE id = " . $_GET['getSoluzione']);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $soluzione = $data[0]['soluzione'];

    $stmt = $db->query($soluzione);
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo '[{ "query": "' . $soluzione . '" }, { "results" : ' . getJson($result) . '}]';
    return;
}

//Blacklist word
if (isset($_GET['sql']) && $_GET['sql'] != "" && isset($_GET['soluz']) && $_GET['soluz'] != "") {
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
            || strpos($sql, "show") > -1
            || strpos($sql, "trigger") > -1
            || strpos($sql, "from utenti") > -1
            || strpos($sql, "from argomenti") > -1
            || strpos($sql, "from domandeALG") > -1
            || strpos($sql, "from domandeSQL") > -1
            || strpos($sql, "from soluzioni") > -1) {

            $json = '{ "Error": "Non è stata eseguita una query SELECT!" }';

        } else {

            /* User Query */
            $stmt = $db->query($_GET['sql']);

            if (!$stmt) {
              print_json('{ "Error": "Errore durante l\' esecuzione della query: ' . $db->errorInfo()[2] . '" }');
              return;
            }

            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $json = '[{"results" : ' . getJson($data) . "}, ";

            /* Solution Query */
            $stmt = $db->query("SELECT soluzione FROM soluzioni WHERE id = " . $_GET['soluz']);
            $solution = $stmt->fetchAll(PDO::FETCH_ASSOC)[0]['soluzione'];

            $stmt = $db->query($solution);
            $data2 = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (count($data) != count($data2)) {
                $json .= '{ "Error": "Query sbagliata! Non è stato selezionato lo stesso numero di righe!" }';
            }
            else if (count($data[0]) != count($data2[0])) {
                $json .= '{ "Error": "Query sbagliata! Non sono stati selezionati gli stessi campi e/o numero di colonne!" }';
            } else {

                /* Extract keys associative */
                $keys = array();

                $i = 0;
                foreach ($data[0] as $key => $value) {
                    $keys[$i] = $key;
                    $i++;
                }

                /* Compare the two tables results */
                $rowCompare = array();
                $rowCompare = array_fill(0, count($data), false);

                $fieldCompare = array();

                for ($i = 0; $i < count($data); $i++) {
                    for ($k = 0; $k < count($data2); $k++) {

                        $fieldCompare = array_fill(0, count($keys), false);

                        for ($j = 0; $j < count($keys); $j++) {

                            if ($data[$i][$keys[$j]] == $data2[$k][$keys[$j]]) {
                                $fieldCompare[$j] = true;
                            } else {
                                $fieldCompare[$j] = false;
                                break;
                            }
                        }

                        if (!(in_array(false, $fieldCompare))) {
                            $rowCompare[$i] = true;
                            break;
                        }
                    }
                }

                if (!(in_array(false, $rowCompare)))
                    $json .= '{ "Success": "Esercizio svolto con successo!" }';
                else
                    $json .= '{ "Error": "Query sbagliata! Visualizza la soluzione o il risultato che dovresti ottenere" }';
            }
        }
    }
    $json .= "]";
} else
  $json = '{ "Error": "Errore durante l\' esecuzione della query" }';

header('Content-Type: application/json');
echo $json;
?>

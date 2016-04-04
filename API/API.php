<?php
include "config.php";

$db = new PDO('mysql:host='.$host.';dbname='.$database, $username, $password);

if (isset($_GET['arguments']))
{
    $stmt = $db->query('SELECT * FROM argomenti');
    $json = json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}
else if (isset($_GET['exerciseSQL']) && $_GET['exerciseSQL'] != "")
{
    // select all SQL exercises for argument
    $stmt = $db->query('SELECT * FROM domandeSQL WHERE argomento = ' . $_GET['exerciseSQL']);
    $json = json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}
else if (isset($_GET['exerciseALG']) && $_GET['exerciseALG'] != "")
{
    // select all algebra exercises for argument
    $stmt = $db->query('SELECT * FROM domandeALG WHERE argomento = ' . $_GET['exerciseALG']);
    $json = json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}
else if (isset($_GET['database'])) {
    // show all "databases"
    $stmt = $db->query('SHOW TABLES FROM des');

    $arr = array();

    foreach ($stmt as $dbs) {
        if ( strpos($dbs[0], "_") && !in_array(substr($dbs[0], 0, strpos($dbs[0], "_")), $arr) )
            array_push($arr, substr($dbs[0], 0, strpos($dbs[0], "_")));
    }

    $json = json_encode($arr);
}
else if (isset($_GET['db_tables']) && $_GET['db_tables'] != "") {
    // show tables from database
    $prefix = $_GET['db_tables'];
    $stmt = $db->query('SHOW TABLES FROM des WHERE Tables_in_des LIKE "' . $prefix . '_%"');

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

    $json = json_encode($tables);
}

header('Content-Type: application/json');
echo $json;
?>

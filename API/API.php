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
else if (isset($_GET['exerciseALG']))
{
    // select all algebra exercises for argument
    $stmt = $db->query('SELECT * FROM domandeALG WHERE argomento = ' . $_GET['exerciseALG']);
    $json = json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}
/*else if (isset($_GET['argument'])) && (isset($_GET['textQ'])) && (isset($_GET['resultQuery']))
{
   
    $stmt = $db->query('INSERT INTO des.soluzioni(soluzione) VALUES ('.$_GET['resultQuery'].');');
    $stmt = $db->query('INSERT INTO des.domandeALG(testo,soluzione,argomento) VALUES ('.$_GET['argument'].','.$_GET['textQ'].','.$_GET['resultQuery'].');');
    //$json = json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}*/

header('Content-Type: application/json');
echo $json;
?>

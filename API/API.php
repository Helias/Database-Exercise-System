<?php
include "config.php";

$db = new PDO('mysql:host='.$host.';dbname='.$database, $username, $password);

// table
$stmt = $db->query('SELECT * FROM '.$_GET['table']);
$json = json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

header('Content-Type: application/json');
echo $json;
?>

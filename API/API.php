<?php
include "config.php";

$db = new PDO('mysql:host='.$host.';dbname='.$database, $username, $password);

foreach($db->query('SELECT * FROM argomenti') as $row)
{
    print_r($row);
}

?>

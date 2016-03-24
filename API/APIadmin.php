<?php
    include "config.php";

    $db = new PDO('mysql:host='.$host.';dbname='.$database, $username, $password);

    if ( isset($_GET['arguments']) ) {	
        $stmt = $db->query('SELECT * FROM des.argomenti;');
        $json = json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    if ( isset($_GET['solutions']) && (isset($_GET['argument'])&&$_GET['argument']!= "") && (isset($_GET['question'])&&$_GET['question']!= "") ) { 
        $stmt = $db->query('SELECT DISTINCT soluzioni.id, soluzioni.soluzione 
                            FROM '.$_GET['question'].' INNER JOIN soluzioni 
                            WHERE '.$_GET['question'].'.argomento = '.$_GET['argument'].' AND '.$_GET['question'].'.soluzione = soluzioni.id;');
        $json = json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    function submitNewQuestion($db, $argumentId, $solutionId) {
        $stmt = $db->query('INSERT INTO des.'.$_GET['type'].'(testo,db_connesso,soluzione,argomento) 
                            VALUES (\''.$_GET['text'].'\',\''.$_GET['db'].'\','.$solutionId.','.$argumentId.');');
        $json = json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    function getIdArgument($db){
        $stmt = $db->query('SELECT id FROM des.argomenti WHERE argomento = \''.$_GET['new_argument'].'\';');
        return $stmt->fetchColumn();  
    }  

    function getIdSolution($db){
        $stmt = $db->query('SELECT id FROM soluzioni WHERE soluzione = \''.$_GET['new_solution'].'\' ');
        return $stmt->fetchColumn();    
    }

    if ((isset($_GET['text']) && $_GET['text']!= "") && 
        (isset($_GET['type']) && $_GET['type']!= "") && 
        (isset($_GET['new_argument']) && $_GET['new_argument']!= "") && 
        (isset($_GET['new_solution']) && $_GET['new_solution']!= "") && 
        (isset($_GET['db']) && $_GET['db']!= "") 
        ) {
        
            if ( getIdArgument($db) == "" ){
                if ( getIdSolution($db) == "" ){
                    $stmt = $db->query('INSERT INTO des.argomenti(argomento) VALUES (\''.$_GET['new_argument'].'\') ;'); 
                    $stmt = $db->query('INSERT INTO des.soluzioni(soluzione) VALUES (\''.$_GET['new_solution'].'\') ;');

                    submitNewQuestion($db, getIdArgument($db), getIdSolution($db));
                }
            }

    }

    if ((isset($_GET['text']) && $_GET['text']!= "") && 
        (isset($_GET['type']) && $_GET['type']!= "") && 
        (isset($_GET['ex_argument']) && $_GET['ex_argument']!= "") && 
        (isset($_GET['ex_solution']) && $_GET['ex_solution']!= "") && 
        (isset($_GET['db']) && $_GET['db']!= "") 
        ) {
        
            submitNewQuestion($db, $_GET['ex_argument'], $_GET['ex_solution']);
    }

    if ((isset($_GET['text']) && $_GET['text']!= "") && 
        (isset($_GET['type']) && $_GET['type']!= "") && 
        (isset($_GET['ex_argument']) && $_GET['ex_argument']!= "") && 
        (isset($_GET['new_solution']) && $_GET['new_solution']!= "") && 
        (isset($_GET['db']) && $_GET['db']!= "") 
        ) {
        
            if ( getIdSolution($db) == "" ){
                $stmt = $db->query('INSERT INTO des.soluzioni(soluzione) VALUES (\''.$_GET['new_solution'].'\') ;');

                submitNewQuestion($db, $_GET['ex_argument'], getIdSolution($db));
            }
        
    }

    header('Content-Type: application/json');
    echo $json;
?> 

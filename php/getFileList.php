<?php
    session_start();
    
    if($_SESSION["accessLevel"] !== 'high' && $_SESSION["accessLevel"] !== 'low' ){
        $_SESSION["accessLevel"] = "deny";
        die($_SESSION["accessLevel"]);
    }
    
    if(isset($_POST["uploadPath"])){
        $filesLocation = $_POST["uploadPath"];
    }
    else{
        $filesLocation = '../uploads/';  
    }
    
    $filesArray = scandir($filesLocation);
    $filesString = "";
    foreach($filesArray as $x){
        if($x != "."  and $x != ".." and $x != "index.html"){
            $filesString .= ( $x . "\n");
        }
    }
    exit($filesString);

?>
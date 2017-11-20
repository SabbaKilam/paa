<?php

    session_start();
    
    //only low and high accessLevel can view files
    if($_SESSION["accessLevel"] !== 'high' && $_SESSION["accessLevel"] !== 'low' ){
        $_SESSION["accessLevel"] = "deny";
        die($_SESSION["accessLevel"]);
    }
    
    //set default file location unless proper path is provided by user
    $filesLocation = '../uploads/';    
    if( isset($_POST["uploadPath"]) ){
        $filesLocation = $_POST["uploadPath"];
    }
    
    //gather and concatenate file names except '.', '..', and index.html
    $filesArray = scandir($filesLocation);
    $filesString = "";
    foreach($filesArray as $x){
        if($x != "."  and $x != ".." and $x != "index.html"){
            $filesString .= ( $x . "\n");
        }
    }
    
    //send the user the newline-seperated filename string
    exit($filesString);

?>
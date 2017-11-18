<?php

    session_start();
    
    if($_SESSION["accessLevel"] !== "high"){
        die($_SESSION["accessLevel"]);
    }
    
    //first, reduce file upload restrictions
    ini_set("file_uploads", "On");    
    ini_set("memory_limit", "256M");
    ini_set("upload_max_filesize", "50M");
    ini_set("post_max_size", "50M");
    ini_set("max_execution_time", "60");

    if(isset($_POST["uploadPath"])){
        $filesLocation = $_POST["uploadPath"];
    }
    else{
        $filesLocation = '../uploads/';  
    }

    //get and save file contents to server
    $contents = file_get_contents($_POST['contents']);
    file_put_contents($filesLocation . $_POST['filename'], $contents);

    //collect all the filenames to send back:
    $filesArray = scandir($filesLocation);
    $filesString = "";
    foreach($filesArray as $x){
        if($x != "."  and $x != ".."){
            $filesString .= ( $x . "\n");
        }
    }
    //send back one string of all the filenames (seperated by newlines)
    exit($filesString);

?>
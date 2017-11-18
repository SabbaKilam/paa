<?php
    session_start();
    
    if($_SESSION["accessLevel"] !== 'high' && $_SESSION["accessLevel"] !== 'low' ){
        $_SESSION["accessLevel"] = "deny";
        die($_SESSION["accessLevel"]);
    }
    
    $filename = $_POST['filename'];
    $filesLocation = '../uploads/'; 
    
    if(isset($_POST["uploadPath"])){
        $filesLocation = $_POST["uploadPath"];
    }
    
    if($filename !== 'index.html'){
        unlink($filesLocation . $filename);       
    }

?>
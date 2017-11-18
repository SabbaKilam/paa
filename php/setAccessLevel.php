<?php
    session_start();

    $secretPassword = "rachelle";
    $guestPassword = "guestpassword";
    
    // the three access levels:
    $deny = 'deny';
    $high = 'high';
    $low = 'low';
    
    //set to lowest access level before testing:
    $accessLevel = $deny; // ... to start with, deny access
    $_SESSION["accessLevel"] = $deny;
    
    $userPassword = $_POST['userPassword'];
    //if the password is secret ...
    if($userPassword === $secretPassword){
        $accessLevel = $high;
        $_SESSION["accessLevel"] = $high;        
    }
    else if($userPassword === $guestPassword){
        $accessLevel = $low;
        $_SESSION["accessLevel"] = $low;        
    }
    
    exit($_SESSION["accessLevel"])
?>
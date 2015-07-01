<?php

/* * *
 * http://localhost:8080/pvcloud_backend/account_change_password.php?account_id=1&old_password=1234pass&newpassword=1234otherpass&new_password2=1234otherpass
 * 
 * * */

error_reporting(E_ERROR);

include 'inc/incBaseURL.php';

$url = getClientBaseURL("pvcloud") . "#/";

header("Location: $url");
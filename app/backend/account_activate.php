<?php

/* * *
 * http://localhost:8080/pvcloud_backend/new_account.php?email=jose.a.nunez@gmail.com&nickname=jose&pwdHash=1234pass
 * 
 * * */
error_reporting(E_ERROR);

class newAccountResponse {

    public $status = "";
    public $message = "";

}

require_once './DA/da_conf.php';
require_once './DA/da_helper.php';
require_once './DA/da_account.php';

$email = filter_input(INPUT_GET, "email") ;
$guid = filter_input(INPUT_GET, "guid") ;

$response = new newAccountResponse();
try {
    $activatedAccount = da_account::ActivateAccount($email, $guid);

    if ($activatedAccount != NULL && $activatedAccount->email == $email && $activatedAccount->confirmed == TRUE) {
        $response->status = "OK";
        $response->message = "Account for $email was confirmed successfully.";
    } else {
        $response->status = "ERROR";
        $response->message = "Account Confirmation failed";
    }
} catch (Exception $ex) {
    $response->status = "ERROR";
    $response->message = $ex->getMessage();
}

include './inc/incJSONHeaders.php';
echo json_encode($response);
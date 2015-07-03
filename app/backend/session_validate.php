<?php

/* * *
 * http://localhost:8080/pvcloud_backend/account_authenticate.php?email=jose.a.nunez@gmail.com&pwd=1234pass
 * 
 * * */
error_reporting(E_ERROR);

class simpleResponse {

    public $status = "";
    public $message = "";

}

require_once './DA/da_conf.php';
require_once './DA/da_helper.php';
require_once './DA/da_account.php';
require_once './DA/da_session.php';

/**
 * Validates email + token provcided in query string and returns simpleResponse object with status (OK, ERROR, EXCEPTION) and a message
 * 
 * @return \simpleResponse
 */
function validate() {
    $response = new simpleResponse();
    $account_id = filter_input(INPUT_GET, "account_id");
    $token = filter_input(INPUT_GET, "token");

    try {

        if ($account_id == 0 || $account_id == "" || $account_id == NULL || $token == "" || $token == NULL) {
            $response->status = "ERROR";
            $response->message = "La sesión no es válida. Por favor autentíquese nuevamente";
        } else {
            $session = da_session::GetAndValidateSession($account_id, $token);

            if ($session->account_id == $account_id && $session->token == $token) {
                $response->status = "OK";
                $response->message = "Sesión válida";
            } else {
                $response->status = "ERROR";
                $response->message = "La sesión no es válida. Por favor autentíquese nuevamente";
            }
        }
    } catch (Exception $ex) {
        $response->status = "EXCEPTION";
        $response->message = $ex->getMessage();
    }

    return $response;
}

include './inc/incJSONHeaders.php';
echo json_encode(validate());

<?php

/* * *
 * http://localhost:8080/pvcloud_backend/app_get_list_by_account.php?account_id=1
 * 
 * * */
error_reporting(E_ERROR);

class simpleResponse {

    public $status = "";
    public $message = "";
    public $data = [];

}

require_once './DA/da_conf.php';
require_once './DA/da_helper.php';
require_once './DA/da_account.php';
require_once './DA/da_session.php';
require_once './DA/da_apps_registry.php';

/**
 * 
 * 
 * @return \simpleResponse
 */
function execute() {
    $response = new simpleResponse();
    try {

        include './inc/incWebServiceSessionValidation.php';

        $app_id = filter_input(INPUT_GET, "app_id");

        if ($app_id > 0) {
            $modifiedApp = da_apps_registry::RegenerateApiKey($app_id);
            $response->status = "OK";
            $response->message = "SUCCESS";
            $response->data = $modifiedApp;
        } else {
            $response->status = "ERROR";
            $response->message = "Parámetros Inválidos";
        }
    } catch (Exception $ex) {
        $response->status = "EXCEPTION";
        $response->message = $ex->getMessage();
    }
    return $response;
}

include './inc/incJSONHeaders.php';
echo json_encode(execute());

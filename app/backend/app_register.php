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
        $account_id = 0; $token = 0;
        include './inc/incWebServiceSessionValidation.php';
        
        $appToRegister = new be_app();
        $appToRegister->account_id = $account_id;
        $appToRegister->app_nickname = filter_input(INPUT_GET, "app_nickname");
        $appToRegister->app_description = filter_input(INPUT_GET, "app_description");
        $appToRegister->visibility_type_id = filter_input(INPUT_GET, "visibility_type_id");

        if ($appToRegister->account_id > 0) {
            if ($appToRegister->app_nickname != "") {
                $app = da_apps_registry::RegisterNewApp($appToRegister);
                $response->status = "OK";
                $response->message = "SUCCESS";
                $response->data = $app;
            } else {
                $response->status = "ERROR";
                $response->message = "Parámetro Inválido: Nombre de App";
            }
        } else {
            $response->status = "ERROR";
            $response->message = "Parámetro Inválido: Cuenta de Usuario";
        }
    } catch (Exception $ex) {
        $response->status = "EXCEPTION";
        $response->message = $ex->getMessage();
    }
    return $response;
}

include './inc/incJSONHeaders.php';
echo json_encode(execute());

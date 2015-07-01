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
        $account_id = 0;
        include './inc/incWebServiceSessionValidation.php';
        
        if ($account_id > 0) {
            $apps = da_apps_registry::GetListOfApps($account_id);
            $response->status = "OK";
            $response->message = "SUCCESS";
            $response->data = $apps;
        } else {
            $response->status = "ERROR";
        }
    } catch (Exception $ex) {
        $response->status = "EXCEPTION";
        $response->message = $ex->getMessage();
    }
    return $response;
}

include './inc/incJSONHeaders.php';
echo json_encode(execute());

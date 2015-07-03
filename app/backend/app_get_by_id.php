<?php

/* * *
 * http://localhost:8080/pvcloud_backend/app_get_by_id.php?account_id=1
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

class beParameters {

    public $account_id = 0;
    public $token = "";
    public $app_id = 0;

}

class GetAppWebService {

    public static function RetrieveApp() {
        $response = new simpleResponse();
        
        $parameters = GetAppWebService::collectParameters();
        
        try {
            $account_id = 0;
            include './inc/incWebServiceSessionValidation.php';

            if ($account_id > 0) {
                $apps = da_apps_registry::GetApp($parameters->app_id);
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

    private static function collectParameters() {
        $parameters = new beParameters();
        $parameters->account_id = filter_input(INPUT_GET, "account_id");
        $parameters->token = filter_input(INPUT_GET, "token");
        $parameters->app_id = filter_input(INPUT_GET, "app_id");

        if (!isset($parameters->account_id)) {
            $parameters->account_id = 0;
        }

        if (!isset($parameters->token)) {
            $parameters->token = "";
        }

        if (!isset($parameters->app_id)) {
            $parameters->app_id = 0;
        }
        return $parameters;
    }

}

include './inc/incJSONHeaders.php';
echo json_encode(GetAppWebService::RetrieveApp());

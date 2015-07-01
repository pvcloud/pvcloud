<?php

/* * *
 * http://localhost:8080/pvcloud_backend/page_get_by_id.php?account_id=1&page_id=1&token=f40d375b097ab7254eff566d72adcc2cff1ba913
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

class GetPageWebService {

    public static function RetrievePage() {
        $response = new simpleResponse();
        
        $parameters = GetPageWebService::collectParameters();
        
        try {
            $account_id = 0;
            include './inc/incWebServiceSessionValidation.php';

            if ($account_id > 0) {
                $page = da_apps_registry::GetPage($parameters->page_id);
                $response->status = "OK";
                $response->message = "SUCCESS";
                $response->data = $page;
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
        $parameters->page_id = filter_input(INPUT_GET, "page_id");
        
        if (!isset($parameters->account_id)) {
            $parameters->account_id = 0;
        }

        if (!isset($parameters->token)) {
            $parameters->token = "";
        }

        if (!isset($parameters->app_id)) {
            $parameters->app_id = 0;
        }
        
        if (!isset($parameters->page_id)) {
            $parameters->page_id = 0;
        }
        
        return $parameters;
    }

}

include './inc/incJSONHeaders.php';
echo json_encode(GetPageWebService::RetrievePage());

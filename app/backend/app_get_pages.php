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

class GetPagesWebService {

    public static function GetPages() {
        $response = new simpleResponse();
        include './inc/incWebServiceSessionValidation.php';

        try {
            $parameters = GetPagesWebService::collectParameters();
            $pages = da_apps_registry::GetListOfPages($parameters->app_id);
            $response->status = "OK";
            $response->message = "";
            $response->data = $pages;
        } catch (Exception $ex) {
            $response->status = "EXCEPTION";
            $response->message = $ex->getMessage();
            $response->data = $pages;
        }
        
        return $response;
    }

    private static function collectParameters() {
        $app_id = filter_input(INPUT_GET, "app_id");

        if (!isset($app_id) || !$app_id > 0) {
            die();
        }
        $parameters = new stdClass();
        $parameters->app_id = $app_id;
        return $parameters;
    }

}

include './inc/incJSONHeaders.php';
echo json_encode(GetPagesWebService::GetPages());

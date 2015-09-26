<?php

/* * *
 * http://localhost:8080/pvcloud_backend/app_get_content.php?account_id=1&token=705d5b1c66db66dc1b2c8c96b209b11899337f4c
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
require_once './DA/da_content.php';

class GetContentWebService {

    public static function GetContent() {
        $response = new simpleResponse();
        include './inc/incWebServiceSessionValidation.php';

        try {
            $parameters = GetContentWebService::collectParameters();
            $content = da_content::GetListOfContents(); //Put parameters as needed
            $response->status = "OK";
            $response->message = "";
            $response->data = $content;
        } catch (Exception $ex) {
            $response->status = "EXCEPTION";
            $response->message = $ex->getMessage();
            $response->data = $content;
        }
        
        return $response;
    }

    private static function collectParameters() {
        $parameters = "";
        /*$app_id = filter_input(INPUT_GET, "app_id");

        if (!isset($app_id) || !$app_id > 0) {
            die();
        }
        $parameters = new stdClass();
        $parameters->app_id = $app_id;*/
        return $parameters;
    }

}

include './inc/incJSONHeaders.php';
echo json_encode(GetContentWebService::GetContent());

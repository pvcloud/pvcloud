<?php

/* * *
 * http://localhost:8080/pvcloud/backend/widget_get_list_by_page.php?account_id=1&token=token_goes_here&page_id=16
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
require_once './DA/da_widget_config.php';

class GetWidgetsConfigWebService {

    public static function GetWidgetConfigs() {
        $response = new simpleResponse();
        //include './inc/incWebServiceSessionValidation.php';
        //$response =  '{"name": "aa"}';
        try {
             $parameters = GetWidgetsConfigWebService::collectParameters();
             $widgetConfigs = da_widget_config::GetWidgetConfigListByID($parameters->widget_id);
             $response->status = "OK";
             $response->message = "";
             $response->data = $widgetConfigs;
        } catch (Exception $ex) {
            $response->status = "EXCEPTION";
            $response->message = $ex->getMessage();
            $response->data = $widgetConfigs;
        }
        
        return $response;
    }

    private static function collectParameters() {
        $widget_id = filter_input(INPUT_GET, "widget_id");

        if (!isset($widget_id) || !$widget_id > 0) {
            die();
        }
        $parameters = new stdClass();
        $parameters->widget_id = $widget_id;
        return $parameters;
    }

}

include './inc/incJSONHeaders.php';

echo json_encode(GetWidgetsConfigWebService::GetWidgetConfigs());

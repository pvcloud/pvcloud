<?php

/* * *
 * http://localhost:8080/pvcloud/backend/widget_page_get_by_id.php?account_id=1&token=token_goes_here&widget_id=1
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
require_once './DA/da_widgets.php';
require_once './DA/da_apps_registry.php';

class WebService {

    public static function GetData() {
        $response = new simpleResponse();
        include './inc/incWebServiceSessionValidation.php';

        try {
            $parameters = WebService::collectParameters();
            $widget = da_widgets::GetWidget($parameters->widget_id);
            $page = da_apps_registry::GetPage($widget->page_id);
            $response->status = "OK";
            $response->message = "";
            $response->data = new stdClass();
            $response->data->widget = $widget;
            $response->data->page = $page;
        } catch (Exception $ex) {
            $response->status = "EXCEPTION";
            $response->message = $ex->getMessage();
            $response->data = new stdClass();
            $response->data->widget = $widget;
            $response->data->page = $page;
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
echo json_encode(WebService::GetData());

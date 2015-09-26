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
require_once './DA/da_widgets.php';

class GetWidgetsWebService {

    public static function GetWidget() {
        $response = new simpleResponse();
        include './inc/incWebServiceSessionValidation.php';

        try {
            $parameters = GetWidgetsWebService::collectParameters();
            $widget = da_widgets::GetWidget($parameters->widget_id);
            //$widget = da_widgets::GetWidgetsOfPage($parameters->widget_id);
            $response->status = "OK";
            $response->message = "";
           //$response->data = $widget;
           $response->data = $widget;
        } catch (Exception $ex) {
            $response->status = "EXCEPTION";
            $response->message = $ex->getMessage();
            $response->data = $widget;
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
echo json_encode(GetWidgetsWebService::GetWidget());

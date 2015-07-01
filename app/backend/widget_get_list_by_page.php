<?php

/* * *
 * http://localhost:8080/pvcloud_backend/widget_get_list_by_page.php?account_id=1&token=token_goes_here&page_id=16
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

    public static function GetWidgets() {
        $response = new simpleResponse();
        include './inc/incWebServiceSessionValidation.php';

        try {
            $parameters = GetWidgetsWebService::collectParameters();
            $widgets = da_widgets::GetWidgetsOfPage($parameters->page_id);
            $response->status = "OK";
            $response->message = "";
            $response->data = $widgets;
        } catch (Exception $ex) {
            $response->status = "EXCEPTION";
            $response->message = $ex->getMessage();
            $response->data = $widgets;
        }
        
        return $response;
    }

    private static function collectParameters() {
        $page_id = filter_input(INPUT_GET, "page_id");

        if (!isset($page_id) || !$page_id > 0) {
            die();
        }
        $parameters = new stdClass();
        $parameters->page_id = $page_id;
        return $parameters;
    }

}

include './inc/incJSONHeaders.php';
echo json_encode(GetWidgetsWebService::GetWidgets());

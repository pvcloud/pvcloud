<?php

//TEST: http://localhost:8080/pvcloud_backend/vse_get_values.php?account_id=1&widget_id=1&api_key=c55452a9bdacdc0dc15919cdfe8d8f7d4c05ac5e&optional_label=DIRECT+TEST&optional_max_limit=0
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
require_once './DA/da_vse_data.php';

/**
 * 
 * 
 * @return be_vse_data
 */
function execute() {
    $response = new simpleResponse();
    $entries = null;
    try {
        $access = "RO";
        include './inc/incWebServiceAPIKeyValidation.php';

        $parameters = collectParameters();

        if (validate($parameters)) {
            $entries = da_vse_data::GetEntriesForWidget($parameters->widget_id, $parameters->optional_max_limit, $parameters->last_entry_id);
            $response->status = "OK";
            $response->message = "SUCCESS";
            $response->data = $entries;
        } else {
            $response->status = "ERROR";
            //die("Parámetros Inválidos");
        }
    } catch (Exception $ex) {
        $response->status = "EXCEPTION";
        $response->message = $ex->getMessage();
        //die("EXCEPTION " . $ex->getCode());
    }
    return $response;
}

function collectParameters() {
    $parameters = new stdClass();
    $parameters->widget_id = filter_input(INPUT_GET, "widget_id");
    $parameters->optional_max_limit = filter_input(INPUT_GET, "optional_max_limit");
    $parameters->last_entry_id = filter_input(INPUT_GET, "last_entry_id");

    if (!isset($parameters->last_entry_id) || $parameters->last_entry_id == NULL)
        $parameters->last_entry_id = '';
    if (!isset($parameters->optional_max_limit) || $parameters->optional_max_limit == NULL || !is_numeric($parameters->optional_max_limit))
        $parameters->optional_max_limit = 0;

    return $parameters;
}

function validate($parameters) {
    if (is_numeric($parameters->widget_id) && $parameters->widget_id > 0) {
        if (is_numeric($parameters->optional_max_limit) && $parameters->optional_max_limit >= 0) {
            return true;
        }
    }

    return false;
}

include './inc/incJSONHeaders.php';
echo json_encode(execute());

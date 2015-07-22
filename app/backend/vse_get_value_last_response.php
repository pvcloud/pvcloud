<?php
//TEST: http://localhost:8080/pvcloud/backend/vse_get_value_last.php?account_id=1&app_id=1&api_key=c55452a9bdacdc0dc15919cdfe8d8f7d4c05ac5e&optional_label=DIRECT+TEST
error_reporting(E_ERROR);

require_once './DA/da_conf.php';
require_once './DA/da_helper.php';
require_once './DA/da_account.php';
require_once './DA/da_session.php';
require_once './DA/da_apps_registry.php';
require_once './DA/da_vse_data.php';

include_once './inc/incJSONHeaders.php';
include_once './inc/incBaseURL.php';

class simpleResponse {

    public $status = "";
    public $message = "";
    public $data = null;

}

/**
 * 
 * 
 * @return be_vse_data
 */
function execute() {
    $result = new simpleResponse();
    $result->status = "OK";
    $result->message = "SUCCESS";
    try {
        $access = "RO";  
        include './inc/incWebServiceAPIKeyValidation.php';

        $parameters = collectParameters();

        if (validate($parameters)) {
            $result->data = da_vse_data::GetLastEntry($parameters->app_id, $parameters->optional_vse_label);
            $result->status = "OK";
            $result->message = "SUCCESS";
        } else {
            //die("Parámetros Inválidos");
            $result->status = "ERROR";
            $result->message = "ERROR";
            
        }
    } catch (Exception $ex) {
         $result->status = "EXCEPTION";
         $result->message = "EXCEPTION";
        
    }

    return $result;
}

function collectParameters() {
    $parameters = new stdClass();
    $parameters->app_id = filter_input(INPUT_GET, "app_id");
    $parameters->optional_vse_label = filter_input(INPUT_GET, "optional_label");

    if (!isset($parameters->optional_vse_label) || $parameters->optional_vse_label == NULL) {
        $parameters->optional_vse_label = '';
    }

    return $parameters;
}

function validate($parameters) {
    if (is_numeric($parameters->app_id) && $parameters->app_id > 0) {
        if (is_string($parameters->optional_vse_label)) {
            return true;
        }
    }

    return false;
}

include './inc/incJSONHeaders.php';
echo json_encode(execute());

<?php

//TEST: http://localhost:8080/pvcloud/backend/vse_clear_values.php?account_id=1&app_id=1&api_key=c55452a9bdacdc0dc15919cdfe8d8f7d4c05ac5e&optional_label=DIRECT+TEST
error_reporting(E_ERROR);

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
    $entries = new be_vse_data();
    try {
        $access = "RW";  
        include './inc/incWebServiceAPIKeyValidation.php';

        $parameters = collectParameters();

        if (validate($parameters)) {
            $entries = da_vse_data::ClearEntries($parameters->app_id, $parameters->optional_label);
        } else {
            die("Parámetros Inválidos");
        }
    } catch (Exception $ex) {
        die("EXCEPTION " . $ex->getCode());
    }
    return $entries;
}

function collectParameters() {
    $parameters = new stdClass();
    $parameters->app_id = filter_input(INPUT_GET, "app_id");
    $parameters->optional_label = filter_input(INPUT_GET, "optional_label");

    if (!isset($parameters->optional_label) || $parameters->optional_label == NULL) {
        $parameters->optional_label = '';
    }

    return $parameters;
}

function validate($parameters) {
    if (is_numeric($parameters->app_id) && $parameters->app_id > 0) {
        if (is_string($parameters->optional_label)) {
            return true;
        }
    }

    return false;
}

include './inc/incJSONHeaders.php';
echo json_encode(execute());

<?php

//TEST: http://localhost:8080/pvcloud_backend/vse_add_value.php?account_id=1&app_id=1&api_key=c55452a9bdacdc0dc15919cdfe8d8f7d4c05ac5e&label=DIRECT+TEST&value=ANY+THING&type=STRING&captured_datetime=2014-12-09+21:01

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
    $registeredEntry = new be_vse_data();
    try {
        $access = "RW";  
        include './inc/incWebServiceAPIKeyValidation.php';

        $entryToAdd = new be_vse_data;
        $entryToAdd->app_id = filter_input(INPUT_GET, "app_id");
        $entryToAdd->vse_label = filter_input(INPUT_GET, "label");
        $entryToAdd->vse_value = filter_input(INPUT_GET, "value");
        $entryToAdd->vse_type = filter_input(INPUT_GET, "type");
        $entryToAdd->vse_annotations = filter_input(INPUT_GET, "annotations");
        $entryToAdd->captured_datetime = filter_input(INPUT_GET, "captured_datetime");

        if (!isset($entryToAdd->captured_datetime) || $entryToAdd->captured_datetime =='') {
            $dateX = new DateTime();
            
            $entryToAdd->captured_datetime = $dateX->format("Y-m-d H:i:s.u");
        }

        if (validate($entryToAdd)) {
            $registeredEntry = da_vse_data::AddEntry($entryToAdd);
        } else {
            die("Parámetros Inválidos");
        }
    } catch (Exception $ex) {
        die("EXCEPTION " . $ex->getCode());
    }
    return $registeredEntry;
}

function validate($entry) {
    $capturedDateTime = date_parse($entry->captured_datetime);
    $capturedDateTimeIsValid = false;
    if ($capturedDateTime["error_count"] == 0 && checkdate($capturedDateTime["month"], $capturedDateTime["day"], $capturedDateTime["year"])) {
        $capturedDateTimeIsValid = true;
    } else {
        $capturedDateTimeIsValid = false;
    }

    if ($entry->app_id > 0 && $capturedDateTimeIsValid == true) {
        return true;
    }
    return false;
}

include './inc/incJSONHeaders.php';
echo json_encode(execute());

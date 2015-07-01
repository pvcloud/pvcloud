<?php
error_reporting(E_ERROR);

require_once './DA/da_conf.php';
require_once './DA/da_helper.php';
require_once './DA/da_account.php';
require_once './DA/da_session.php';
require_once './DA/da_apps_registry.php';

function collectParameters() {
    $parameters = new stdClass();
    $parameters->app_id = filter_input(INPUT_GET, "app_id");
    $parameters->account_id = filter_input(INPUT_GET, "account_id");
    $parameters->api_key = filter_input(INPUT_GET, "api_key");


    $parameters->baseURL = getBaseURL(true);

    return $parameters;
}

function validate($parameters) {
    if (is_numeric($parameters->app_id) 
            && $parameters->app_id > 0 
            && is_numeric($parameters->account_id) 
            && $parameters->account_id > 0 
            && is_string($parameters->api_key)) {
        return true;
    }
    return false;
}

function setDownloadableJSHeaders() {
    header('Content-Type: application/js');
    header('Content-Disposition: attachment; filename="pvcloud_api.js"');
}

function getBaseURL($forceHTTPS) {
    $server_https = filter_input(INPUT_SERVER, "HTTPS");
    $server_port = filter_input(INPUT_SERVER, "SERVER_PORT");
    $protocol = (!empty($server_https) && $server_https !== 'off' || $server_port == 443) ? "https://" : "http://";
    //OVERRIDE CALLERS PROTOCOL TO HTTPS
    if ($forceHTTPS) {
        $protocol = "https://";
    }
    $domainName = filter_input(INPUT_SERVER, "HTTP_HOST") . "/";
    return $protocol . $domainName . "pvcloud_backend/";
}

function execute() {
    try {
        $access = "RW"; 
        include './inc/incWebServiceAPIKeyValidation.php';

        $parameters = collectParameters();

        if (validate($parameters)) {
            setDownloadableJSHeaders();
        } else {
            die("Parámetros Inválidos");
        }
    } catch (Exception $ex) {
        die("EXCEPTION " . $ex->getCode());
    }
    return $parameters;
}

$parameters = execute();
$script = file_get_contents("inc/pvcloud_template.js");
echo($script);
echo (" exports.API = pvCloudModule($parameters->app_id, '$parameters->api_key',$parameters->account_id, '$parameters->baseURL' );\n\r");

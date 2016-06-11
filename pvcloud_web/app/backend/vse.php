<?php

error_reporting(E_ERROR);

require_once 'vendor/autoload.php';

require_once './DA/da_conf.php';
require_once './DA/da_helper.php';
require_once './DA/da_account.php';
require_once './DA/da_apps_registry.php';
require_once './DA/da_session.php';
require_once './DA/da_vse_data.php';

require_once './BL/BL_Authentication.php';
require_once './BL/BL_ConstantsAndUtils.php';
require_once './BL/SimpleResponse.php';
require_once './BL/BL_AppConnect_Simple.php';
require_once './BL/BL_AppData.php';

$app = new \Slim\App();


/**
 * Connects to a specific app through provided authentication means: account_descriptor, app_descriptor, secret, device_name
 */
$app->post("/connect", function() {


    $parameters = new stdClass();
    $parameters->account_descriptor = filter_input(INPUT_POST, "account_descriptor");
    $parameters->app_descriptor = filter_input(INPUT_POST, "app_descriptor");
    $parameters->secret = filter_input(INPUT_POST, "secret");
    $parameters->device_name = filter_input(INPUT_POST, "device_name");

    $response = BL_AppConnect_Simple::Connect($parameters);


    include './inc/incJSONHeaders.php';
    setcookie("loginResult", json_encode($response));
    echo json_encode($response);
});

/**
 * Connects to a specific app through provided authentication means: account_descriptor, app_descriptor, secret, device_name 
 */
$app->get("/connect/{account_descriptor}/{app_descriptor}/{secret}/{device_name}", function($req, $rsp, $args) {
    
    $parameters = new stdClass();
    $parameters->account_descriptor = $args["account_descriptor"];
    $parameters->app_descriptor = $args["app_descriptor"];
    $parameters->secret = $args["secret"];
    $parameters->device_name = $args["device_name"];

    $response = BL_AppConnect_Simple::Connect($parameters);

    include './inc/incJSONHeaders.php';
    setcookie("loginResult", json_encode($response));
    echo json_encode($response);
});


/**
 * Retrieve last record of an app_id. Authenticate by key
 */
$app->get('/appdata/{app_id}/{key}', function($request, $response, $args) {
    $result = BL_AppData::Read($args['app_id'], $args['key']);

    include './inc/incJSONHeaders.php';
    echo json_encode($result);
});

/**
 * Retrieve last record of an app_id for a given label. Authenticate by key
 */
$app->get('/appdata/{app_id}/{key}/{label}', function($request, $response, $args) {
    $result = BL_AppData::Read($args['app_id'], $args['key'], $args['label']);

    include './inc/incJSONHeaders.php';
    echo json_encode($result);
});

/**
 * Retrieve list of most recent record of an app_id for a given label up to count. Authenticate by key
 */
$app->get('/appdata/{app_id}/{key}/{label}/{count}', function($request, $response, $args) {
    $result = BL_AppData::Read($args['app_id'], $args['key'], $args['label'], $args['count']);

    include './inc/incJSONHeaders.php';
    echo json_encode($result);
});

/**
 * Saves data to an app. Authenticate by element key. Parameters in POST body include  label, value and captured_datetime
 */
$app->post('/appdata/{app_id}/{key}', function($request, $response, $args) {
    $label = filter_input(INPUT_POST, "label");
    $value = filter_input(INPUT_POST, "value");
    $captured_datetime = filter_input(INPUT_POST, "captured_datetime");
    $result = BL_AppData::Write($args['app_id'], $args['key'], $label, $value, $captured_datetime);

    include './inc/incJSONHeaders.php';
    echo json_encode($result);
});

/**
 * Saves data to an app. Authenticate by element key. 
 */
$app->get('/appdata_write_get/{app_id}/{key}/{label}/{value}', function($request, $response, $args) {

    $result = BL_AppData::Write(
                    $args['app_id'], $args['key'], $args['label'], $args['value']
    );

    include './inc/incJSONHeaders.php';
    echo json_encode($result);
});

/**
 * Saves data to an app. Authenticate by element key. Using GET method.
 */
$app->get('/appdata_write_get/{app_id}/{key}/{label}/{value}/{captured_datetime}', function($request, $response, $args) {
    $result = BL_AppData::Write(
                    $args['app_id'], $args['key'], $args['label'], $args['value'], $args['captured_datetime']
    );

    include './inc/incJSONHeaders.php';
    echo json_encode($result);
});

/**
 * Deletes last record of an app for a given label. Authenticate through key
 */
$app->delete('/appdata/{app_id}/{key}/{return_deleted_data}', function($request, $response, $args) {
    $app_id = $args['app_id'];
    $key = $args['key'];
    $return_deleted_data = $args['return_deleted_data'];
    $label = $args['label'];
    $count = $args['count'];

    $result = BL_AppData::Delete($app_id, $key, $return_deleted_data, $label, $count);

    include './inc/incJSONHeaders.php';
    echo json_encode($result);
});

/**
 * Deletes last record of an app for a given label. Authenticate through key
 */
$app->delete('/appdata/{app_id}/{key}/{return_deleted_data}/{label}', function($request, $response, $args) {

    $app_id = $args['app_id'];
    $key = $args['key'];
    $return_deleted_data = $args['return_deleted_data'];
    $label = $args['label'];
    $count = $args['count'];

    $result = BL_AppData::Delete($app_id, $key, $return_deleted_data, $label, $count);

    include './inc/incJSONHeaders.php';
    echo json_encode($result);
});

/**
 * Deletes last number of records of an app (defined by count) for a given label. Authenticate through key
 */
$app->delete('/appdata/{app_id}/{key}/{return_deleted_data}/{label}/{count}', function($request, $response, $args) {
    $app_id = $args['app_id'];
    $key = $args['key'];
    $return_deleted_data = $args['return_deleted_data'];
    $label = $args['label'];
    $count = $args['count'];

    $result = BL_AppData::Delete($app_id, $key, $return_deleted_data, $label, $count);

    include './inc/incJSONHeaders.php';
    echo json_encode($result);
});

/**
 * Uploads a file to an app for a given label. Authenticate by key. Post body includes label and captured_datetime.
 */
$app->post('/appfiles/{app_id}/{key}', function($request, $response, $args) {
    $label = filter_input(INPUT_POST, "label");
    $captured_datetime = filter_input(INPUT_POST, "captured_datetime");

    $result = BL_AppData::SaveFile($args['app_id'], $args['key'], $label, $captured_datetime);

    include './inc/incJSONHeaders.php';
    echo json_encode($result);
});

/**
 * Dummy test. Returns provided ID in JSON format.
 */
$app->get('/test/{id}', function($request, $response, $args) {
    $result = new stdClass();
    $result->id = $args['id'];
    include './inc/incJSONHeaders.php';
    echo json_encode($result);
});

$app->run();

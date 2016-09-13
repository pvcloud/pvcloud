<?php

error_reporting(E_ERROR);

require_once 'vendor/autoload.php';

require_once './DA/da_conf.php';
require_once './DA/da_helper.php';
require_once './DA/da_account.php';
require_once './DA/da_apps_registry.php';
require_once './DA/da_session.php';
require_once './DA/da_vse_data.php';

require_once './DA/da_widgets.php';

require_once './BL/BL_Authentication.php';
require_once './BL/BL_ConstantsAndUtils.php';
require_once './BL/SimpleResponse.php';
require_once './BL/BL_AppConnect_Simple.php';
require_once './BL/BL_AppData.php';
require_once './BL/BL_Widgets.php';

$app = new \Slim\App();

/**
 * Connects to a specific app through provided authentication means: account_descriptor, app_descriptor, secret, device_name
 */
$app->post("/widget_add", function($request, $response, $args) {

    include './inc/incJSONHeaders.php';

    $response->getBody()->write(json_encode(BL_Widgets::AddWidget()));
    return $response;
});

$app->run();
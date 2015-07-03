<?php

//$access is defined in the implementator of this include
if ($access != "RO") {
    $access = "RW";
}

$account_id = filter_input(INPUT_GET, "account_id");
$app_id = filter_input(INPUT_GET, "app_id");
$api_key = filter_input(INPUT_GET, "api_key");
$validation = FALSE;

if (!isset($api_key)) {
    $api_key = "";
}

if (!isset($app_id) || !isset($account_id)) {
    die();
}

$app = da_apps_registry::GetApp($app_id);

if ($app->visibility_type_id == 3 && $access == "RO") { // 3 = Public App doesnt require api key for RO vse services
    $validation = $account_id == $app->account_id;
} else {
    $validation = ($account_id == $app->account_id) && $api_key == $app->api_key;
}

if ($validation == FALSE) {
    die();
}
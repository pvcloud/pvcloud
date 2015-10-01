<?php

$host = $_SERVER["SERVER_NAME"];
$port = $_SERVER["SERVER_PORT"];

$app_id=1;
$account_id=1;
$api_key="09b508f1bdc25b6ec65af3f9b9d1eb357b87776d";
$optional_label="TEST";
$endpoint = "vse_get_value_last.php";

$url="$host:$port/pvcloud_pre/backend/$endpoint?account_id=$account_id&app_id=$app_id&api_key=$api_key&optional_lable=$optional_label";
if($port==8080 || $port==80){
    $url="http://$url";
} else {
    $url="https://$url";
}

echo($url);

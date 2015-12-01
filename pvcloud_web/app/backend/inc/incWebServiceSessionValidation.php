<?php

if ($parameters->account_id > 0)
    $account_id = $parameters->account_id;
else
    $account_id = filter_input(INPUT_GET, "account_id");

if ($parameters->token != "")
    $token = $parameters->token;
else
    $token = filter_input(INPUT_GET, "token");

$session = da_session::GetAndValidateSession($account_id, $token);

if ($session == NULL) {
    die("Invalid Session");
}
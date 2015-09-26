<?php

$account_id = filter_input(INPUT_GET, "account_id");
$token = filter_input(INPUT_GET, "token");

$session = da_session::GetAndValidateSession($account_id, $token);

if ($session == NULL) {
    die("Invalid Session");
}
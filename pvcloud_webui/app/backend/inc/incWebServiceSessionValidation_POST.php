<?php
$rawPOSTContent = file_get_contents('php://input');
$decodedPOSTParams = json_decode($rawPOSTContent);

$account_id = $decodedPOSTParams->account_id;
$token = $decodedPOSTParams->token;


$session = da_session::GetAndValidateSession($account_id, $token);

if ($session == NULL) {
    die("Invalid Session");
}
<?php

/* * *
 * http://localhost:8080/pvcloud/backend/invitation_enabled.php?account_id=1
 * 
 * * */
error_reporting(E_ERROR);

class simpleResponse {

    public $invitation_enabled = false;

}

require_once './DA/da_conf.php';
require_once './DA/da_invitation.php';

class InvitationEnabledWebService {

    public static function GetIfInvitationIsEnabled() {

        $response = new simpleResponse();
        
        $parameters = InvitationEnabledWebService::collectParameters();
        
        try {
            $account_id = 0;
            include './inc/incWebServiceSessionValidation.php';

            if ($account_id > 0) {
                $apps = da_invitation::GetInvitationAvailability($parameters->account_id);
                $response->status = "OK";
                $response->message = "SUCCESS";
                $response->data = $apps;
            } else {
                $response->status = "ERROR";
            }
        } catch (Exception $ex) {
            $response->status = "EXCEPTION";
            $response->message = $ex->getMessage();
        }
        return $response;
    }

    private static function collectParameters() {
        $parameters = new beParameters();
        $parameters->account_id = filter_input(INPUT_GET, "account_id");
        $parameters->token = filter_input(INPUT_GET, "token");

        if (!isset($parameters->account_id)) {
            $parameters->account_id = 0;
        }

        if (!isset($parameters->token)) {
            $parameters->token = "";
        }

        if (!isset($parameters->app_id)) {
            $parameters->app_id = 0;
        }
        return $parameters;
    }

}

include './inc/incJSONHeaders.php';
echo json_encode(AddInvitationWebService::GetInvitationAvailability());

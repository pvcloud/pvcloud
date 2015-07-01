<?php

error_reporting(E_ERROR);

require_once './DA/da_conf.php';
require_once './DA/da_helper.php';

require_once './DA/da_account.php';
require_once './DA/da_session.php';
require_once './inc/SimpleResponse.php';


class LogoutWebService {

    /**
     * 
     * @return be_session
     */
    public static function DoLogout() {
        try {
            $response = new SimpleResponse();

            $parameters = LogoutWebService::collectParameters();

            if (LogoutWebService::parametersAreValid($parameters)) {
                $response = LogoutWebService::executeLogout($parameters);
            } else {
                $response->status = "ERROR";
                $response->message = "Solicitud inválida. Por favor autentíquese nuevamente";
            }
        } catch (Exception $ex) {
            $response->status = "EXCEPTION";
            $response->message = $ex->getMessage();
        }

        return response;
    }

    private static function collectParameters() {
        $parameters = new stdClass();
        $parameters->account_id = filter_input(INPUT_GET, "account_id");
        $parameters->token = filter_input(INPUT_GET, "token");
        return $parameters;
    }

    private static function parametersAreValid($parameters) {
        return !($parameters->account_id == 0 || $parameters->account_id == "" || $parameters->account_id == NULL || $parameters->token == "" || $parameters->token == NULL);
    }

    private static function resultIsValid($session, $parameters) {
        return $session->account_id == $parameters->account_id && $session->token == $parameters->token;
    }

    private static function executeLogout($parameters) {
        $session = da_session::Logout($parameters->account_id, $parameters->token);
        if (LogoutWebService::resultIsValid($session, $parameters)) {
            $response->status = "OK";
            $response->message = "LOGOUT OK";
        } else {
            $response->status = "ERROR";
            $response->message = "El proceso de Logout falló";
        }
    }
}

$result = LogoutWebService::DoLogout();

include './inc/incJSONHeaders.php';
echo json_encode($result);
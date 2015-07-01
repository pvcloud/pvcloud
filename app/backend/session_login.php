<?php

error_reporting(E_ERROR);

require_once './DA/da_conf.php';
require_once './DA/da_helper.php';

require_once './DA/da_account.php';
require_once './DA/da_session.php';
require_once './inc/SimpleResponse.php';

class LoginWebService {

    /**
     * 
     * @return be_session
     */
    public static function DoLogin() {

        try {
            $parameters = LoginWebService::collectParameters();
            
            if (LoginWebService::parametersAreValid($parameters)) {
                $account = da_account::GetAccount($parameters->email);
                $response = LoginWebService::authenticationResult($account, $parameters);
            } else {
                $response->status = "Error";
                $response->message = "Parámetros Inválidos";
            }
        } catch (Exception $ex) {
            $response->status = "EXCEPTION";
            $response->message = $ex->getMessage();
        }

        return $response;
    }

    /**
     * 
     * @param be_account $account
     * @return be_session
     * @throws Exception
     */
    private static function getValidSession($account) {
        $session = da_session::CreateSession($account->account_id);
        if (LoginWebService::sessionIsValid($session)) {
            return $session;
        } else {
            throw new Exception("Ocurrió un error al crear su sesión");
        }
    }

    private static function collectParameters() {
        $parameters = new stdClass();
        $parameters->email = filter_input(INPUT_GET, "email");
        $parameters->password = filter_input(INPUT_GET, "pwd");
        return $parameters;
    }

    private static function parametersAreValid($parameters) {
        return !($parameters->email == NULL || $parameters->email == "" || $parameters->password == NULL || $parameters->password == "");
    }

    private static function resultIsValid($session, $parameters) {
        return $session->account_id == $parameters->account_id && $session->token == $parameters->token;
    }

    private static function authenticationResult($account, $parameters) {
        $response = new SimpleResponse();

        if ($account->email == $parameters->email && sha1($parameters->password) == $account->pwd_hash) {
            $session = LoginWebService::getValidSession($account);
            $response->status = "OK";
            $response->data = $session;
            $response->data->email = $account->email;
        } else {
            $response->status = "ERROR";
            $response->message = "Credenciales equivocadas";
        }
        return $response;
    }

    /**
     * 
     * @param be_session $session
     * @return boolean
     */
    private static function sessionIsValid($session) {
        return $session->account_id > 0 && $session->token != "" && $session != NULL;
    }

}

$result = LoginWebService::DoLogin();

include './inc/incJSONHeaders.php';
echo json_encode($result);

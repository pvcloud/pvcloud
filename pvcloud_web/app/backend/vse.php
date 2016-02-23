<?php

error_reporting(E_ERROR);

require_once 'vendor/autoload.php';

require_once './DA/da_conf.php';
require_once './DA/da_helper.php';

require_once './DA/da_account.php';
require_once './DA/da_apps_registry.php';
require_once './DA/da_session.php';
require_once './inc/SimpleResponse.php';

$app = new \Slim\Slim();

$app->post('/login', function () {
    $loginResult = LoginHelper::DoLogin();
    include './inc/incJSONHeaders.php';
    setcookie("loginResult", json_encode($loginResult));
    echo json_encode($loginResult);
});

$app->post("/connect", function() {

    $connectResult = AppConnectHelper::AppConnect();
    
    include './inc/incJSONHeaders.php';
    setcookie("loginResult", json_encode($connectResult));
    echo json_encode($connectResult);
});
$app->run();

class LoginHelper {

    /**
     * 
     * @return be_session
     */
    public static function DoLogin() {

        try {
            $parameters = LoginHelper::collectParameters();

            if (LoginHelper::parametersAreValid($parameters)) {
                $account = da_account::GetAccount($parameters->email);
                $response = LoginHelper::authenticationResult($account, $parameters);
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
        if (LoginHelper::sessionIsValid($session)) {
            return $session;
        } else {
            throw new Exception("Ocurrió un error al crear su sesión");
        }
    }

    private static function collectParameters() {
        $parameters = new stdClass();
        $parameters->email = filter_input(INPUT_POST, "email");
        $parameters->password = filter_input(INPUT_POST, "pwd");
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
            $session = LoginHelper::getValidSession($account);
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

class AppConnectHelper {

    public static function AppConnect() {
        $response = new SimpleResponse();

        try {
            $parameters = AppConnectHelper::collectParameters();

            if (AppConnectHelper::parametersAreValid($parameters)) {
                $response->status = "OK";
                $response->message = "";                
                $response->data = AppConnectHelper::doAppConnect($parameters->account_id, $parameters->token, $parameters->element_key, $parameters->app_id, $parameters->app_name);
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

    private static function collectParameters() {
        $parameters = new stdClass();
        $parameters->account_id = filter_input(INPUT_POST, "account_id");
        $parameters->token = filter_input(INPUT_POST, "token");
        $parameters->element_key = filter_input(INPUT_POST, "element_key");
        $parameters->app_id = filter_input(INPUT_POST, "app_id");
        $parameters->app_name = filter_input(INPUT_POST, "app_name");
        return $parameters;
    }

    private static function parametersAreValid($parameters) {
        if ($parameters->account_id > 0 && ($parameters->token != "" || $parameters->element_key != "")) {
            if ($parameters->app_id > 0  || $parameters->app_name != "") {
                return true;
            }
        }

        return false;
    }

    private static function doAppConnect($account_id, $token, $element_key, $app_id, $app_name) {
        $result = new be_ConnectResult();
        $elementAuthentication = AppConnectHelper::doElementAuthentication($account_id, $token, $element_key);
        if ($elementAuthentication != "") {
            
            $result->element_key = $elementAuthentication;
            $app = AppConnectHelper::getAppData($app_id, $app_name, $account_id);
            $result->app_id = $app->app_id;
            $result->app_key = $app->api_key;
            $result->account_id = $app->account_id;
        }

        return $result;
    }

    private static function doElementAuthentication($account_id, $token, $element_key) {
        if ($element_key != "") { //DO Authentication by Element Key
            if (da_account::ValidateElementKey($account_id, $element_key) != NULL) {
                return $element_key;
            }
        } else { //DO Authentication by Token and get the new Element Key
            if (da_session::GetAndValidateSession($account_id, $token)) {
                $iot_element = da_account::CreateIoTElement($account_id);
                return $iot_element->element_key;
            } else {
                return NULL;
            }
        }
    }

    private static function getAppData($app_id, $app_name, $account_id) {
        if ($app_id > 0) { //GET APP KEY BY APP_ID
            return da_apps_registry::GetApp($app_id);
        } else { //GET APP KEY BY ACCOUNT/APPNAME SEARCH
            return da_apps_registry::GetAppByAccountAndAppName($account_id, $app_name);
        }
    }

}

class be_ConnectResult {

    public $account_id = 0;
    public $app_id = 0;
    public $app_key = "";
    public $element_key = "";

}

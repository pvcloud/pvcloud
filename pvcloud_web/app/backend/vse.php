<?php

error_reporting(E_ERROR);

require_once 'vendor/autoload.php';

require_once './DA/da_conf.php';
require_once './DA/da_helper.php';

require_once './DA/da_account.php';
require_once './DA/da_apps_registry.php';
require_once './DA/da_session.php';
require_once './DA/da_vse_data.php';
require_once './inc/SimpleResponse.php';

$app = new \Slim\App();


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

$app->get('/appdata/{app_id}/{app_key}/{element_key}', function($request, $response, $args) {

    $result = AppDataHelper::Read($args['app_id'], $args['app_key'], $args['element_key']);

    include './inc/incJSONHeaders.php';
    echo json_encode($result);
});

$app->get('/appdata/{app_id}/{app_key}/{element_key}/{label}', function($request, $response, $args) {
    $result = AppDataHelper::Read($args['app_id'], $args['app_key'], $args['element_key'], $args['label']);

    include './inc/incJSONHeaders.php';
    echo json_encode($result);
});

$app->get('/appdata/{app_id}/{app_key}/{element_key}/{label}/{count}', function($request, $response, $args) {
    $result = AppDataHelper::Read($args['app_id'], $args['app_key'], $args['element_key'], $args['label'], $args['count']);

    include './inc/incJSONHeaders.php';
    echo json_encode($result);
});

$app->post('/appdata/{app_id}/{app_key}/{element_key}', function($request, $response, $args) {

    $result = AppDataHelper::Write($args['app_id'], $args['app_key'], $args['element_key']);

    include './inc/incJSONHeaders.php';
    echo json_encode($result);
});

$app->delete('/appdata/{app_id}/{app_key}/{element_key}/{label}', function($request, $response, $args) {
    $result = AppDataHelper::Delete($args);

    include './inc/incJSONHeaders.php';
    echo json_encode($result);
});

$app->delete('/appdata/{app_id}/{app_key}/{element_key}/{label}/{count}', function($request, $response, $args) {
    $result = AppDataHelper::Delete($args);

    include './inc/incJSONHeaders.php';
    echo json_encode($result);
});

$app->post('/appfiles/{app_id}/{app_key}/{element_key}', function($request, $response, $args) {

    $result = AppFilesHelper::SaveFile($args['app_id'], $args['app_key'], $args['element_key']);

    include './inc/incJSONHeaders.php';
    echo json_encode($result);
});

$app->get('/test/{id}', function($request, $response, $args){
    $result = new stdClass();
    $result->id=$args['id'];
    include './inc/incJSONHeaders.php';
    echo json_encode($result);
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
                $connectResult = AppConnectHelper::doAppConnect($parameters->account_id, $parameters->token, $parameters->element_key, $parameters->app_id, $parameters->app_name);

                if ($connectResult != NULL) {
                    if ($connectResult->status == "OK") {
                        $response->status = "OK";
                        $response->message = "";
                        $data = new stdClass();
                        $data->account_id = $connectResult->account_id;
                        $data->app_id = $connectResult->app_id;
                        $data->app_key = $connectResult->app_key;
                        $data->element_key = $connectResult->element_key;
                        $response->data = $data;
                        
                    } else {
                        $response->status = $connectResult->status;
                        $response->message = $connectResult->message;
                        $response->data = $connectResult;
                    }
                } else {
                    $response->status = "Error";
                    $response->message = "No se pudo realizar la conexión. Verifique los datos suministrados. (Cuenta, Password, App)";
                }
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
            if ($parameters->app_id > 0 || $parameters->app_name != "") {

                return true;
            }
        }

        return false;
    }

    /**
     * 
     * @param type $account_id
     * @param type $token
     * @param type $element_key
     * @param type $app_id
     * @param type $app_name
     * @return \be_ConnectResult
     */
    private static function doAppConnect($account_id, $token, $element_key, $app_id, $app_name) {
        $result = new be_ConnectResult();
        $elementAuthentication = AppConnectHelper::doElementAuthentication($account_id, $token, $element_key);
        if ($elementAuthentication != "") {

            $result->element_key = $elementAuthentication;
            $app = AppConnectHelper::getAppData($app_id, $app_name, $account_id);
            
            if ($app == NULL) {
                $result->status = "ERROR";
                $result->message = "Application not found....";
            } else {
                $result->status = "OK";
                $result->message = "";
                $result->app_id = $app->app_id;
                $result->app_key = $app->api_key;
                $result->account_id = $app->account_id;
            }
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

class AppDataHelper {

    public static function Read($app_id, $app_key, $element_key, $label, $count) {
        /*
         * 1. Validate App_id and App Key
         * 2. Validate Element Key
         * 3. Bring data for label and count
         */

        $result = new SimpleResponse();

        try {
            if (AppDataHelper::ValidateApp($app_id, $app_key)) {
                $app = da_apps_registry::GetApp($app_id);
                if (AppDataHelper::ValidateElementKey($app->account_id, $app_id, $element_key)) {
                    $data = da_vse_data::GetEntries($app_id, $label, $count);
                    $result->status = "OK";
                    $result->data = $data;
                } else {
                    $result->status = "ERROR";
                    $result->message = "Element Key Validation Error";
                }
            } else {
                $result->status = "ERROR";
                $result->message = "App Validation Error";
            }
        } catch (Exception $e) {
            $result->status = "EXCEPTION";
            $result->message = $e->getMessage();
        }

        return $result;
    }

    /**
     * Writes a new VSE Value entry passed in the POST Body.
     * @param type $app_id
     * @param type $app_key
     * @param type $element_key
     * @return \SimpleResponse
     */
    public static function Write($app_id, $app_key, $element_key) {
        /*
         * 1. Validate App_id and App Key
         * 2. Validate Element Key
         * 3. Save data 
         */

        $result = new SimpleResponse();

        try {

            $parameters = AppDataHelper::collectPOSTParameters();

            if (!AppDataHelper::validatePOSTParameters($parameters)) {
                $result->status = "ERROR";
                $result->message = "INVALID PARAMETERS";
                return $result;
            }
            $result->parameters = $parameters;
            if (AppDataHelper::ValidateApp($app_id, $app_key)) {
                $app = da_apps_registry::GetApp($app_id);

                if (AppDataHelper::ValidateElementKey($app->account_id, $app_id, $element_key)) {
                    $entry = new be_vse_data();
                    $entry->app_id = $app_id;
                    $entry->vse_label = $parameters->label;
                    $entry->vse_value = $parameters->value;
                    $entry->captured_datetime = $parameters->captured_datetime;

                    $result->data = da_vse_data::AddEntry($entry);
                    $result->status = "OK";
                } else {
                    $result->status = "ERROR";
                    $result->message = "Element Key Validation Error";
                }
            } else {
                $result->status = "ERROR";
                $result->message = "App Validation Error";
            }
        } catch (Exception $e) {
            $result->status = "EXCEPTION";
            $result->message = $e->getMessage();
        }

        return $result;
    }

    private static function collectPOSTParameters() {
        $parameters = new stdClass();
        $parameters->label = filter_input(INPUT_POST, "label");
        $parameters->value = filter_input(INPUT_POST, "value");
        $parameters->captured_datetime = filter_input(INPUT_POST, "captured_datetime");

        return $parameters;
    }

    private static function validatePOSTParameters($parameters) {
        if (!isset($parameters->label) || $parameters->label == "" || !isset($parameters->value) || !isset($parameters->captured_datetime)) {
            return false;
        } else {
            return true;
        }
    }

    public static function Delete($args) {
        /*
         * 1. Validate App_id and App Key
         * 2. Validate Element Key
         * 3. DELETE the data
         */

        $result = new SimpleResponse();

        $app_id = $args['app_id'];
        $app_key = $args['app_key'];
        $element_key = $args['element_key'];
        $label = $args['label'];
        $count = $args['count'];

        try {
            if (AppDataHelper::ValidateApp($app_id, $app_key)) {
                $app = da_apps_registry::GetApp($app_id);
                if (AppDataHelper::ValidateElementKey($app->account_id, $app_id, $element_key)) {
                    $data = da_vse_data::ClearEntries($app_id, $label, $count);
                    $result->status = "OK";
                    $result->data = $data;
                } else {
                    $result->status = "ERROR";
                    $result->message = "Element Key Validation Error";
                }
            } else {
                $result->status = "ERROR";
                $result->message = "App Validation Error";
            }
        } catch (Exception $e) {
            $result->status = "EXCEPTION";
            $result->message = $e->getMessage();
        }

        return $result;
    }

    public static function ValidateApp($app_id, $app_key) {
        $app = da_apps_registry::GetApp($app_id);
        if ($app && $app->api_key == $app_key)
            return true;
        return false;
    }

    public static function ValidateElementKey($account_id, $app_id, $element_key) {
        return da_account::ValidateElementKeyAccess($account_id, $app_id, $element_key);
    }

}

class AppFilesHelper {

    /**
     * Writes a new VSE Value entry passed in the POST Body.
     * @param type $app_id
     * @param type $app_key
     * @param type $element_key
     * @return \SimpleResponse
     */
    public static function SaveFile($app_id, $app_key, $element_key) {

        $result = new SimpleResponse();

        try {

            $parameters = AppFilesHelper::collectPOSTParameters();

            if (!AppFilesHelper::validatePOSTParameters($parameters)) {
                $result->status = "ERROR";
                $result->message = "INVALID PARAMETERS";
                return $result;
            }
            $parameters->app_id = $app_id;

            if (AppDataHelper::ValidateApp($app_id, $app_key)) {
                $app = da_apps_registry::GetApp($app_id);

                if (AppDataHelper::ValidateElementKey($app->account_id, $app_id, $element_key)) {
                    $fileResult = AppFilesHelper::moveUploadedFile();
                    $result->data = AppFilesHelper::createVSEEntry($parameters, $fileResult);
                    $result->status = "OK";
                } else {
                    $result->status = "ERROR";
                    $result->message = "Element Key Validation Error";
                }
            } else {
                $result->status = "ERROR";
                $result->message = "App Validation Error";
            }
        } catch (Exception $e) {
            $result->status = "EXCEPTION";
            $result->message = $e->getMessage();
        }

        return $result;
    }

    private static function collectPOSTParameters() {
        $parameters = new stdClass();
        $parameters->label = filter_input(INPUT_POST, "label");
        $parameters->captured_datetime = filter_input(INPUT_POST, "captured_datetime");

        return $parameters;
    }

    private static function validatePOSTParameters($parameters) {
        if (!isset($parameters->label) || $parameters->label == "" || !isset($parameters->captured_datetime)) {
            return false;
        } else {
            return true;
        }
    }

    private static function moveUploadedFile() {

        $fileResult = new stdClass();
        $target_dir = "vse_files/";

        //TODO: Need to add a random factor that cannot be guessed through brute force.
        $fileResult->file_guid = uniqid("file_", true);
        $fileResult->file_name = $_FILES["vse_file"]["name"];
        $target_file = $target_dir . $fileResult->file_guid;

        if (file_exists($target_file)) {
            throw new Exception("File Already Exists");
        }

        if ($_FILES["vse_file"]["size"] > 100000000) {
            throw new Exception("File is too large");
        }

        if (move_uploaded_file($_FILES["vse_file"]["tmp_name"], $target_file)) {
            return $fileResult;
        } else {
            throw new Exception("File Upload Failed for " . $_FILES["vse_file"]["tmp_name"] . " with target $target_file");
        }
    }

    private static function createVSEEntry($params, $fileResult) {
        $vseEntry = new be_vse_data();
        $vseEntry->app_id = $params->app_id;
        $vseEntry->vse_label = $params->label;

        $fileSimpleObject = new stdClass();
        $fileSimpleObject->file_name = $fileResult->file_name;
        $fileSimpleObject->file_guid = $fileResult->file_guid;

        $vseEntry->vse_value = json_encode($fileSimpleObject);
        $vseEntry->vse_type = "_FILE_";
        $vseEntry->captured_datetime = $params->captured_datetime;

        $savedEntry = da_vse_data::AddEntry($vseEntry);
        return $savedEntry;
    }

}

class be_ConnectResult {

    public $status = "";
    public $message = "";
    public $account_id = 0;
    public $app_id = 0;
    public $app_key = "";
    public $element_key = "";

}

<?php

/**
 * Datagram for AppConnect operation result
 * Includes data required to connect (app_id, app_key) and status ("OK", "AUTH_ERROR");
 */
class be_AppConnectResult {

    /**
     *
     * @var type STATUS: OK, ERROR_AUTHENTICATION
     */
    public $status;
    public $app_id = 0;
    public $app_key = "";

}

/**
 * Business Logic for App Connect Operations
 *
 * @author janunezc
 */
class BL_AppConnect_Simple {

    /**
     * Performs a one-transaction operation to verify credentials to connect an IoT Element to an IoT App.
     * Parameters through query string include:
     * - account_descriptor     id or email of the account to be used
     * - app_descriptor         ID or Name of the app to connect to. If app name is used, then it will be matched agains apps belonging to the provided account
     * - secret                 Either account password, one time passcode or app_key
     * - device_name            Name (Nickname) used for the device
     * @return \SimpleResponse
     */
    public static function Connect($parameters) {
        $appConnectResult = new be_AppConnectResult($parameters);
        $serviceResponse = new SimpleResponse();


        try {
            BL_AppConnect_Simple::getAccountAndAppData($parameters);

            $parameterValidationResult = BL_AppConnect_Simple::parametersValidation($parameters);
            if (count($parameterValidationResult) == 0) {
                $appConnectResult = BL_AppConnect_Simple::doAppConnect($parameters->account, $parameters->app, $parameters->secret, $parameters->device_name);
                $serviceResponse = BL_AppConnect_Simple::processConnectResult($appConnectResult);
            } else {
                $serviceResponse->status = STATUS_ERROR_INVALID_PARAMETERS;
                $serviceResponse->message = STATUS_ERROR_INVALID_PARAMETERS;
                $serviceResponse->validationCodes = $parameterValidationResult;
            }
        } catch (Exception $ex) {
            $wsResult->status = STATUS_EXCEPTION;
            $wsResult->message = $ex->getMessage();
        }

        return $serviceResponse;
    }

    /**
     * Retrieves full account and app datagrams
     * @param type $parameters
     */
    private static function getAccountAndAppData($parameters) {
        $account = BL_AppConnect_Simple::resolveAccount($parameters->account_descriptor);
        $parameters->account = $account;

        $app = BL_AppConnect_Simple::resolveApp($parameters->app_descriptor, $account->account_id);
        $parameters->app = $app;
    }

    /**
     * Crafts SimpleResponse web service object
     * @param be_AppConnectResult $connectResult
     * @return \SimpleResponse
     * @throws Exception
     */
    private static function processConnectResult($connectResult) {
        $serviceResponse = new SimpleResponse();

        if ($connectResult != NULL) {
            if ($connectResult->status == STATUS_OK) {
                $data = new stdClass();
                $data->app_id = $connectResult->app_id;
                $data->app_key = $connectResult->app_key;

                $serviceResponse->status = STATUS_OK;
                $serviceResponse->message = "";
                $serviceResponse->data = $data;
            } else {
                $serviceResponse->status = $connectResult->status;
                $serviceResponse->message = $connectResult->message;
                $serviceResponse->data = null;
            }
        } else {
            throw new Exception("Cannot processConnectResult!");
        }

        return $serviceResponse;
    }

    /**
     * Resoves account out of descriptor
     * @param string_or_int $account_descriptor ID or Email of the account
     * @return be_account
     */
    private static function resolveAccount($account_descriptor) {
        $account = new be_account();

        if (is_numeric($account_descriptor) && $account_descriptor > 0) {
            $account = da_account::GetAccountByID($account_descriptor);
        } else {
            $account = da_account::GetAccount($account_descriptor);
        }

        return $account;
    }

    /**
     * Resolves app out of app descriptor and account_id
     * @param string_or_int $app_descriptor Name or ID of the App
     * @param int $account_id ID of the related account
     * @return be_app
     */
    private static function resolveApp($app_descriptor, $account_id) {
        $app = new be_account();
        if (is_numeric($app_descriptor) && $app_descriptor > 0) {
            $app = da_apps_registry::GetApp($app_descriptor);
        } else {
            $app = da_apps_registry::GetAppByAccountIDAndAppName($account_id, $app_descriptor);
        }
        return $app;
    }

    private static function parametersValidation($parameters) {
        $validationErrors = [];
        if (!(isset($parameters->account->account_id) && $parameters->account->account_id > 0)) { // account id is present
            $validationErrors[] = "ACCOUNT_INVALID";
        }
        if (!(isset($parameters->app->app_id) && $parameters->app->app_id > 0)) { // app_id is present
            $validationErrors[] = "APP_INVALID";
        }

        if (!(isset($parameters->secret) && $parameters->secret != "")) { //SECRET OK
            $validationErrors[] = "SECRET_INVALID";
        }

        if (!((isset($parameters->device_name) && $parameters->device_name != ""))) { // DEVICE NAME OK
            $validationErrors[] = "DEVICE_NAME_INVALID";
        }

        return $validationErrors;
    }

    /**
     * Performs IoT Element Connection to an App by:
     *  1. Authentication (account_id + app_id + secret (pwd, otp, app_key) 
     * 
     * @param be_account $account the account to which the target app belongs
     * @param be_app $app the app to connect to.
     * @param string $secret Either Password of the account, OTP or App_key to validate access to the app
     * @param string $device_name Nickname to register the device
     * @return \be_AppConnectResult Datagram with app_key (if successful) or failure information.
     */
    private static function doAppConnect($account, $app, $secret, $device_name) {
        $appConnectResult = new be_AppConnectResult();
        $elementAuthentication = BL_AppConnect_Simple::authenticateForAppConnection($account, $app, $secret);
        if ($elementAuthentication == true) {

            $appConnectResult->app_id = $app->app_id;
            $appConnectResult->app_key = $secret;
            $appConnectResult->status = STATUS_OK;
        } else {
            $appConnectResult->status = STATUS_ERROR_AUTHENTICATION;
        }

        return $appConnectResult;
    }

    /**
     * Verifies account_id, app_id and secret are valid and related
     * @param be_account $account
     * @param be_app $app
     * @param string $secret
     * @return boolean whether authentication succeeds or fails.
     */
    private static function authenticateForAppConnection($account, $app, $secret) {
        if ($app->api_key == $secret) {
            if ($app->account_id == $account->account_id) {
                return true;
            }
        }
        return false;
    }

}

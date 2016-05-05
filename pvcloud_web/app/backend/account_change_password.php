<?php

/* * *
 * http://localhost:8080/pvcloud/backend/account_change_password.php?account_id=1&old_password=1234pass&newpassword=1234otherpass&new_password2=1234otherpass
 * 
 * * */
error_reporting(E_ERROR);

require_once './DA/da_conf.php';
require_once './DA/da_helper.php';
require_once './DA/da_account.php';
require_once './DA/da_session.php';

class WebServiceClass {

    public $status = ""; /* OK, ERROR, EXCEPTION */
    public $message = "";
    public $data = NULL;

    public static function ChangePassword() {

        $response = new WebServiceClass();



        try {
            $account_id = NULL; // Session Validation INCLUDE will populate this variable
            include './inc/incWebServiceSessionValidation.php';

            $parameters = WebServiceClass::collectParameters();

            /**
             * @var be_account
             */
            $account = da_account::GetAccountByID($account_id);

            $providedHash = sha1($parameters->old_password);
            $passwordHashToChange = $account->pwd_hash;
            $newSalt = random_int(100000, 999999);


            if (strlen($passwordHashToChange) === 46) { //use salt
                $currentSalt = substr($passwordHashToChange, 0, 6);
                $currentHash = substr($passwordHashToChange, 6);
                $oldHash = 
                $newHash = sha1($parameters->new_password);
                $newHashSalted = sha1($newSalt.$newHash);
            } else { //dont use salt
            }



            $parameters->ophash = $passwordHashToChange;
            $parameters->cphash = $providedHash;
            $parameters->nphash = $newPasswordHash;
            $parameters->account = $account;
            $parameters->account_id = $account_id;

            if ($providedHash == $passwordHashToChange) {
                $account->pwd_hash = $newPasswordHash;
                $savedAccount = da_account::UpdateAccount($account);
                $parameters->savedAccount = $savedAccount;
                if ($savedAccount->pwd_hash == $account->pwd_hash) {
                    $response->status = "OK";
                    $response->message = "Clave fue cambiada exitosamente";
                } else {
                    $response->status = "ERROR";
                    $response->data = $parameters;
                    $response->message = "Ocurrió un error inesperado al guardar la nueva clave";
                }
            } else {
                $response->status = "ERROR";
                $response->message = "Clave actual incorrecta";
                $response->data = $parameters;
            }
        } catch (Exception $ex) {
            $response->status = "EXCEPTION";
            $response->message = $ex->getMessage();
        }

        return $response;
    }

    private static function collectParameters() {
        $parameters = new stdClass();
        $parameters->old_password = filter_input(INPUT_GET, "old_password");
        $parameters->new_password = filter_input(INPUT_GET, "new_password");

        return $parameters;
    }

}

include './inc/incJSONHeaders.php';
echo json_encode(WebServiceClass::ChangePassword());

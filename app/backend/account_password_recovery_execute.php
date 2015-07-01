<?php

/* * *
 * http://localhost:8080/pvcloud_backend/account_change_password.php?account_id=1&old_password=1234pass&newpassword=1234otherpass&new_password2=1234otherpass
 * 
 * * */
error_reporting(E_ERROR);

require_once './DA/da_conf.php';
require_once './DA/da_helper.php';
require_once './DA/da_account.php';
require_once './DA/da_session.php';
include './inc/incBaseURL.php';

class WebServiceClass {

    public $status = ""; /* OK, ERROR, EXCEPTION */
    public $message = "";
    public $data = NULL;

    public static function PasswordRecovery_Execute() {
        $response = new WebServiceClass();

        try {
            $parameters = WebServiceClass::collectParameters();

            $account = da_account::GetAccountByID($parameters->AccountID);

            if ($account != NULL) {
                if ($account->email != "" && $parameters->Email == $account->email) {
                    if ($account->confirmation_guid == $parameters->ConfirmationCode) {
                        $accountModificationTime = new DateTime($account->modified_datetime);
                        $currentDateTime = new DateTime(DA_Helper::GetServerDate());
                        $difference = $currentDateTime->diff($accountModificationTime);

                        if ($difference->d == 0) {
                            $account->pwd_hash = sha1($parameters->Password);
                            $savedAccount = da_account::UpdateAccount($account);
                            if ($savedAccount != NULL && $savedAccount->account_id == $account->account_id) {
                                $response->status = "OK";
                                $response->message = "Contraseña Actualizada Satisfactoriamente";
                                WebServiceClass::sendPWRecoveryEmail($account);
                            } else {
                                $response->status = "ERROR";
                                $response->message = "Solicitud Inválida";
                            }
                        } else {
                            $response->status = "ERROR";
                            $response->message = "Solicitud Expirada";
                        }
                    } else {
                        $response->status = "ERROR";
                        $response->message = "Solicitud Inválida";
                    }
                } else {
                    $response->status = "ERROR";
                    $response->message = "Solicitud Inválida";
                }
            } else {
                $response->status = "ERROR";
                $response->message = "Solicitud Inválida";
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
     */
    private static function sendPWRecoveryEmail($account) {

        $recoveryURL = getBaseURL("pvcloud") . "#/passwordrecovery/$account->account_id/$account->confirmation_guid";

        $message = "Le comunicamos que el proceso de recuperación de contraseña fue completado con éxito.\n\n";
        $to = $account->email;
        $subject = "pvCloud - Recuperación de Contraseña Completada";

        $enter = "\r\n";
        $headers = "From: donotreply@costaricamakers.com $enter";
        $headers .= "MIME-Version: 1.0 $enter";
        $headers .= "Content-type: text/plain; charset=utf-8 $enter";

        $result = mail($to, $subject, $message, $headers);
    }

    private static function collectParameters() {
        $parameters = new stdClass();
        $parameters->Email = filter_input(INPUT_POST, "txtEmail");
        $parameters->Password = filter_input(INPUT_POST, "txtPassword");
        $parameters->AccountID = filter_input(INPUT_POST, "AccountID");
        $parameters->ConfirmationCode = filter_input(INPUT_POST, "ConfirmationCode");

        return $parameters;
    }

}

$result = WebServiceClass::PasswordRecovery_Execute();

if ($result->status == "OK") {
    $url = getBaseURL("pvcloud") . "#/prs";
    header("Location: $url");
} else {
    $url = getBaseURL("pvcloud") . "#/err";

    header("Location: $url");
}


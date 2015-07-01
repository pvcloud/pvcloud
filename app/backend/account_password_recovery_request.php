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

    public static function PasswordRecovery() {
        $response = new WebServiceClass();

        try {
            $confirmationID = uniqid();
            $parameters = WebServiceClass::collectParameters();
            $account = da_account::GetAccount($parameters->email);
            $account->confirmation_guid = $confirmationID;


            $savedAccount = da_account::UpdateAccount($account);
            WebServiceClass::sendPWRecoveryEmail($savedAccount);

            $response->status = "OK";
            $response->message = "Solicitud de recuperación de clave tramitada.";
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

        $message = "Hemos recibido una solicitud de recuperación de contraseña para su cuenta en pvCloud.\n\n";
        $message .= "Para recuperar su contraseña sírvase acceder al siguiente enlace dentro de las próximas 24 horas.\n\n";
        $message .= $recoveryURL . "\n\n";
        $message .= "Si usted no necesita recuperar su contraseña, por favor ignore este mensaje.\n\n";
        $message .= "Si usted no solicitó un cambio de contraseña, puede que alguien esté intentando violentar su cuenta;\n\n";
        $message .= "en cuyo caso por favor reporte el incidente a pvcloud_seguridad@costaricamakers.com\n\n";
        $to = $account->email;
        
        $subject = "pvCloud - Recuperación de Contraseña";
        
        $enter = "\r\n";
        $headers = "From: donotreply@costaricamakers.com $enter";
        $headers .= "MIME-Version: 1.0 $enter";
        $headers .= "Content-type: text/plain; charset=utf-8 $enter";

        $result = mail($to, $subject, $message, $headers);
    }

    private static function collectParameters() {
        $parameters = new stdClass();
        $parameters->email = filter_input(INPUT_GET, "email");

        return $parameters;
    }

}

include './inc/incJSONHeaders.php';
echo json_encode(WebServiceClass::PasswordRecovery());

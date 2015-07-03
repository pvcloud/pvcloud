<?php

/* * *
 * MAKE A POST CALL TO THIS URL: 
 * http://localhost:8080/pvcloud_backend/invitation_add_post.php
 * 
 * SEND A JSON OBJECT AS THE RAW BODY AS FOLLOWS:

  {"account_id":"1",
  "token":"use the current login token here",
  "invitation":{"host_email":"roberto.viquez@intel.com","guest_email":"robertoviquez@gmail.com"}
  }
 * 
 * 
 * * */
error_reporting(E_ERROR);

class simpleResponse {

    public $status = "";
    public $message = "";
    public $data = [];

}

require_once './DA/da_conf.php';
require_once './DA/da_helper.php';
require_once './DA/da_account.php';
require_once './DA/da_session.php';
require_once './DA/da_apps_registry.php';
require_once './DA/da_invitation.php';

include './inc/incWebServiceSessionValidation_POST.php';

class AddInvitationWebService {

    public static function AddInvitation() {

        $response = new simpleResponse();
        try {
            $parameters = AddInvitationWebService::collectParameters();
            $parametersErrors = AddInvitationWebService::validateParameters($parameters);

            if (count($parametersErrors) == 0) {
                $savedInvitation = AddInvitationWebService::saveInvitation($parameters);
                if ($savedInvitation->invitation_id > 0) {
                    $response->message = "La invitación ha sido guardada satisfactoriamente";
                    $response->status = "OK";
                    $response->data = $savedInvitation;
                } else {
                    $response->message = "Ocurrió un error al guardar la invitación";
                    $response->status = "ERROR";
                    $response->data = $savedInvitation;
                }
            } else {
                $response->message = "Parámetros Inválidos";
                $response->status = "ERROR";
                $response->data = $parametersErrors;
            }
        } catch (Exception $ex) {
            $response->message = $ex->getMessage();
            $response->status = "EXCEPTION";
            $response->data = NULL;
        }

        return $response;
    }

    private static function collectParameters() {

        $rawPOSTContent = file_get_contents('php://input');
        $decodedPOSTParams = json_decode($rawPOSTContent);

        $parameters = new stdClass();
        $parameters->host_email = $decodedPOSTParams->invitation->host_email;
        $parameters->guest_email = $decodedPOSTParams->invitation->guest_email;

        return $parameters;
    }

    private static function validateParameters($parameters) {
        $errorsFound = [];

        if (!is_string($parameters->host_email) || $parameters->host_email == "") {
            $errorsFound[] = "Correo electrónico del solicitante es inválido.";
        }

        if (!is_string($parameters->guest_email) || $parameters->guest_email == "") {
            $errorsFound[] = "Correo electrónico del invitado es inválido.";
        }

        return $errorsFound;
    }

    private static function saveInvitation($parameters) {
        return da_invitation::AddNewInvitation($parameters->host_email, $parameters->guest_email);
    }

}

include './inc/incJSONHeaders.php';
echo json_encode(AddInvitationWebService::AddInvitation());

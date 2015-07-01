<?php

/* * *
 * MAKE A POST CALL TO THIS URL: 
 * http://localhost:8080/pvcloud_backend/widget_add_post.php
 * 
 * SEND A JSON OBJECT AS THE RAW BODY AS FOLLOWS:

    {"account_id":"1",
    "token":"use the current login token here",
    "page_id":"1",
    "widget_type_id":"1",
    "title":"generic title",
    "description":"generic description",
    "order":"1"
    }

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
require_once './DA/da_widgets.php';

include './inc/incWebServiceSessionValidation_POST.php';

class AddWidgetWebService {

    public static function AddWidget() {

        $response = new simpleResponse();
        try {
            $parameters = AddWidgetWebService::collectParameters();
            $parametersErrors = AddWidgetWebService::validateParameters($parameters);

            if (count($parametersErrors) == 0) {
                $savedWidget = AddWidgetWebService::saveWidget($parameters);
                if ($savedWidget->widget_id > 0) {
                    $response->message = "Widget guardado satisfactoriamente";
                    $response->status = "OK";
                    $response->data = $savedWidget;
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
        $parameters->page_id = $decodedPOSTParams->page_id;
        $parameters->widget_type_id = $decodedPOSTParams->widget_type_id;
        $parameters->title = $decodedPOSTParams->title;
        $parameters->description = $decodedPOSTParams->description;
        $parameters->order = $decodedPOSTParams->order;
        
        return $parameters;
    }

    private static function validateParameters($parameters) {
        $errorsFound = [];

        if (!is_numeric($parameters->page_id) || !$parameters->page_id > 0) {
            $errorsFound[] = "ID de la página es inválido.";
        }

        if (!is_numeric($parameters->widget_type_id) || !$parameters->widget_type_id > 0) {
            $errorsFound[] = "Tipo de widget es inválido.";
        }
        
        if (!is_string($parameters->title) || $parameters->title == "") {
            $errorsFound[] = "Título del widget es inválido.";
        }

        if (!is_string($parameters->description) || $parameters->description == "") {
            $errorsFound[] = "Descripción del widget es inválido.";
        }

        if (!is_numeric($parameters->order) || !($parameters->order >= 1)) {
            $errorsFound[] = "Orden del Widget es inválido.";
        }

        return $errorsFound;
    }

    private static function saveWidget($parameters) {
        return da_widgets::AddWidget($parameters);
    }

}

include './inc/incJSONHeaders.php';
echo json_encode(AddWidgetWebService::AddWidget());

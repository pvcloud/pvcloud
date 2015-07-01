<?php

/* * *
 * http://localhost:8080/pvcloud_backend/page_add.php?account_id=1&token=123x&app_id=17&title=NewTitle&description=newDescription&visibility_type_id=3
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

include './inc/incWebServiceSessionValidation.php';

class PageAddWebService {

    public static function AddPage() {
        
        $response = new simpleResponse();
        try {
            $parameters = PageAddWebService::collectParameters();
            $parametersErrors = PageAddWebService::validateParameters($parameters);
            
            if (count($parametersErrors) == 0) {
                $savedPage = PageAddWebService::savePage($parameters);
                if ($savedPage->page_id > 0) {
                    $response->message = "Página guardada satisfactoriamente";
                    $response->status = "OK";
                    $response->data = $savedPage;
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
        $parameters = new stdClass();
        $parameters->app_id = filter_input(INPUT_GET, "app_id");
        $parameters->title = filter_input(INPUT_GET, "title");
        $parameters->description = filter_input(INPUT_GET, "description");
        $parameters->visibility_type_id = filter_input(INPUT_GET, "visibility_type_id");
        return $parameters;
    }

    private static function validateParameters($parameters) {
        $errorsFound = [];

        if (!is_numeric($parameters->app_id) || !$parameters->app_id > 0) {
            $errorsFound[] = "ID de la Aplicación es inválido.";
        }

        if (!is_string($parameters->title) || $parameters->title == "") {
            $errorsFound[] = "Título de la página es inválido.";
        }

        if (!is_string($parameters->description) || $parameters->description == "") {
            $errorsFound[] = "Descripción de la página es inválido.";
        }

        if (!is_numeric($parameters->visibility_type_id) || !($parameters->visibility_type_id >= 1 && $parameters->visibility_type_id <= 3)) {
            $errorsFound[] = "Visibilidad de la página es inválido.";
        }

        return $errorsFound;
    }

    private static function savePage($parameters) {
        return da_apps_registry::RegisterNewPage($parameters);
    }

}

include './inc/incJSONHeaders.php';
echo json_encode(PageAddWebService::AddPage());
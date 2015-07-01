<?php

/* * *
 * http://localhost:8080/pvcloud_backend/page_modify.php?account_id=1&token=123x&page_id=1&title=NewTitle&description=newDescription&visibility_type_id=3
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

class PageModifyWebService {

    public static function ModifyPage() {

        $response = new simpleResponse();
        try {
            $parameters = PageModifyWebService::collectParameters();
            $parametersErrors = PageModifyWebService::validateParameters($parameters);

            if (count($parametersErrors) == 0) {
                $savedPage = PageModifyWebService::savePage($parameters);
                if ($savedPage->page_id == $parameters->page_id) {
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
        $parameters->page_id = filter_input(INPUT_GET, "page_id");
        $parameters->title = filter_input(INPUT_GET, "title");
        $parameters->description = filter_input(INPUT_GET, "description");
        $parameters->visibility_type_id = filter_input(INPUT_GET, "visibility_type_id");
        return $parameters;
    }

    private static function validateParameters($parameters) {
        $errorsFound = [];

        if (!is_numeric($parameters->page_id) || !$parameters->page_id > 0) {
            $errorsFound[] = "ID de la página es inválido.";
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
        return da_apps_registry::UpdatePage($parameters);
    }

}


include './inc/incJSONHeaders.php';
echo json_encode(PageModifyWebService::ModifyPage());

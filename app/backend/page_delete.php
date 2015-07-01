<?php

/* * *
 * http://localhost:8080/pvcloud_backend/page_delete.php?account_id=1&token=123x&page_id=1
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

class PageDeleteWebService {

    public static function DeletePage() {

        $response = new simpleResponse();
        try {
            $parameters = PageDeleteWebService::collectParameters();
            $parametersErrors = PageDeleteWebService::validateParameters($parameters);
            if (count($parametersErrors) == 0) {
                $savedPage = da_apps_registry::DeletePage($parameters->page_id);

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
        return $parameters;
    }

    private static function validateParameters($parameters) {
        $errorsFound = [];

        if (!is_numeric($parameters->page_id) || !$parameters->page_id > 0) {
            $errorsFound[] = "ID de la página es inválido.";
        }

        return $errorsFound;
    }
}


include './inc/incJSONHeaders.php';
echo json_encode(PageDeleteWebService::DeletePage());

<?php

/* * *
 * http://localhost:8080/pvcloud_backend/app_get_content.php?account_id=1&token=705d5b1c66db66dc1b2c8c96b209b11899337f4c
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
require_once './DA/da_content.php';

class SaveContentWebService {

    public static function SaveContent() {

        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);

       // echo "input post " . $postdata;

        
        $response = new simpleResponse();
    
        $account_id = $request->account_id;
        $token = $request->token;

        $session = da_session::GetAndValidateSession($account_id, $token);

        if ($session == NULL) {
            die("Invalid Session");
        }

        try {
            $parameters = SaveContentWebService::collectParameters($request);
            $parametersErrors = 0;//PageAddWebService::validateParameters($parameters);

            $savedContent = SaveContentWebService::saveNewContent($parameters);

                if ($savedContent > 0) {
                    $response->message = "Contenido guardada satisfactoriamente";
                    $response->status = "OK";
                    $response->data = $savedContent;
                }

            /*if (count($parametersErrors) == 0) {
                $savedContent = SaveContentWebService::saveContent($parameters);
                if ($savedPage->page_id > 0) {
                    $response->message = "Contenido guardada satisfactoriamente";
                    $response->status = "OK";
                    $response->data = $savedContent;
                }
            } else {
                $response->message = "Parámetros Inválidos";
                $response->status = "ERROR";
                $response->data = $parametersErrors;
            }*/
        } catch (Exception $ex) {
            $response->status = "EXCEPTION";
            $response->message = $ex->getMessage();
            $response->data = $content;
        }
        
        return $response;
    }

    private static function collectParameters($request) {
        $parameters = new stdClass();
        $parameters->title =  $request->title;
        $parameters->content = urldecode($request->content);
        return $parameters;
    }

    private static function saveNewContent($parameters) {
        return da_content::SaveNewContent($parameters);
    }

}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
//include './inc/incJSONHeaders.php';
echo json_encode(SaveContentWebService::SaveContent());

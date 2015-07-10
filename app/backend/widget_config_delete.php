<?php

/* * *
 *  http://localhost:8080/pvcloud_backend/widget_config_delete.php
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
require_once './DA/da_widget_config.php';

class Delete {

    public static function DeleteWidgetConfig() {
        $response = new simpleResponse();
      //  include './inc/incWebServiceSessionValidation.php';
       
        try {
             $parameters = Delete::collectParameters();
             $result = da_widget_config::DeleteWidgetConfig($parameters->widget_config_id);
             $response->status = "OK";
             $response->message = "";
             $response->data = $result; 
        } catch (Exception $ex) {
            $response->status = "EXCEPTION";
            $response->message = $ex->getMessage();
            $response->data = $result;
        }
        
        return $response;
    }
    


    private static function collectParameters() {
        $rawPOSTContent = file_get_contents('php://input');
        $decodedPOSTParams = json_decode($rawPOSTContent);

        $parameters = new stdClass();
        $parameters->widget_config_id = $decodedPOSTParams->widget_config_id;
        //TODO Widget Validation
        if(is_numeric($parameters->widget_config_id) && $parameters->widget_config_id > 0){
        
            return $parameters;
        }
            
        
        
        throw new Exception("Invalid Parameters");
        
        
        
    }

}

include './inc/incJSONHeaders.php';

echo json_encode(Delete::DeleteWidgetConfig());

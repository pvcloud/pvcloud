<?php

/* * *
 * http://localhost:8080/pvcloud_backend/widget_config_update.php
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

class Post {

    public static function updatewGetWidgetConfig() {
        $response = new simpleResponse();
        //include './inc/incWebServiceSessionValidation.php';
       
        try {
             $parameters = Post::collectParameters();
             $widgetConfig = da_widget_config::UpdateWidgetConfig($parameters->widget);
             $response->status = "OK";
             $response->message = "";
             $response->data = $widgetConfig;
        } catch (Exception $ex) {
            $response->status = "EXCEPTION";
            $response->message = $ex->getMessage();
            $response->data = $widgetConfig;
        }
        
        return $response;
    }
    


    private static function collectParameters() {
        $rawPOSTContent = file_get_contents('php://input');
        $decodedPOSTParams = json_decode($rawPOSTContent);

        $parameters = new stdClass();
        $parameters->widget = $decodedPOSTParams->widget;
        if(is_numeric($parameters->widget->widget_id) && $parameters->widget->widget_id > 0){
            if(is_string($parameters->widget->vse_label) && $parameters->widget->vse_label != ""){
                if(is_string($parameters->widget->friendly_label) && $parameters->widget->friendly_label != "")
                {
                        return $parameters;
                }
            }
        }
        
        throw new Exception("Invalid Parameters");
        
       
        
    }

}

include './inc/incJSONHeaders.php';

echo json_encode(Post::updatewGetWidgetConfig());

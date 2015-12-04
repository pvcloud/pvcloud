<?php

/* * *
 * http://localhost:8080/pvcloud/backend/widget_type_get.php?account_id=1&token=f40d375b097ab7254eff566d72adcc2cff1ba913
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
require_once './DA/da_widgets.php';

class beParameters {

    public $account_id = 0;
    public $token = "";


}

class GetPageWebService1 {

    public static function RetrieveWidgetsTypes() {
        $response = new simpleResponse();

        try {
            $account_id = 0;
           // include './inc/incWebServiceSessionValidation.php';

         
            $widgettypes = da_widgets::GetWidgetsTypes();
            $response->status = "OK";
            $response->message = "SUCCESS";
            $response->data = $widgettypes;
           
        } catch (Exception $ex) {
            $response->status = "EXCEPTION";
            $response->message = $ex->getMessage();
        }
        return $response;
    }



}

include './inc/incJSONHeaders.php';
echo json_encode(GetPageWebService1::RetrieveWidgetsTypes());
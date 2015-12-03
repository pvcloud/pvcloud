<?php
require 'vendor/autoload.php';

require_once './DA/da_conf.php';
require_once './DA/da_helper.php';
require_once './DA/da_account.php';
require_once './DA/da_session.php';
require_once './DA/da_apps_registry.php';

$app = new \Slim\Slim();

class simpleResponse {

    public $status = "";
    public $message = "";
    public $data = [];

}

class beParameters {

    public $account_id = 0;
    public $token = "";
    public $app_id = 0;

}

class PageWebService {

    public static function RetrievePage($page_id, $app_id, $account_id, $token) {
        $response = new simpleResponse();
        
        $parameters = PageWebService::collectParameters($page_id, $app_id, $account_id, $token);
        
        try {
            include './inc/incWebServiceSessionValidation.php';
            
            if ($account_id > 0) {
                $page = da_apps_registry::GetPage($parameters->page_id);
                $response->status = "OK";
                $response->message = "SUCCESS";
                $response->data = $page;
            } else {
                $response->status = "ERROR";
            }
        } catch (Exception $ex) {
            $response->status = "EXCEPTION";
            $response->message = $ex->getMessage();
        }
        return $response;
    }

    private static function collectParameters($page_id, $app_id, $account_id, $token) {
        $parameters = new beParameters();
        $parameters->account_id = $account_id;
        $parameters->token = $token;
        $parameters->app_id = $app_id;
        $parameters->page_id = $page_id;
        
        if (!isset($parameters->account_id)) {
            $parameters->account_id = 0;
        }

        if (!isset($parameters->token)) {
            $parameters->token = "";
        }

        if (!isset($parameters->app_id)) {
            $parameters->app_id = 0;
        }
        
        if (!isset($parameters->page_id)) {
            $parameters->page_id = 0;
        }
        
        return $parameters;
    }

}

$app->get('/:page_id/:app_id/:account_id/:token', function ($page_id, $app_id, $account_id, $token) {
    include './inc/incJSONHeaders.php';
    echo json_encode(PageWebService::RetrievePage($page_id,$app_id, $account_id, $token));
});

$app->post('/', function (){
    echo("THIS WAS A POST");
    $app = \Slim\Slim::getInstance();
    print_r($app->request);
});


$app->run();
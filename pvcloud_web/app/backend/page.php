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
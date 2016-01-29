<?php

require 'vendor/autoload.php';

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$app = new \Slim\Slim();

$app->post('/', function (){
    //print_r("THIS WAS A POST");
    $app = \Slim\Slim::getInstance();
    $credentials = new stdClass();
    $credentials->user = $app->request->headers->get("Php-Auth-User");
    $credentials->pass = $app->request->headers->get("Php-Auth-Pw");
    include 'inc/incJSONHeaders.php';
    echo(json_encode($credentials));
});


$app->run();
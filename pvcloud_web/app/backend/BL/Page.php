<?php

class Page {

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

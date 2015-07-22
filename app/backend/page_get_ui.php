<?php

/* * *
 * http://localhost:8080/pvcloud/backend/page_get_by_id.php?account_id=1&page_id=1&token=f40d375b097ab7254eff566d72adcc2cff1ba913
 * 
 * * */
error_reporting(E_ERROR);

class simpleResponse {

    public $status = "";
    public $message = "";
    public $data = [];

}

class be_page_ui {

    public $page_id = 0;
    public $app_id = 0;
    public $title = "";
    public $description = "";
    //public $visibility_type_id = 0;
    public $widgets = null;
    
}

class be_widget_ui {

    public $widget_id = 0;
    public $page_id = 0;
    public $widget_type_id = 0;
    public $title = "";
    public $description = "";
    public $order = 0;
    public $refresh_frequency_sec = 0;
    public $widget_configs = null;
    
}

require_once './DA/da_conf.php';
require_once './DA/da_helper.php';
require_once './DA/da_account.php';
require_once './DA/da_session.php';
require_once './DA/da_apps_registry.php';
require_once './DA/da_widgets.php';
require_once './DA/da_widget_config.php';


class beParameters {

    public $account_id = 0;
    public $token = "";
    public $app_id = 0;

}

class GetPageWebService {

    public static function RetrievePage() {
        $response = new simpleResponse();
        
        $parameters = GetPageWebService::collectParameters();
        
        try {
            $account_id = 0;
            include './inc/incWebServiceSessionValidation.php';

            if ($account_id > 0) {
                $page = da_apps_registry::GetPage($parameters->page_id);
                $pageUI = GetPageWebService::copyPageToUI($page);
                $pageUI->widgets = GetPageWebService::RetrieveWidgetsByPage($pageUI->page_id);
                GetPageWebService::RetrieveWidgetConfigsByWidget($pageUI->widgets);
                $response->status = "OK";
                $response->message = "SUCCESS";
                $response->data = $pageUI;
            } else {
                $response->status = "ERROR";
            }
        } catch (Exception $ex) {
            $response->status = "EXCEPTION";
            $response->message = $ex->getMessage();
        }
        return $response;
    }
    
    
    public static function RetrieveWidgetsByPage($pageId) {
        $widgets = da_widgets::GetWidgetsOfPage($pageId);
        $array = array();
        $i = 0;
        foreach($widgets as $widget) {
            $i ++;
            $widget_ui = new be_widget_ui();
            $widget_ui->title = $widget->title;
            $widget_ui->widget_id = $widget->widget_id;
            $widget_ui->page_id = $widget->page_id;
            $widget_ui->description = $widget->description;
            $widget_ui->widget_type_id = $widget->widget_type_id;
            $widget_ui->order = $widget->order;
            $widget_ui->refresh_frequency_sec = $widget->refresh_frequency_sec;
            
            array_push($array,$widget_ui);
            
        }
        
        return $array;
    }
    
    public static function RetrieveWidgetConfigsByWidget($widgets) {
        // $widgets = da_widgets::GetWidgetsOfPage($pageId);
        // return $widgets;
        foreach($widgets as $widget){
            $widgetConfigs = da_widget_config::GetWidgetConfigListByID($widget->widget_id);
            //$widgetConfigs = da_widget_config::GetWidgetConfigListByID($widget->widget_id);
            $widget->widget_configs = $widgetConfigs; 
        }
    }
    
    private static function copyPageToUI($page) {
        $pageUI = new be_page_ui();
        $pageUI->title = $page->title;
        $pageUI->description = $page->description;
        $pageUI->page_id = $page->page_id;
        $pageUI->app_id = $page->app_id;
        return $pageUI;
    }

    private static function collectParameters() {
        $parameters = new beParameters();
        $parameters->account_id = filter_input(INPUT_GET, "account_id");
        $parameters->token = filter_input(INPUT_GET, "token");
        $parameters->app_id = filter_input(INPUT_GET, "app_id");
        $parameters->page_id = filter_input(INPUT_GET, "page_id");
        
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

include './inc/incJSONHeaders.php';
echo json_encode(GetPageWebService::RetrievePage());

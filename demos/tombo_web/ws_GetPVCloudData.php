<?php

error_reporting(E_ERROR);

class WebServiceClass {

    /**
     * 
     * @return be_session
     */
    public static function WebServiceCall() {
        $account_id = 1;
        $app_id = 33;
        $api_key = "440707b410e99a5506af6cf2752633e0d8888f63";
        $label = filter_input(INPUT_GET, "label");
        $url = "https://www.costaricamakers.com/pvcloud_pre/backend/vse_get_value_last.php?account_id=$account_id&app_id=$app_id&api_key=$api_key&optional_label=$label";


        $result = file_get_contents($url, false);
        return $result;
    }
}

$result = WebServiceClass::WebServiceCall();

header('Content-Type: application/json');
echo $result;

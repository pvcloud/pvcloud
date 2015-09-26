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
        $value = filter_input(INPUT_GET, "value");
        $type = "STRING";
        $url = "https://www.costaricamakers.com/pvcloud_pre/backend/vse_add_value.php?account_id=$account_id&app_id=$app_id&api_key=$api_key&label=$label&value=$value&type=$type&captured_datetime=";


// prepare the body data. Example is JSON here
//        $data = json_encode(array(
//            'description' => 'Inspiring Poetry',
//            'public' => 'true',
//            'files' => array(
//                'poem.txt' => array(
//                    'content' => 'If I had the time, I\'d make a rhyme'
//                )
//            )
//        ));

// set up the request context
//        $options = ["http" => [
//                "method" => "GET",
//                "header" => ["Content-Type: application/json"],
//                "content" => $data
//        ]];
//        $context = stream_context_create($options);

// make the request
        //$result = file_get_contents($url, false, $context);
        $result = file_get_contents($url, false);
        return $result;
    }
}

$result = WebServiceClass::WebServiceCall();

header('Content-Type: application/json');
echo $result;

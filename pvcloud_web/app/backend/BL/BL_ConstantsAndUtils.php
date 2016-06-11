<?php

define("STATUS_OK", "OK");
define("STATUS_ERROR_AUTHENTICATION", "ERROR_AUTHENTICATION");
define("STATUS_ERROR_INVALID_PARAMETERS", "ERROR_PARAMETERS");
define("STATUS_EXCEPTION", "EXCEPTION");
define("TEST_REPORT_TYPE_SUCCESS","TEST_REPORT_TYPE_SUCCESS");
define("TEST_REPORT_TYPE_ERROR","TEST_REPORT_TYPE_ERROR");
define("TEST_REPORT_TYPE_INFO","TEST_REPORT_TYPE_INFO");

/**
 * Utilitary Class
 */
class Utils {

    /**
     * Sends HTML code to report the provided $message using style predefined for the $test_report_type
     * @param string $message Message to report
     * @param string $test_report_type use one of the constants defined in this file as TEST_REPORT_TYPE_***
     */
    public static function test_report($message, $test_report_type){
       
        if($test_report_type == TEST_REPORT_TYPE_INFO){
            $color="navy";
        } else if ($test_report_type==TEST_REPORT_TYPE_SUCCESS){
            $color="green";
        } else if ($test_report_type==TEST_REPORT_TYPE_ERROR){
            $color="red";
        }
        $moment = Utils::GetFormattedDateTime();
        $message = $moment." - ".$message;
        $html = "<p style=color:'$color'>$message</p><hr>";
        echo($html);
    }
    
    public static function FixCapturedDatetime($dataToFix){
        if(!isset($dataToFix)){
            return Utils::GetFormattedDateTime();
        }
        return $dataToFix;
    }
    public static function GetFormattedDateTime(){
        return Date("Y-m-d H:i:s");
    }
    
    /**
     * Determines (true or false) if a provided string ($searchIn) begins with a ($searchFor) string
     * @param type $searchIn
     * @param type $searchFor 
     * @return boolean Returns true if searchIn string begins with $searchFor string. Returns false otherwise
     */
    public static function BeginsWith($searchIn, $searchFor) {
        if (substr($searchIn, strlen($searchFor)) == $searchFor) {
            return true;
        }

        return false;
    }

    /**
     * Determines (true or false) if a provided string ($searchIn) contains another povided string ($searchFor).
     * @param type $searchIn
     * @param type $searchFor
     * @return boolean
     */
    public static function Contains($searchIn, $searchFor) {
        $haystack = $searchIn;
        $needle = $searchFor;
        if (strpos($haystack, $needle) > -1) {
            return true;
        }
        return false;
    }

}

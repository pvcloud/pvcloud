<?php

/* TEST: 
 * https://localhost/pvcloud_backend/vse_get_csv.php?account_id=1&app_id=1&api_key=c55452a9bdacdc0dc15919cdfe8d8f7d4c05ac5e
 * https://localhost/pvcloud_backend/vse_get_csv.php?account_id=1&app_id=1&api_key=c55452a9bdacdc0dc15919cdfe8d8f7d4c05ac5e&value_label=TEST_01&count_limit=3
 */
error_reporting(E_ERROR);

require_once './DA/da_conf.php';
require_once './DA/da_helper.php';
require_once './DA/da_apps_registry.php';
require_once './DA/da_vse_data.php';

class beParameters {

    public $account_id = 0;
    public $app_id = 0;
    public $value_label = "";
    public $count_limit = 0;

}

class CSVWebService {
    
    public static function GenerateCSV() {
        try {
            $app_id = 0; //THIS WILL BE OVERRIDEN BY THE INCLUDE 
            $account_id = 0; //THIS WILL BE OVERRIDEN BY THE INCLUDE 
            $access = "RO";  
            include './inc/incWebServiceAPIKeyValidation.php';

            $parameters = CSVWebService::collectParameters();
            $parameters->app_id = $app_id;
            $parameters->account_id = $account_id;

            $entries = da_vse_data::GetEntries($parameters->app_id, $parameters->value_label, $parameters->count_limit);

            $csv = CSVWebService::generateCSVContent($entries);

            return $csv;
        } catch (Exception $ex) {
            return $ex;
        }

        return null;
    }

    private static function collectParameters() {
        $parameters = new beParameters();
        $parameters->value_label = filter_input(INPUT_GET, "value_label");
        $parameters->count_limit = filter_input(INPUT_GET, "count_limit");

        if (!isset($parameters->value_label)) {
            $parameters->value_label = "";
        }

        if (!isset($parameters->count_limit)) {
            $parameters->count_limit = 0;
        }

        return $parameters;
    }

    /**
     * Generates CSV Content out of data queried from pvCloud.
     * by @janunezc
     * @param Array $entries The data to generate CSV from
     * @return string Contains data in CSV format
     */
    private static function generateCSVContent($entries) {
        $isFirstRecord = true;
        $result = "";
        foreach ($entries as $row) {
            if ($isFirstRecord) {
                $csvHeader = CSVWebService::resolveCSVHeader($row);
                $isFirstRecord = false;
                $result .= $csvHeader;
            }

            $csvRow = CSVWebService::resolveCSVRow($row);
            $result .= $csvRow;
        }

        return $result;
    }

    /**
     * Creates a CSV line with header names based on $row property names
     * @param type $row
     * @return string
     */
    private static function resolveCSVHeader($row) {
        $columnAdditions = "";
        $csvHeader = "";
        foreach ($row as $propertyName => $propertyValue) {

            $sanitizedPropertyName = CSVWebService::sanitizeDoubleQuotes($propertyName);
            $csvHeader.= '"' . $sanitizedPropertyName . '"' . ",";
            
            if ($propertyName == "vse_value") {
                $columnAdditions = CSVWebService::getColumnAdditions($propertyValue);
            }
        }
        
        $csvHeader.= $columnAdditions;
        $csvHeaderWoEndingComma = CSVWebService::removeEndingComma($csvHeader) . "\r\n";

        return $csvHeaderWoEndingComma;
    }
    
    /**
     * Converts an array ($row) into a CSV string ended by CRLF
     * @param type $row
     * @return string CSV String
     */
    private static function resolveCSVRow($row) {
        $csvRow = "";
        $valueAdditions = "";
        foreach ($row as $propertyName => $propertyValue) {
            $sanitizedValue = CSVWebService::sanitizeDoubleQuotes($propertyValue);
            $csvRow .= '"' . $sanitizedValue . '"' . ",";

            
            if ($propertyName == "vse_value") {
                $valueAdditions = CSVWebService::getValueAdditions($propertyValue);
            }
        }

        $csvRow .= $valueAdditions;
        $fixedCSVRow = CSVWebService::removeEndingComma($csvRow) . "\r\n";
        return $fixedCSVRow;
    }

    /**
     * Determines if the value passed on is of type SIMPLE_OBJECT (true) or of type SIMPLE_VALUE (false)
     * SIMPLE OBJECT means it is a string containing a JSON construct with one level of properties. 
     * @param string $jsonDecoded
     */
    private static function isSimpleObject($jsonDecoded) {
        if ($jsonDecoded != null) {
            if (is_string($jsonDecoded)) {
                return false;
            } else if (is_object($jsonDecoded)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Resolves which columns have to be added for a given $value if it has a simple JSON object
     * @param string $value
     * @return string
     */
    private static function getColumnAdditions($value) {
        $columnAdditions = "";
        $jsonDecoded = json_decode($value);

        if (CSVWebService::isSimpleObject($jsonDecoded)) {
            $position = 0;
            foreach ($jsonDecoded as $propertyName => $propertyValue) {
                $columnAdditions.= '"vse_value_' . $position . '"' . ",";
                $position++;
            }
        }

        return $columnAdditions;
    }

    /**
     * resolves which values have to be added to CSV row if $value contains a JSON object.
     * @param string $value
     * @return string
     */
    private static function getValueAdditions($value) {
        $valueAdditions = "";
        $jsonDecoded = json_decode($value);

        if (CSVWebService::isSimpleObject($jsonDecoded)) {
            foreach ($jsonDecoded as $propertyName => $propertyValue) {
                $valueAdditions.='"' . $propertyValue . '"' . ",";
            }
        }

        return $valueAdditions;
    }

    /**
     * Looks for double quotes within csv values and duplicates them to be propery processed.
     * @param string $pieceOfData
     * @return string
     */
    private static function sanitizeDoubleQuotes($pieceOfData) {
        return str_replace("\"", "\"\"", $pieceOfData);
    }

    /**
     * removes the expected ending comma on CSV row or CSV header being constructed
     * @param type $row
     * @return type
     */
    private static function removeEndingComma($row) {
        $lastCommaPosition = strlen($row) - 1;
        $fixedRow = substr($row, 0, $lastCommaPosition);
        return $fixedRow;
    }

}

include './inc/incCSVHeaders.php';
echo CSVWebService::GenerateCSV();

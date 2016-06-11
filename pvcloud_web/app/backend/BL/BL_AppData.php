<?php

/**
 * Business Logic to process VSE data
 *
 * @author janunezc
 */
class BL_AppData {

    /**
     * Writes data to pvCloud
     * @param int $app_id ID of the app to write to
     * @param string $key Authentication secret
     * @param string $label name of the value to be stored
     * @param string $value actual value
     * @param dateTime $captured_datetime Date and Time the value was captured
     * @return \SimpleResponse
     */
    public static function Write($app_id, $key, $label, $value, $captured_datetime) {

        $wsResult = new SimpleResponse();

        try {
            if (!isset($captured_datetime)) {
                $captured_datetime = Utils::FixCapturedDatetime($captured_datetime);
            }

            $validationResults = BL_AppData::validateForWrite($app_id, $key, $label, $value, $captured_datetime);


            if (count($validationResults) === 0) {
                if (BL_AppData::authenticate($app_id, $key)) {

                    $entry = new be_vse_data();
                    $entry->app_id = $app_id;
                    $entry->vse_label = $label;
                    $entry->vse_value = $value;
                    $entry->captured_datetime = $captured_datetime;

                    $data = da_vse_data::AddEntry($entry);

                    $wsResult->status = STATUS_OK;
                    $wsResult->data = $data;
                } else {
                    $wsResult->status = STATUS_ERROR_AUTHENTICATION;
                    $wsResult->message = STATUS_ERROR_AUTHENTICATION;
                }
            } else {
                $wsResult->status = STATUS_ERROR_INVALID_PARAMETERS;
                $wsResult->validationCodes = $validationResults;
            }
        } catch (Exception $e) {
            $wsResult->status = STATUS_EXCEPTION;
            $wsResult->message = $e->getMessage();
        }

        return $wsResult;
    }

    /**
     * Returns a number or records (defined by count) for an app and a given label. If label is empty, returns last records from any label. If Count is 0 or empty then returns just one last record.
     * @param type $app_id
     * @param type $key
     * @param type $label
     * @param type $count
     * @return \SimpleResponse
     */
    public static function Read($app_id, $key, $label, $count) {
        $wsResult = new SimpleResponse();
        try {
            $validationResults = BL_AppData::validateForRead($app_id, $key, $label, $count);
            if (count($validationResults) === 0) {
                if (BL_AppData::authenticate($app_id, $key)) {
                    $data = da_vse_data::GetEntries($app_id, $label, $count);
                    $wsResult->status = STATUS_OK;
                    $wsResult->data = $data;
                } else {
                    $wsResult->status = STATUS_ERROR_AUTHENTICATION;
                    $wsResult->message = STATUS_ERROR_AUTHENTICATION;
                }
            } else {
                $wsResult->status = STATUS_ERROR_INVALID_PARAMETERS;
                $wsResult->validationCodes = $validationResults;
            }
        } catch (Exception $e) {
            $wsResult->status = STATUS_EXCEPTION;
            $wsResult->message = $e->getMessage();
        }

        return $wsResult;
    }

    /**
     * Deletes data of an app for the specified label if any, or any label if not label is not provided. Deletes last record if count is not provided or as many records as specified by count.
     * @param type $app_id
     * @param type $key
     * @param type $label
     * @param type $count
     * @return \SimpleResponse
     */
    public static function Delete($app_id, $key, $return_deleted_data, $label, $count) {

        $wsResult = new SimpleResponse();

        try {
            $validationResults = BL_AppData::validateForDelete($app_id, $key, $label, $count);

            if (count($validationResults) === 0) {
                if (BL_AppData::authenticate($app_id, $key)) {

                    $data = da_vse_data::ClearEntries($app_id, $label, $count, $return_deleted_data);

                    $wsResult->status = STATUS_OK;
                    $wsResult->data = $data;
                } else {
                    $wsResult->status = STATUS_ERROR_AUTHENTICATION;
                    $wsResult->message = STATUS_ERROR_AUTHENTICATION;
                }
            } else {
                $wsResult->status = STATUS_ERROR_INVALID_PARAMETERS;
                $wsResult->validationCodes = $validationResults;
            }
        } catch (Exception $e) {
            $wsResult->status = STATUS_EXCEPTION;
            $wsResult->message = $e->getMessage();
        }

        return $wsResult;
    }

    /**
     * Saves uploaded file to persistent location and creates vse entry
     * @param type $app_id
     * @param type $key
     * @param type $label
     * @param type $captured_datetime
     * @return \SimpleResponse
     */
    public static function SaveFile($app_id, $key, $label, $captured_datetime) {

        $wsResult = new SimpleResponse();

        try {
            if (!isset($captured_datetime)) {
                $captured_datetime = Utils::FixCapturedDatetime($captured_datetime);
            }

            $validationResults = BL_AppData::validateForSaveFile($app_id, $key, $label);


            if (count($validationResults) === 0) {
                if (BL_AppData::authenticate($app_id, $key)) {

                    $entry = new be_vse_data();
                    $entry->app_id = $app_id;
                    $entry->vse_label = $label;
                    $entry->captured_datetime = $captured_datetime;

                    $fileResult = BL_AppData::doSaveFile($app_id, $label, $captured_datetime);

                    $data = BL_AppData::createFileVSEEntry($app_id, $label, $captured_datetime, $fileResult);

                    $wsResult->status = STATUS_OK;
                    $wsResult->data = $data;
                } else {
                    $wsResult->status = STATUS_ERROR_AUTHENTICATION;
                    $wsResult->message = STATUS_ERROR_AUTHENTICATION;
                }
            } else {
                $wsResult->status = STATUS_ERROR_INVALID_PARAMETERS;
                $wsResult->validationCodes = $validationResults;
            }
        } catch (Exception $e) {
            $wsResult->status = STATUS_EXCEPTION;
            $wsResult->message = $e->getMessage();
        }

        return $wsResult;
    }

    /**
     * Performs parameters validation and returns array with  any error found.
     * @param type $app_id
     * @param type $key
     * @param type $label
     * @param type $count
     * @return array
     */
    private static function validateForRead($app_id, $key, $label, $count) {
        $validationErrors = [];
        if (!(isset($app_id) && is_numeric($app_id) && $app_id > 0)) {
            $validationErrors[] = "APP_INVALID";
        }

        if (!(isset($key) && is_string($key) && $key != "" )) {
            $validationErrors[] = "KEY_INVALID";
        }

        if (!((isset($label) && is_string($label)) || !isset($label))) {
            $validationErrors[] = "LABEL_INVALID";
        }

        if (!((isset($count) && is_numeric($count) && $count >= 0) || !isset($count))) {
            $validationErrors[] = "COUNT_INVALID";
        }

        return $validationErrors;
    }

    /**
     * Performs parameters validation and returns array with  any error found.
     * @param type $app_id
     * @param type $key
     * @param type $label
     * @param type $value
     * @param type $captured_datetime
     * @return array
     */
    private static function validateForWrite($app_id, $key, $label, $value, $captured_datetime) {
        $validationErrors = [];
        if (!(isset($app_id) && is_numeric($app_id) && $app_id > 0)) {
            $validationErrors[] = "APP_INVALID";
        }

        if (!(isset($key) && is_string($key) && $key != "" )) {
            $validationErrors[] = "KEY_INVALID";
        }

        if (!((isset($label) && is_string($label)))) {
            $validationErrors[] = "LABEL_INVALID";
        }

        if (!((isset($value) && is_string($value)))) {
            $validationErrors[] = "VALUE_INVALID";
        }

        if (!isset($captured_datetime)) {
            $validationErrors[] = "CAPTURED_DATETIME_INVALID";
        }

        return $validationErrors;
    }

    /**
     * Performs parameters validation and returns array with  any error found.
     * @param type $app_id
     * @param type $key
     * @param type $label
     * @param type $count
     * @return array
     */
    private static function validateForDelete($app_id, $key, $label, $count) {
        $validationErrors = [];
        if (!(isset($app_id) && is_numeric($app_id) && $app_id > 0)) {
            $validationErrors[] = "APP_INVALID";
        }

        if (!(isset($key) && is_string($key) && $key != "" )) {
            $validationErrors[] = "KEY_INVALID";
        }

        if (!((isset($label) && is_string($label)) || !isset($label))) {
            $validationErrors[] = "LABEL_INVALID";
        }

        if (!((isset($count) && is_numeric($count) && $count >= 0) || !isset($count) || $count == "*")) {
            $validationErrors[] = "COUNT_INVALID";
        }

        return $validationErrors;
    }

    /**
     * Performs parameters validation and returns array with  any error found.
     * @param type $app_id
     * @param type $key
     * @param type $label
     * @return array
     */
    private static function validateForSaveFile($app_id, $key, $label) {
        $validationErrors = [];
        if (!(isset($app_id) && is_numeric($app_id) && $app_id > 0)) {
            $validationErrors[] = "APP_INVALID";
        }

        if (!(isset($key) && is_string($key) && $key != "" )) {
            $validationErrors[] = "KEY_INVALID";
        }

        if (!((isset($label) && is_string($label)))) {
            $validationErrors[] = "LABEL_INVALID";
        }

        return $validationErrors;
    }

    /**
     * Moves uploaded file to permanent location
     * @return \stdClass
     * @throws Exception
     */
    public static function doSaveFile() {

        $fileResult = new stdClass();
        $target_dir = "vse_files/";

        //TODO: Need to add a random factor that cannot be guessed through brute force.
        $fileResult->file_guid = uniqid("file_", true);
        $fileResult->file_name = $_FILES["vse_file"]["name"];
        $target_file = $target_dir . $fileResult->file_guid;

        if (file_exists($target_file)) {
            throw new Exception("File Already Exists");
        }

        if (!file_exists($target_dir)) {
            mkdir($target_dir);
        }

        if ($_FILES["vse_file"]["size"] > 100000000) {
            throw new Exception("File is too large");
        }

        if (move_uploaded_file($_FILES["vse_file"]["tmp_name"], $target_file)) {
            return $fileResult;
        } else {
            throw new Exception("File Upload Failed for " . $_FILES["vse_file"]["tmp_name"] . " with target $target_file");
        }
    }

    /**
     * Creates a VSE entry for an uploaded file. 
     * @param type $app_id
     * @param type $label
     * @param type $captured_datetime
     * @param type $fileResult
     * @return type
     */
    private static function createFileVSEEntry($app_id, $label, $captured_datetime, $fileResult) {
        $vseEntry = new be_vse_data();
        $vseEntry->app_id = $app_id;
        $vseEntry->vse_label = $label;

        $fileSimpleObject = new stdClass();
        $fileSimpleObject->file_name = $fileResult->file_name;
        $fileSimpleObject->file_guid = $fileResult->file_guid;

        $vseEntry->vse_value = json_encode($fileSimpleObject);
        $vseEntry->vse_type = "_FILE_";
        $vseEntry->captured_datetime = $captured_datetime;

        $savedEntry = da_vse_data::AddEntry($vseEntry);
        return $savedEntry;
    }

    /**
     * Validates access for given app_id and key 
     * @param type $app_id
     * @param type $key
     */
    private static function authenticate($app_id, $key) {


        if (isset($app_id) && $app_id > 0 && isset($key) && $key != "") {
            $app = da_apps_registry::GetApp($app_id);
            if ($app->app_id == $app_id && $app->api_key == $key) {
                return true;
            }
        }
        return false;
    }

}

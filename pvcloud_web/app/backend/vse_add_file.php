<?php

/**
 * TO TEST USE THE fileUpload.html form. 
 */
error_reporting(E_ERROR);

require_once './DA/da_conf.php';
require_once './DA/da_helper.php';
require_once './DA/da_account.php';
require_once './DA/da_session.php';
require_once './DA/da_apps_registry.php';
require_once './DA/da_vse_data.php';
require_once './simple_response.php';

/**
 * Web Service to upload files
 */
class FileUploadWebService {

    /**
     * Main orchestrator. It takes file sent by client POST request and copies it to storage area and saves a VSE entry
     * @return \simple_response
     */
    public static function ProcessUploadedFile() {
        $response = new simple_response(); //@var $response simple_response

        $params = FileUploadWebService::collectPOSTParameters();
        $parameterErrors = FileUploadWebService::validateParameters($params);
        if (count($parameterErrors) > 0) {
            $response->Status = "ERROR";
            $response->Message = "File Upload Failed - Wrong Parameters";
            $response->Data = $parameterErrors;
            return $response;
        } else {
            $response = FileUploadWebService::copyUploadedFile($params);

            $vseEntry = FileUploadWebService::createVSEEntry($params);
            if ($vseEntry->entry_id > 0) {
                $response->Status = "OK";
                $response->Message = "File Uploaded Successfully";
                $response->Data = $vseEntry;
            } else {
                $response->Status = "ERROR";
                $response->Message = "File upload failed - Error creating VSE Entry";
                $response->Data = $vseEntry;
            }
        }

        return $response;
    }

    private static function collectPOSTParameters() {
        $parameters = new stdClass();
        $parameters->app_id = filter_input(INPUT_POST, "app_id");
        $parameters->api_key = filter_input(INPUT_POST, "api_key");
        $parameters->vse_label = filter_input(INPUT_POST, "vse_label");
        $parameters->captured_datetime = filter_input(INPUT_POST, "captured_datetime");
        return $parameters;
    }

    private static function validateParameters() {
        return NULL;
    }

    private static function copyUploadedFile($params) {
        $target_dir = "vse_files/";

//TODO: Need to add a random factor that cannot be guessed through brute force.
        $params->file_guid = uniqid("file_", true);
//----------------------------------------------------------------------------

        $params->file_name = $_FILES["fileToUpload"]["name"];

        try {
            $target_file = $target_dir . $params->file_guid;

// Check if file already exists
            if (file_exists($target_file)) {
                return "Sorry, file already exists.";
            }
// Check file size
            if ($_FILES["fileToUpload"]["size"] > 100000000) {
                return "Sorry, your file is too large.";
            }

            if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
                return "";
            } else {
                return "Sorry, there was an error uploading your file.";
            }
        } catch (Exception $ex) {
            return $ex->getMessage();
        }
    }

    private static function createVSEEntry($params) {
        $vseEntry = new be_vse_data();
        $vseEntry->app_id = $params->app_id;
        $vseEntry->vse_label = $params->vse_label;

        $fileSimpleObject = new stdClass();
        $fileSimpleObject->file_name = $params->file_name;
        $fileSimpleObject->file_guid = $params->file_guid;

        $vseEntry->vse_value = json_encode($fileSimpleObject);
        $vseEntry->vse_type = "_FILE_";
        $vseEntry->vse_annotations = $params->vse_annotations;
        $vseEntry->captured_datetime = $params->captured_datetime;

        $savedEntry = da_vse_data::AddEntry($vseEntry);
        return $savedEntry;
    }

}

include './inc/incJSONHeaders.php';
$result = FileUploadWebService::ProcessUploadedFile();
echo json_encode($result);

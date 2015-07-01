<?php

/**
 * Description of da_account
 *
 * @author janunezc
 */
class be_account_network {
    
    public $account_network_id = 0;
    public $requester_account_id = 0;
    public $requested_account_id = 0;
    public $accepted = 0;

    public $created_datetime = NULL;
    public $modified_datetime = NULL;
    public $deleted_datetime = NULL;

}

class da_account_network {

    public static function AddRequest($requester_account_id, $requested_account_id){

        $sqlCommand = "INSERT INTO accounts_network(requester_account_id, requested_account_id, created_datetime)"
                . "VALUES (?,?, NOW())";

        $paramTypeSpec = "ii";

        $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
            $msg = "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            $msg = "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->bind_param($paramTypeSpec, $requester_account_id, $requested_account_id)) {
            $msg = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->execute()) {
            $msg = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        $stmt->close();

        $insertedID = $mysqli->insert_id;
        
        $retrievedRecord = da_account::GetAccountNetworkEntry($insertedID);
        return $retrievedRecord;        
    }
    
    
    public static function GetAccountNetworkEntry($account_network_id){
//        $sqlCommand = ""
//                . "SELECT  account_network_id,  "
//                . " FROM account_network WHERE account_network_id=? ";
//
//        $mysqli = DA_Helper::mysqli_connect();
//        if ($mysqli->connect_errno) {
//            $msg = "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
//            throw new Exception($msg, $mysqli->connect_errno);
//        }
//
//        if (!($stmt = $mysqli->prepare($sqlCommand))) {
//            $msg = "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
//            throw new Exception($msg, $stmt->errno);
//        }
//
//        if (!$stmt->bind_param("i", $account_network_id)) {
//            $msg = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
//            throw new Exception($msg, $stmt->errno);
//        }
//
//        if (!$stmt->execute()) {
//            $msg = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
//            throw new Exception($msg, $stmt->errno);
//        }
//
//        $result = new be_account_network();
//        $stmt->bind_result(
//                $result->app_id, $result->account_id, $result->app_nickname, $result->app_description, $result->api_key, $result->visibility_type_id, $result->created_datetime, $result->modified_datetime, $result->deleted_datetime, $result->last_connected_datetime
//        );
//
//        if (!$stmt->fetch()) {
//            $result = NULL;
//        }
//
//        $stmt->close();
//
//        return $result;        
    }
    
    

}

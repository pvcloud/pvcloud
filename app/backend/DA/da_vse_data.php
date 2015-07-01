<?php

/**
 * @author janunezc
 */
class be_vse_data {

    public $entry_id = 0;
    public $app_id = 0;
    public $vse_label = "";
    public $vse_value = "";
    public $vse_type = "";
    public $vse_annotations = "";
    public $created_datetime = NULL;
    public $captured_datetime = NULL;

}

class da_vse_data {

    /**
     * 
     * @param be_vse_data $entry Datagram containing all data to be registered.
     * @return \be_vse_data value inserted
     */
    public static function AddEntry($entry) {
        $sqlCommand = "INSERT INTO vse_data (app_id,vse_label, vse_value, vse_type, vse_annotations,captured_datetime)"
                . " VALUES (?,?,?,?,?,?)";

        $paramTypeSpec = "isssss";
        $mysqli = DA_Helper::mysqli_connect();

        if ($mysqli->connect_errno) {
            $msg = "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
            throw new Exception($msg, $mysqli->connect_errno);
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            $msg = "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->bind_param($paramTypeSpec, $entry->app_id, $entry->vse_label, $entry->vse_value, $entry->vse_type, $entry->vse_annotations, $entry->captured_datetime)) {
            $msg = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }
        if (!$stmt->execute()) {
            $msg = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        $stmt->close();

        $insertedEntryID = $mysqli->insert_id;

        $insertedEntry = da_vse_data::getSpecificEntry($insertedEntryID);
        return $insertedEntry;
    }

    /**
     * 
     * @param int $app_id
     * @param int $optional_vse_label Use it to retrieve specific labels for a app. Leave NULL to return all values of app regardless of label
     * @param int $optional_last_limit Max Quantity to return. Will return last number of records specified.
     * @return array
     */
    public static function GetEntries($app_id, $optional_vse_label, $optional_last_limit) {
        $sqlCommand = "SELECT  entry_id,app_id,vse_label,vse_value,vse_type,vse_annotations,captured_datetime,created_datetime "
                . " FROM vse_data "
                . " WHERE app_id = ? AND (vse_label = ? OR ? = '') "
                . " ORDER BY entry_id DESC ";


        if (isset($optional_last_limit) && $optional_last_limit != NULL && is_numeric($optional_last_limit) && $optional_last_limit > 0) {
            $sqlCommand .= " LIMIT $optional_last_limit ";
        }

        $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
            echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
        }

        if (!$stmt->bind_param("iss", $app_id, $optional_vse_label, $optional_vse_label)) {
            echo "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
        }

        if (!$stmt->execute()) {
            echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
        }

        $entry = new be_vse_data();

        $stmt->bind_result(
                $entry->entry_id, $entry->app_id, $entry->vse_label, $entry->vse_value, $entry->vse_type, $entry->vse_annotations, $entry->captured_datetime, $entry->created_datetime);

        $arrayResult = [];
        while ($stmt->fetch()) {
            $arrayResult[] = json_decode(json_encode($entry));
        }

        $stmt->close();

        return $arrayResult;
    }

    /**
     * 
     * @param type $app_id
     * @param type $optional_vse_label
     * @return \be_vse_data
     */
    public static function GetLastEntry($app_id, $optional_vse_label) {
        $sqlCommand = "SELECT  entry_id,app_id,vse_label,vse_value,vse_type,vse_annotations,captured_datetime,created_datetime "
                . " FROM vse_data "
                . " WHERE app_id = ? AND (vse_label = ? OR ? = '') "
                . " ORDER BY entry_id DESC"
                . " LIMIT 1";

        $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
            $msg = "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
            throw new Exception($msg, $mysqli->connect_errno);
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            $msg = "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->bind_param("iss", $app_id, $optional_vse_label, $optional_vse_label)) {
            $msg = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->execute()) {
            $msg = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        $result = new be_vse_data();
        $stmt->bind_result(
                $result->entry_id, $result->app_id, $result->vse_label, $result->vse_value, $result->vse_type, $result->vse_annotations, $result->captured_datetime, $result->created_datetime
        );

        if (!$stmt->fetch()) {
            $result = NULL;
        }

        $stmt->close();

        return $result;
    }

    /**
     * 
     * @param type $app_id
     * @param type $optional_vse_label Use it to clear entries of an specific label for the provided app.
     * @return boolean
     */
    public static function ClearEntries($app_id, $optional_vse_label) {
        $sqlCommand = "DELETE FROM vse_data "
                . " WHERE app_id = ? AND (vse_label = ? OR ? = '') ";

        $paramTypeSpec = "iss";

        $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
            $msg = "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
            throw new Exception($msg, $mysqli->errno);
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            $msg = "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->bind_param($paramTypeSpec, $app_id, $optional_vse_label, $optional_vse_label)) {
            $msg = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->execute()) {
            $msg = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        $stmt->close();

        $retrievedEntries = da_vse_data::GetEntries($app_id, $optional_vse_label, 0);
        return $retrievedEntries;
    }

    /**
     * 
     * @param int $entry_id
     * @return \be_vse_data
     */
    private static function getSpecificEntry($entry_id) {
        $sqlCommand = "SELECT  entry_id,app_id,vse_label,vse_value,vse_type,vse_annotations,captured_datetime,created_datetime "
                . " FROM vse_data WHERE entry_id = ? ";

        $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
            $msg = "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
            throw new Exception($msg, $mysqli->connect_errno);
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            $msg = "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->bind_param("i", $entry_id)) {
            $msg = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->execute()) {
            $msg = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        $result = new be_vse_data();
        $stmt->bind_result(
                $result->entry_id, $result->app_id, $result->vse_label, $result->vse_value, $result->vse_type, $result->vse_annotations, $result->captured_datetime, $result->created_datetime
        );

        if (!$stmt->fetch()) {
            $result = NULL;
        }

        $stmt->close();

        return $result;
    }

}

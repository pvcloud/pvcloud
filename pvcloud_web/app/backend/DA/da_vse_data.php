<?php

//TODO: Explore whole DA to find missing throws
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
     * @param int $label Use it to retrieve specific labels for a app. Leave NULL to return all values of app regardless of label
     * @param int $count Max Quantity to return. Will return last number of records specified.
     * @return array
     */
    public static function GetEntries($app_id, $label, $count) {


        if ($label == "*" || !isset($label)) {
            $label = "";
        }

        $sqlCommand = "SELECT entry_id,app_id,vse_label,vse_value,vse_type,vse_annotations,captured_datetime,created_datetime "
                . " FROM vse_data "
                . " WHERE app_id = ? AND (vse_label = ? OR ? = '') "
                . " ORDER BY entry_id DESC ";

        if ($count == "*") {
            
        } else if ($count > 0) {
            $sqlCommand .= " LIMIT $count ";
        } else {
            $sqlCommand .= " LIMIT 1 ";
        }

        $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
            $msg = "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
            throw new Exception($msg, $mysqli->connect_errno);
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            $msg = "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
            throw new Exception($msg, $mysqli->connect_errno);
        }

        if (!$stmt->bind_param("iss", $app_id, $label, $label)) {
            $msg = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->execute()) {
            $msg = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
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

    public static function GetEntriesCount($app_id, $label, $count) {
        $sqlCommand = "SELECT Count(0) "
                . " FROM vse_data "
                . " WHERE app_id = ? AND (vse_label = ? OR ? = '') ";

        $countOfEntries = -1;

        $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
            $msg = "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
            throw new Exception($msg, $mysqli->connect_errno);
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            $msg = "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
            throw new Exception($msg, $mysqli->connect_errno);
        }

        if (!$stmt->bind_param("iss", $app_id, $label, $label)) {
            $msg = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->execute()) {
            $msg = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        $stmt->bind_result($countOfEntries);

        if ($stmt->fetch()) {
            if ($countOfEntries > $count) {
                $countOfEntries = $count;
            } else {
                
            }
        } else {
            
        }

        $stmt->close();

        return $countOfEntries;
    }

    public static function GetEntriesForWidget($widget_id, $optional_max_limit, $last_entry_id) {
        $sqlCommand = "SELECT  d.entry_id, d.app_id, d.vse_label, d.vse_value, d.vse_type,vse_annotations, d.captured_datetime, d.created_datetime "
                . " FROM vse_data d"
                . " INNER JOIN pages p ON p.app_id = d.app_id "
                . " INNER JOIN widgets w on w.page_id = p.page_id "
                . " WHERE w.widget_id  = ? AND d.vse_label in (select vse_label from widget_config where widget_id = ?) AND d.entry_id > ? "
                . " ORDER BY entry_id DESC ";


        if (isset($optional_max_limit) && $optional_max_limit != NULL && is_numeric($optional_max_limit) && $optional_max_limit > 0) {
            $sqlCommand .= " LIMIT $optional_max_limit ";
        }

        $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
            $msg = "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
            $errno = $mysqli->connect_errno;
            throw new Exception($msg, $errno);
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            $msg = "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
            $errno = $mysqli->errno;
            throw new Exception($msg, $errno);
        }

        if (!$stmt->bind_param("iii", $widget_id, $widget_id, $last_entry_id)) {
            $msg = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
            $errno = $stmt->errno;
            throw new Exception($msg, $errno);
        }

        if (!$stmt->execute()) {
            $msg = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
            $errno = $stmt->errno;
            throw new Exception($msg, $errno);
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
     * @param type $optional_label
     * @return \be_vse_data
     */
    public static function GetLastEntry($app_id, $optional_label) {
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

        if (!$stmt->bind_param("iss", $app_id, $optional_label, $optional_label)) {
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
     * Deletes entries in database for specific app id and label and count. 
     * When no label is specified any label will be deleted
     * When no count is specified, only last record of matching label 
     * @param type $app_id
     * @param type $label
     * @param type $count
     * @return type
     * @throws Exception
     */
    public static function ClearEntries($app_id, $label, $count, $return_deleted_entries) {

        $result = new stdClass();

        if (!isset($label) || $label == "*") {
            $label = "";
        }

        if (!isset($count)) {
            $count = 1;
        } else if ($count == "*") {
            $count = "200000"; //DELETE ALL
        }

        if ($return_deleted_entries == true) {
            $result->DeletedEntries = da_vse_data::GetEntries($app_id, $label, $count);
        } else {
            $result->DeleteCount = da_vse_data::GetEntriesCount($app_id, $label, $count);
        }

        $sqlCommand = ""
                . " DELETE FROM vse_data "
                . " WHERE app_id = ? AND (vse_label = ? OR ? = '') "
                . " ORDER BY entry_id DESC";

        $paramTypeSpec = "iss";

        if ($count > 0) {
            $sqlCommand .= " LIMIT ?";
            $paramTypeSpec .= "i";
        }

        $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
            $msg = "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
            throw new Exception($msg, $mysqli->errno);
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            $msg = "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
            throw new Exception($msg, $stmt->errno);
        }

        if ($paramTypeSpec == "iss") {
            if (!$stmt->bind_param($paramTypeSpec, $app_id, $label, $label)) {
                $msg = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
                throw new Exception($msg, $stmt->errno);
            }
        } else {
            if (!$stmt->bind_param($paramTypeSpec, $app_id, $label, $label, $count)) {
                $msg = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
                throw new Exception($msg, $stmt->errno);
            }
        }

        if (!$stmt->execute()) {
            $msg = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        $stmt->close();

        $result->RemainingEntries = da_vse_data::GetEntriesCount($app_id, $label, "200000");

        return $result;
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

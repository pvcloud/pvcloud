<?php

class be_generic_value_entry {

    public $entry_id = 0;
    public $app_id = 0;
    public $value_label = "";
    public $value = "";
    public $value_type_code = "";
    public $captured_datetime = NULL;
    public $created_datetime = NULL;

}

/**
 * Description of da_generic_value
 *
 * @author janunezc
 */
class da_generic_value {

    /**
     * Retrieve the last entry for a given app and given optional valuelabel
     * @param int $app_id
     * @param string $value_label
     */
    public static function GetEntry($entry_id) {
        $sqlCommand = "SELECT "
                . "entry_id,"
                . "app_id,"
                . "value_label,"
                . "value,"
                . "value_type_code,"
                . "captured_datetime,"
                . "created_datetime "
                . "FROM generic_value_log "
                . "WHERE entry_id = ?";

        $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
            echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
        }

        if (!$stmt->bind_param("i", $entry_id)) {
            echo "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
        }

        if (!$stmt->execute()) {
            echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
        }

        $valueEntry = new be_generic_value_entry();

        $stmt->bind_result(
                $valueEntry->entry_id, $valueEntry->app_id, $valueEntry->value_label, $valueEntry->value, $valueEntry->value_type_code, $valueEntry->captured_datetime, $valueEntry->created_datetime);

        $stmt->fetch();

        $stmt->close();

        return $valueEntry;
    }

    /**
     * Retrieve the last entry for a given app and given optional valuelabel
     * @param int $app_id
     * @param string $value_label
     */
    public static function GetLastEntry($app_id, $value_label) {
        $sqlCommand = "SELECT "
                . "entry_id,"
                . "app_id,"
                . "value_label,"
                . "value,"
                . "value_type_code,"
                . "captured_datetime,"
                . "created_datetime "
                . "FROM generic_value_log "
                . "WHERE app_id = ? AND (value_label = ? OR ? = '')"
                . "ORDER BY entry_id desc "
                . "LIMIT 1";

        $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
            echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
        }

        if (!$stmt->bind_param("iss", $app_id, $value_label, $value_label)) {
            echo "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
        }

        if (!$stmt->execute()) {
            echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
        }

        $valueEntry = new be_generic_value_entry();

        $stmt->bind_result(
                $valueEntry->entry_id, $valueEntry->app_id, $valueEntry->value_label, $valueEntry->value, $valueEntry->value_type_code, $valueEntry->captured_datetime, $valueEntry->created_datetime);

        $stmt->fetch();

        $stmt->close();

        return $valueEntry;
    }

    /**
     * 
     * @param int $app_id
     * @return \be_generic_value_entry
     */
    public static function GetLastDataByAppIDAndValueLabel($app_id, $value_label) {
        $sqlCommand = "SELECT "
                . "entry_id,"
                . "app_id,"
                . "value_label,"
                . "value,"
                . "value_type_code,"
                . "captured_datetime,"
                . "created_datetime "
                . "FROM generic_value_log "
                . "WHERE app_id = ? AND (value_label = ? OR ? = '') "
                . "ORDER BY entry_id DESC "
                . "LIMIT 1";

        $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
            echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
        }

        if (!$stmt->bind_param("iss", $app_id, $value_label, $value_label)) {
            echo "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
        }

        if (!$stmt->execute()) {
            echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
        }

        $valueEntry = new be_generic_value_entry();

        $stmt->bind_result(
                $valueEntry->entry_id, $valueEntry->app_id, $valueEntry->value_label, $valueEntry->value, $valueEntry->value_type_code, $valueEntry->captured_datetime, $valueEntry->created_datetime);

        $arrayResult = [];
        while ($stmt->fetch()) {
            $arrayResult[] = json_decode(json_encode($valueEntry));
        }

        $stmt->close();

        return $arrayResult[0];
    }
    
    /**
     * 
     * @param int $app_id
     * @return \be_generic_value_entry
     */
    public static function GetDataByAppIDAndValueLabel($app_id, $value_label) {
        $sqlCommand = "SELECT "
                . "entry_id,"
                . "app_id,"
                . "value_label,"
                . "value,"
                . "value_type_code,"
                . "captured_datetime,"
                . "created_datetime "
                . "FROM generic_value_log "
                . "WHERE app_id = ? AND (value_label = ? OR ? = '')";

        $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
            echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
        }

        if (!$stmt->bind_param("iss", $app_id, $value_label, $value_label)) {
            echo "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
        }

        if (!$stmt->execute()) {
            echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
        }

        $valueEntry = new be_generic_value_entry();

        $stmt->bind_result(
                $valueEntry->entry_id, $valueEntry->app_id, $valueEntry->value_label, $valueEntry->value, $valueEntry->value_type_code, $valueEntry->captured_datetime, $valueEntry->created_datetime);

        $arrayResult = [];
        while ($stmt->fetch()) {
            $arrayResult[] = json_decode(json_encode($valueEntry));
        }

        $stmt->close();

        return $arrayResult;
    }

    /**
     * 
     * @param int $app_id
     * @param string $value_label
     */
    public static function DeleteDataByAppIDAndValueLabel($app_id, $value_label) {
        $sqlCommand = "DELETE"
                . " FROM generic_value_log "
                . " WHERE app_id = ? AND (value_label = ? OR ? = '')";

       $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
            echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
        }

        if (!$stmt->bind_param("iss", $app_id, $value_label, $value_label)) {
            echo "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
        }

        if (!$stmt->execute()) {
            echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
        }

        $stmt->close();
        
        $result = new stdClass();
        
        $result->Status="DELETE SUCCESS";
        $result->app_id = $app_id;
        $result->value_label = $value_label;
        return $result;
    }

    public static function GetAllData() {
        $sqlCommand = "SELECT "
                . "entry_id,"
                . "app_id,"
                . "value_label,"
                . "value,"
                . "value_type_code,"
                . "captured_datetime,"
                . "created_datetime "
                . "FROM generic_value_log "
                . "ORDER BY entry_id desc ";

        $result = DA_Helper::ExecuteNonParametricQuery($sqlCommand);

        $arrayResult = [];
        while ($row = mysql_fetch_assoc($result)) {
            $arrayResult[] = $row;
        }

        return ($arrayResult);
    }

    /**
     * 
     * @param be_generic_value_entry $valueEntry
     * @return be_generic_value_entry
     */
    public static function AddNewEntry($valueEntry) {
        $created_datetime = DA_Helper::GetServerDate();

        $sqlCommand = "INSERT INTO generic_value_log ("
                . "app_id,"
                . "value_label,"
                . "value,"
                . "value_type_code,"
                . "captured_datetime,"
                . "created_datetime "
                . ")"
                . " VALUES(?,?,?,?,?,?)";

        $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
            echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
        }


        if (!$stmt->bind_param("isssss", $valueEntry->app_id, $valueEntry->value_label, $valueEntry->value, $valueEntry->value_type_code, $valueEntry->captured_datetime, $created_datetime
                )) {
            echo "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
        }

        if (!$stmt->execute()) {
            echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
        }

        $insertedID = $mysqli->insert_id;
        $stmt->close();

        $retrievedValue = da_generic_value::GetEntry($insertedID);
        print_r($retrievedValue);
        return $retrievedValue;
    }

}

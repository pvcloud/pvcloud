<?php

class be_widget_config  {

    public $widget_config_id = 0;
    public $widget_id = 0;
    public $vse_label = "";
    public $simple_object_property = "";
    public $friendly_label = 0;
    public $read_frequency = 0;
    public $options_json = "";
    public $created_datetime = NULL;
    public $modified_datetime = NULL;
    public $deleted_datetime = NULL;

}

class da_widget_config {

    /**
     * Jose Angel Comments to be placed here!!!!!
     * @param be_widget_config  $widgetConfigEntry
     * @return \be_widget_config 
     */
    public static function InsertWidgetConfig($widgetConfigEntry) {
        
        $sqlCommand = "INSERT INTO widget_config (widget_id, vse_label, simple_object_property, friendly_label , options_json, created_datetime )"
                . "VALUES (?,?,?,?,?,NOW())";

        
        $paramTypeSpec = "issss";

        $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
            $msg = "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
            throw new Exception($msg, $mysqli->connect_errno);
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            $msg = "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->bind_param($paramTypeSpec,
                $widgetConfigEntry->widget_id, 
                $widgetConfigEntry->vse_label, 
                $widgetConfigEntry->simple_object_property, 
                $widgetConfigEntry->friendly_label, 
                $widgetConfigEntry->options_json
                 )) {
            $msg = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->execute()) {
            $msg = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }
  

        $stmt->close();

        
        $insertedID = $mysqli->insert_id;
        
        $retrievedWidgetConfig = da_widget_config::GetWidgetConfigByID($insertedID);
        return $retrievedWidgetConfig;
        
       

    }

    /**
     * 
     * @param be_widget_config  $widgetConfigEntry
     * @return \be_widget_config
     */
    public static function UpdateWidgetConfig($widgetConfigEntry) {
        $sqlCommand = "UPDATE widget_config "
                . " SET widget_id = ?,"
                . " vse_label = ?,"
                . " simple_object_property = ?,"
                . " friendly_label = ?,"
                . " options_json = ?"
                . " WHERE widget_config_id = ? ";

     
        $paramTypeSpec = "issssi";
        
        $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
            $msg = "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
            throw new Exception($msg, $mysqli->connect_errno);
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            $msg = "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->bind_param($paramTypeSpec, 
                $widgetConfigEntry->widget_id,
                $widgetConfigEntry->vse_label,
                $widgetConfigEntry->simple_object_property, 
                $widgetConfigEntry->friendly_label, 
                $widgetConfigEntry->options_json, 
                $widgetConfigEntry->widget_config_id)) {
            $msg = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->execute()) {
            $msg = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        $stmt->close();

        $savedWidgetConfig = da_widget_config::GetWidgetConfigByID($widgetConfigEntry->widget_config_id);
        return $savedWidgetConfig;

    }

    /**
     * 
     * @param int $widget_config_id
     * @return \be_widget_config 
     */
    public static function DeleteWidgetConfig($widget_config_id) {
        
      $sqlCommand = "DELETE"
                . " FROM widget_config "
                . " WHERE widget_config_id = ?";
        
        $paramTypeSpec = "i";
        
        $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
            echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
        }

       if (!$stmt->bind_param($paramTypeSpec, $widget_config_id)) {
            $msg = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->execute()) {
            echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
        }

        $stmt->close();
        
        $result = new stdClass();
        
        $result->Status="DELETE SUCCESS";
        $result->$widget_config_id= $widget_config_id;
        return $result;

      
    }
    
    
    public static function GetWidgetConfigByID($widget_config_id) {
         
        $sqlCommand = "SELECT widget_config_id, widget_id, vse_label, simple_object_property, friendly_label , options_json, created_datetime, modified_datetime, deleted_datetime"
                . " FROM widget_config "
                . " WHERE widget_config_id = ?";
    
        $paramTypeSpec = "i";

        $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
            $msg = "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            $msg = "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->bind_param($paramTypeSpec, $widget_config_id)) {
            $msg = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->execute()) {
            $msg = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        $result = new be_widget_config();
        $stmt->bind_result($result->widget_config_id, $result->widget_id, $result->vse_label, $result->simple_object_property, $result->friendly_label, $result->options_json, $result->created_datetime, $result->modified_datetime, $result->deleted_datetime);

        if (!$stmt->fetch()) {
            $result = NULL;
        }

        $stmt->close();

        return $result;
    }
    
    public static function GetWidgetConfigListByID($widget_id) {
         
        $sqlCommand = "SELECT widget_config_id, widget_id, vse_label, simple_object_property, friendly_label, options_json"
                . " FROM widget_config "
                . " WHERE widget_id = ?";
        
        $paramTypeSpec = "i";

        $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
            $msg = "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            $msg = "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->bind_param($paramTypeSpec, $widget_id)) {
            $msg = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->execute()) {
            $msg = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        $result = new be_widget_config();
        $stmt->bind_result($result->widget_config_id, $result->widget_id, $result->vse_label, $result->simple_object_property, $result->friendly_label, $result->options_json);

        $arrayResult = [];
        while ($stmt->fetch()) {
            $arrayResult[] = json_decode(json_encode($result));
        }

        // if (!$stmt->fetch()) {
        //     $result = NULL;
        // }

        $stmt->close();

        return $arrayResult;
    }
    
}

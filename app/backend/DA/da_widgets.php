<?php

class be_widget {

    public $widget_id = 0;
    public $page_id = 0;
    public $widget_type_id = 0;
    public $title = "";
    public $description = "";
    public $order = 0;
    public $created_datetime = NULL;
    public $modified_datetime = NULL;
    public $deleted_datetime = NULL;

}

class da_widgets {

    /**
     * 
     * @param int $page_id
     * @return array of be_widget
     */
    public static function GetWidgetsOfPage($page_id) {
        $sqlCommand = "SELECT widget_id,page_id, widget_type_id, title, description, `order`, created_datetime, modified_datetime, deleted_datetime  "
                . "FROM page_widgets "
                . "WHERE page_id = ? AND deleted_datetime IS NULL "
                . "ORDER BY `order`, widget_id DESC ";

        $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
            echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
        }

        if (!$stmt->bind_param("i", $page_id)) {
            echo "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
        }

        if (!$stmt->execute()) {
            echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
        }

        $widgetEntry = new be_widget();

        $stmt->bind_result($widgetEntry->widget_id, $widgetEntry->page_id, $widgetEntry->widget_type_id, $widgetEntry->title, $widgetEntry->description, $widgetEntry->order, $widgetEntry->created_datetime, $widgetEntry->modified_datetime, $widgetEntry->deleted_datetime);

        $arrayResult = [];
        while ($stmt->fetch()) {
            $arrayResult[] = json_decode(json_encode($widgetEntry));
        }

        $stmt->close();

        return $arrayResult;
    }

    /**
     * 
     * @param int $widget_id
     * @return \be_widget
     */
    public static function GetWidget($widget_id) {
        $sqlCommand = "SELECT widget_id,page_id, widget_type_id, title, description, `order`, created_datetime, modified_datetime, deleted_datetime  "
                . "FROM page_widgets "
                . "WHERE widget_id = ? ";

        $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
            $msg = "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
            throw new Exception($msg, $mysqli->connect_errno);
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            $msg = "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->bind_param("i", $widget_id)) {
            $msg = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->execute()) {
            $msg = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        $widgetEntry = new be_page();
        $stmt->bind_result($widgetEntry->widget_id, $widgetEntry->page_id, $widgetEntry->widget_type_id, $widgetEntry->title, $widgetEntry->description, $widgetEntry->order, $widgetEntry->created_datetime, $widgetEntry->modified_datetime, $widgetEntry->deleted_datetime);

        if (!$stmt->fetch()) {
            $widgetEntry = NULL;
        }

        $stmt->close();

        return $widgetEntry;
    }

    /**
     * 
     * @param be_widget $widget
     * @return \be_widget
     */
    public static function AddWidget($widget) {
        
        $sqlCommand = "INSERT INTO page_widgets (page_id, widget_type_id, title, description, `order`, created_datetime )"
                . "VALUES (?,?,?,?,?, NOW())";

        $paramTypeSpec = "iissi";

        $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
            $msg = "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
            throw new Exception($msg, $mysqli->connect_errno);
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            $msg = "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->bind_param($paramTypeSpec,$widget->page_id, $widget->widget_type_id, $widget->title, $widget->description, $widget->order )) {
            $msg = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->execute()) {
            $msg = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        $stmt->close();
        
        da_widgets::reorderWidgets($widget->page_id);

        $insertedWidgetID = $mysqli->insert_id;
        
        $retrievedPage = da_widgets::GetWidget($insertedWidgetID);
        
        return $retrievedPage;
    }
    
    private static function reorderWidgets($page_id){
        $widgets = da_widgets::GetWidgetsOfPage($page_id);
        $orderIdx = 1;
        foreach($widgets as $widget){
            $widget->order = $orderIdx;
            da_widgets::UpdateWidget($widget);
            $orderIdx++;
        }
    }

    /**
     * 
     * @param be_widget $widget
     * @return \be_widget
     */
    public static function UpdateWidget($widget) {
        $sqlCommand = "UPDATE page_widgets "
                . " SET page_id= ?, widget_type_id= ?, title= ?, description= ?, `order`= ? "
                . " WHERE widget_id = ? ";

        $paramTypeSpec = "iissii";

        $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
            $msg = "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
            throw new Exception($msg, $mysqli->connect_errno);
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            $msg = "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->bind_param($paramTypeSpec, $widget->page_id, $widget->widget_type_id, $widget->title, $widget->description, $widget->order, $widget->widget_id)) {
            $msg = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->execute()) {
            $msg = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        $stmt->close();

        $retrievedWidget = da_widgets::GetWidget($widget->widget_id);
        return $retrievedWidget;
    }

    /**
     * 
     * @param int $widget_id
     * @return \be_widget
     */
    public static function RemoveWidget($widget_id) {
        $sqlCommand = "UPDATE page_widgets "
                . " SET deleted_datetime = NOW() "
                . " WHERE widget_id = ? ";

        $paramTypeSpec = "i";

        $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
            $msg = "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
            throw new Exception($msg, $mysqli->connect_errno);
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            $msg = "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->bind_param($paramTypeSpec, widget_id)) {
            $msg = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->execute()) {
            $msg = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        $stmt->close();

        $retrievedWidget = da_widgets::GetWidget($widget_id);
        return $retrievedWidget;
    }

}

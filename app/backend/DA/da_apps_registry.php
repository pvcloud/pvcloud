<?php

/**
 * Description of da_apps_registry
 *
 * @author janunezc
 */
class be_app {

    public $app_id = 0;
    public $account_id = 0;
    public $app_nickname = "";
    public $app_description = "";
    public $api_key = "";
    public $visibility_type_id = 0;
    public $created_datetime = NULL;
    public $modified_datetime = NULL;
    public $deleted_datetime = NULL;
    public $last_connected_datetime = NULL;

}

class be_page {

    public $page_id = 0;
    public $app_id = 0;
    public $title = "";
    public $description = "";
    public $visibility_type_id = 0;
    public $created_datetime = NULL;
    public $modified_datetime = NULL;
    public $deleted_datetime = NULL;
}

class da_apps_registry {

    /**
     * Registers a app and returns the resultant record as be_app
     * @param be_app $app
     * @return type
     */
    public static function RegisterNewApp($app) {
        $sqlCommand = "INSERT INTO app_registry (account_id,app_nickname,app_description,api_key, visibility_type_id, created_datetime)"
                . "VALUES (?,?,?,SHA1(UUID()),?, NOW())";

        $paramTypeSpec = "sssi";

        $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
            $msg = "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
            throw new Exception($msg, $mysqli->connect_errno);
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            $msg = "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->bind_param($paramTypeSpec, $app->account_id, $app->app_nickname, $app->app_description, $app->visibility_type_id)) {
            $msg = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->execute()) {
            $msg = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        $stmt->close();

        $insertedAppID = $mysqli->insert_id;

        $retrievedApp = da_apps_registry::GetApp($insertedAppID);
        return $retrievedApp;
    }

    /**
     * Returns a app found by its ID
     * @param int $app_id
     * @return be_app
     */
    public static function GetApp($app_id) {
        $sqlCommand = ""
                . "SELECT   app_id,account_id,app_nickname,app_description,api_key,visibility_type_id,created_datetime,modified_datetime,deleted_datetime,last_connected_datetime "
                . " FROM app_registry WHERE app_id=? ";

        $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
            $msg = "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
            throw new Exception($msg, $mysqli->connect_errno);
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            $msg = "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->bind_param("i", $app_id)) {
            $msg = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->execute()) {
            $msg = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        $result = new be_app();
        $stmt->bind_result(
                $result->app_id, $result->account_id, $result->app_nickname, $result->app_description, $result->api_key, $result->visibility_type_id, $result->created_datetime, $result->modified_datetime, $result->deleted_datetime, $result->last_connected_datetime
        );

        if (!$stmt->fetch()) {
            $result = NULL;
        }

        $stmt->close();

        return $result;
    }

    /**
     * Returns a list of apps for a given user account
     * @param type $account_id
     * return Array
     */
    public static function GetListOfApps($account_id) {
        $sqlCommand = "SELECT     app_id,account_id,app_nickname,app_description,api_key,visibility_type_id,created_datetime,modified_datetime,deleted_datetime,last_connected_datetime, (SELECT count(entry_id) FROM vse_data WHERE app_id = app_registry.app_id)  "
                . "FROM app_registry "
                . "WHERE account_id = ? AND deleted_datetime IS NULL";

        $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
            echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
        }

        if (!$stmt->bind_param("i", $account_id)) {
            echo "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
        }

        if (!$stmt->execute()) {
            echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
        }

        $appEntry = new be_app();

        $stmt->bind_result(
                $appEntry->app_id, $appEntry->account_id, $appEntry->app_nickname, $appEntry->app_description, $appEntry->api_key, $appEntry->visibility_type_id, $appEntry->created_datetime, $appEntry->modified_datetime, $appEntry->deleted_datetime, $appEntry->last_connected_datetime, $appEntry->records_count);

        $arrayResult = [];
        while ($stmt->fetch()) {
            $arrayResult[] = json_decode(json_encode($appEntry));
        }

        $stmt->close();

        return $arrayResult;
    }

    /**
     * Returns a list of UNDELETED pages for a given app_id
     * @param int $app_id
     * @return Array
     */
    public static function GetListOfPages($app_id) {
        $sqlCommand = "SELECT  page_id,app_id, title, description, visibility_type_id, created_datetime, modified_datetime "
                . "FROM pages "
                . "WHERE app_id = ? AND deleted_datetime IS NULL";

        $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
            echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
        }

        if (!$stmt->bind_param("i", $app_id)) {
            echo "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
        }

        if (!$stmt->execute()) {
            echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
        }

        $pageEntry = new be_page();

        $stmt->bind_result(
                $pageEntry->page_id, $pageEntry->app_id, $pageEntry->title, $pageEntry->description, $pageEntry->visibility_type_id, $pageEntry->created_datetime, $pageEntry->modified_datetime);

        $arrayResult = [];
        while ($stmt->fetch()) {
            $arrayResult[] = json_decode(json_encode($pageEntry));
        }

        $stmt->close();

        return $arrayResult;
    }

    /**
     * Returns a app found by its ID
     * @param int $page_id
     * @return be_page
     */
    public static function GetPage($page_id) {
        $sqlCommand = ""
                . "SELECT page_id, app_id, title, description, visibility_type_id, created_datetime, modified_datetime, deleted_datetime "
                . " FROM pages WHERE page_id=? ";

        $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
            $msg = "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
            throw new Exception($msg, $mysqli->connect_errno);
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            $msg = "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->bind_param("i", $page_id)) {
            $msg = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->execute()) {
            $msg = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        $result = new be_page();
        $stmt->bind_result(
                $result->page_id, $result->app_id, $result->title, $result->description, $result->visibility_type_id, $result->created_datetime, $result->modified_datetime, $result->deleted_datetime
        );

        if (!$stmt->fetch()) {
            $result = NULL;
        }

        $stmt->close();

        return $result;
    }
    
    /**
     * Updates a app with the provided information and returns the resulting record as saved.
     * @param be_app $page
     * @return be_app
     */
    public static function UpdatePage($page) {
        $sqlCommand = "UPDATE pages "
                . " SET  title = ?, "
                . "     description = ?, "
                . "     visibility_type_id = ? "
                . " WHERE page_id = ? ";

        $paramTypeSpec = "ssii";

        $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
            $msg = "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
            throw new Exception($msg, $mysqli->connect_errno);
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            $msg = "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->bind_param($paramTypeSpec, $page->title, $page->description, $page->visibility_type_id, $page->page_id)) {
            $msg = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->execute()) {
            $msg = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        $stmt->close();

        $retrievedPage = da_apps_registry::GetPage($page->page_id);
        return $retrievedPage;
    } 
    
    /**
     * Updates a app with the provided information and returns the resulting record as saved.
     * @param be_app $page
     * @return be_app
     */
    public static function DeletePage($page_id) {
        $sqlCommand = "UPDATE pages "
                . " SET  deleted_datetime = NOW() "
                . " WHERE page_id = ? ";

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

        if (!$stmt->bind_param($paramTypeSpec, $page_id)) {
            $msg = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->execute()) {
            $msg = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        $stmt->close();

        $retrievedPage = da_apps_registry::GetPage($page_id);
        
        return $retrievedPage;
    }     
    
    /**
     * Registers a app and returns the resultant record as be_app
     * @param be_app $page
     * @return type
     */
    public static function RegisterNewPage($page) {
        $sqlCommand = "INSERT INTO pages (app_id, title, description, visibility_type_id, created_datetime)"
                . "VALUES (?,?,?,?, NOW())";

        $paramTypeSpec = "issi";

        $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
            $msg = "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
            throw new Exception($msg, $mysqli->connect_errno);
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            $msg = "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->bind_param($paramTypeSpec,$page->app_id, $page->title, $page->description, $page->visibility_type_id)) {
            $msg = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->execute()) {
            $msg = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        $stmt->close();

        $insertedPageID = $mysqli->insert_id;

        $retrievedPage = da_apps_registry::GetPage($insertedPageID);
        return $retrievedPage;
    }

    /**
     * Updates a app with the provided information and returns the resulting record as saved.
     * @param be_app $app
     * @return be_app
     */
    public static function UpdateApp($app) {
        $sqlCommand = "UPDATE app_registry "
                . " SET  account_id = ?, "
                . "     app_nickname = ?, "
                . "     app_description = ?, "
                . "     visibility_type_id = ? "
                . " WHERE app_id = ? ";

        $paramTypeSpec = "issii";

        $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
            $msg = "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
            throw new Exception($msg, $mysqli->connect_errno);
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            $msg = "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->bind_param($paramTypeSpec, $app->account_id, $app->app_nickname, $app->app_description, $app->visibility_type_id, $app->app_id)) {
            $msg = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->execute()) {
            $msg = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        $stmt->close();

        $retrievedApp = da_apps_registry::GetApp($app->app_id);
        return $retrievedApp;
    }

    /**
     * Regenerates the API KEY of an app
     * @param int $app_id
     * @return be_app
     * @throws Exception
     */
    public static function RegenerateApiKey($app_id) {
        $sqlCommand = "UPDATE app_registry "
                . " SET  api_key = SHA1(UUID()) "
                . " WHERE app_id = ? ";

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

        if (!$stmt->bind_param($paramTypeSpec, $app_id)) {
            $msg = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->execute()) {
            $msg = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        $stmt->close();

        $retrievedApp = da_apps_registry::GetApp($app_id);
        return $retrievedApp;
    }

    /**
     * Deletes a app by updating its deleted_datetime
     * @param int $app_id
     * @return be_app
     */
    public static function DeleteApp($app_id) {
        $sqlCommand = "UPDATE app_registry "
                . " SET  deleted_datetime = NOW() "
                . " WHERE app_id = ? ";

        $paramTypeSpec = "i";

        $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
            $msg = "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
            throw new Exception($msg, $mysqli->errno);
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            $msg = "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->bind_param($paramTypeSpec, $app_id)) {
            $msg = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->execute()) {
            $msg = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        $stmt->close();

        $retrievedApp = da_apps_registry::GetApp($app_id);
        return $retrievedApp;
    }

}

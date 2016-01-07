<?php


/**
 * Description of be_account
 *
 * @author rviquez
 */
class be_invitation{
    
    public $account_id = 0;
    public $invitation_id = 0;
    public $host_email = "";
    public $guest_email = "";
    public $token = "";
    public $created_datetime = NULL;
    public $expired_datetime = NULL;
    
}

class da_invitation {


    public static function AddNewInvitation($account_id,$host_email, $guest_email){
        
        $token = sha1(uniqid() . $guest_email);
        
         $sqlCommand = "INSERT INTO invitations (account_id,host_email,guest_email,token,created_datetime, expired_datetime)"
                . "VALUES (?,?,?,?,NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY))";
         
         $paramTypeSpec = "isss";
         
         $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
            $msg = "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            $msg = "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->bind_param($paramTypeSpec, $account_id, $host_email, $guest_email, $token)) {
            $msg = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->execute()) {
            $msg = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        $stmt->close();
        
        $insertedID = $mysqli->insert_id;
        
        $retrievedInvitation = da_invitation::GetInvitationByID($insertedID);
            return $retrievedInvitation;
    }
    
    public static function GetInvitation($guest_email, $token) {
         
        $sqlCommand = "SELECT invitation_id,account_id,host_email,guest_email,token, created_datetime, expired_datetime"
                . " FROM invitations "
                . " WHERE guest_email = ? AND token =?";
        
        $paramTypeSpec = "ss";

        $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
            $msg = "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            $msg = "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->bind_param($paramTypeSpec, $guest_email, $token)) {
            $msg = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->execute()) {
            $msg = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        $result = new be_invitation();
        $stmt->bind_result($result->invitation_id,$result->account_id, $result->host_email, $result->guest_email, $result->token, $result->created_datetime, $result->expired_datetime);

        if (!$stmt->fetch()) {
            $result = NULL;
        }

        $stmt->close();

        return $result;
    }
    
    public static function GetInvitationByID($invitation_id) {
         
        $sqlCommand = "SELECT invitation_id,account_id,host_email,guest_email,token, created_datetime, expired_datetime"
                . " FROM invitations "
                . " WHERE invitation_id=?";
        
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

        if (!$stmt->bind_param($paramTypeSpec, $invitation_id)) {
            $msg = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->execute()) {
            $msg = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        $result = new be_invitation();
        $stmt->bind_result($result->invitation_id, $result->account_id, $result->host_email, $result->guest_email, $result->token, $result->created_datetime, $result->expired_datetime);

        if (!$stmt->fetch()) {
            $result = NULL;
        }

        $stmt->close();

        return $result;
    }
    
    public static function GetInvitationAvailability($account_id){
        $sqlCommand = "SELECT COUNT(DISTINCT app_registry.app_id) AS app_number" 
                . "FROM app_registry"
                . "INNER JOIN vse_data ON vse_data.app_id = app_registry.app_id" 
                . "WHERE account_id=?";        
        
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

        if (!$stmt->bind_param($paramTypeSpec, $invitation_id)) {
            $msg = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->execute()) {
            $msg = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }
        $app_count = 0;
        $result = false;
        $stmt->bind_result($app_count);

        if (!$stmt->fetch()) {
            $result = false;
        }
        else{
            if ($app_count > 0) {
                $result = true;
            }
        }

        $stmt->close();

        return $result;
    }

}


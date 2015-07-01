<?php

/**
 * Description of da_account
 *
 * @author janunezc
 */
class be_account {

    public $account_id = 0;
    public $email = "";
    public $nickname = "";
    public $pwd_hash = "";
    public $confirmed = 0;
    public $confirmation_guid = "";
    public $created_datetime = NULL;
    public $modified_datetime = NULL;
    public $deleted_datetime = NULL;

}

class da_account {

    public static function ActivateAccount($email, $guid) {
        $sqlCommand = "UPDATE accounts "
                . " SET confirmed = 1 "
                . " WHERE email = ? AND confirmation_guid = ? ";

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

        if (!$stmt->bind_param($paramTypeSpec, $email, $guid)) {
            $msg = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->execute()) {
            $msg = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        $stmt->close();

        $retreivedAccount = da_account::GetAccount($email);
        return $retreivedAccount;
    }

    /**
     * Adds a new account
     * @param string $email
     * @param string $nickname
     * @param string $passwordHash
     * @return be_account account object
     */
    public static function AddNewAccount($email, $nickname, $passwordHash) {

        $confirmationGUID = uniqid();

        $sqlCommand = "INSERT INTO accounts (email,nickname,pwd_hash, confirmation_guid, created_datetime)"
                . "VALUES (?,?,?,?, NOW())";

        $paramTypeSpec = "ssss";

        $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
            $msg = "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            $msg = "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->bind_param($paramTypeSpec, $email, $nickname, $passwordHash, $confirmationGUID)) {
            $msg = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->execute()) {
            $msg = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        $stmt->close();

        $retreivedAccount = da_account::GetAccount($email);
        return $retreivedAccount;
    }

    /**
     * 
     * @param string $email
     * @return be_account
     * @throws Exception
     */
    public static function GetAccount($email) {
        $sqlCommand = "SELECT account_id,email,nickname,pwd_hash, confirmed, confirmation_guid, created_datetime, modified_datetime, deleted_datetime"
                . " FROM accounts "
                . " WHERE email=? ";

        $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
            $msg = "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            $msg = "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->bind_param("s", $email)) {
            $msg = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->execute()) {
            $msg = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        $result = new be_account();
        $stmt->bind_result($result->account_id, $result->email, $result->nickname, $result->pwd_hash, $result->confirmed, $result->confirmation_guid, $result->created_datetime, $result->modified_datetime, $result->deleted_datetime);

        if (!$stmt->fetch()) {
            $result = NULL;
        }

        $stmt->close();

        return $result;
    }
    
    /**
     * 
     * @param int $account_id
     * @return be_account
     * @throws Exception
     */
    public static function GetAccountByID($account_id) {
        $sqlCommand = "SELECT account_id,email,nickname,pwd_hash, confirmed, confirmation_guid, created_datetime, modified_datetime, deleted_datetime"
                . " FROM accounts "
                . " WHERE account_id = ? ";

        $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
            $msg = "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            $msg = "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->bind_param("i", $account_id)) {
            $msg = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->execute()) {
            $msg = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        $result = new be_account();
        $stmt->bind_result($result->account_id, $result->email, $result->nickname, $result->pwd_hash, $result->confirmed, $result->confirmation_guid, $result->created_datetime, $result->modified_datetime, $result->deleted_datetime);

        if (!$stmt->fetch()) {
            $result = NULL;
        }

        $stmt->close();

        return $result;
    }
    
    /**
     * Updates the data of an account
     * @param be_account $account
     * @return be_account
     */
    public static function UpdateAccount($account) {
        $sqlCommand = "UPDATE accounts "
                . " SET confirmation_guid = ?,"
                . " confirmed = ?,"
                . " deleted_datetime = ?,"
                . " email = ?,"
                . " nickname = ?,"
                . " pwd_hash = ?"
                . " WHERE account_id = ? ";

        $paramTypeSpec = "sissssi";

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
                $account->confirmation_guid,
                $account->confirmed,
                $account->deleted_datetime, 
                $account->email,
                $account->nickname,
                $account->pwd_hash,
                $account->account_id)) {
            $msg = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        if (!$stmt->execute()) {
            $msg = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
            throw new Exception($msg, $stmt->errno);
        }

        $stmt->close();

        $savedAccount = da_account::GetAccount($account->email);
        return $savedAccount;
    }    

}

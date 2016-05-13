<?php
require_once 'BL/BL_Authentication.php';
require_once './DA/da_conf.php';
require_once './DA/da_helper.php';

require_once './DA/da_account.php';

$accounts = da_account::GetAccounts();

//@var $account be_account
foreach ($accounts as $key => $account) {
    if(strlen($account->pwd_hash)==40) {
        $saltedStrongHash = BL_Authentication::GenerateSaltedStrongHash($account->pwd_hash);
        $account->pwd_hash = $saltedStrongHash;
        $savedAccount =  da_account::UpdateAccount($account);
        
        print_r($savedAccount);
        echo "<hr>";
    }
}



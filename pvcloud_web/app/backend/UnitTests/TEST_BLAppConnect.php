<!DOCTYPE html>
<?php
require_once '../DA/da_conf.php';
require_once '../DA/da_helper.php';
require_once '../DA/da_account.php';
require_once '../BL/BL_AppConnect.php';
require_once '../BL/BL_ConstantsAndUtils.php';
require_once '../BL/SimpleResponse.php';
?>

<html>
    <head>
        <meta charset="UTF-8">
        <title>TEST PAGE - BLAppConnect</title>
    </head>
    <body>
        <h1>TEST EXECUTION 1123:</h1>
        <?php
        TEST_AppConnectProcedure();
        ?>
    </body>
</html>

<?php

function TEST_AppConnectProcedure() {
    //Utils::test_report("", TEST_REPORT_TYPE_);
    Utils::test_report("TEST: App Connect Procedure", TEST_REPORT_TYPE_INFO);

    $account_id = 1;
    $secret = "1234";
    $app_id = 1;

    $result = BL_AppConnect_Simple::ConnectToApp();
    if ($result->status == STATUS_ERROR_AUTHENTICATION) {
        Utils::test_report("SUCCESSFULLY EXECUTED", TEST_REPORT_TYPE_SUCCESS);
        print_r($result);
    }
}

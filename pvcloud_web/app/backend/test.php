<!-- usage: http://localhost:8080/pvcloud/backend/test.php -->
<?php
require_once './DA/da_conf.php';
require_once './DA/da_helper.php';
require_once './DA/da_account.php';
require_once './DA/da_session.php';
require_once './DA/da_apps_registry.php';
require_once './DA/da_vse_data.php';
require_once './DA/da_invitation.php';
require_once './DA/da_widget_config.php';
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>AUTOMATED TEST FILE</title>
    </head>
    <body style="font-family:courier">
        <?php
        ReportInfo("Initiating Tests!");

        //TEST_DASession::test_da_session();
        
        //TEST_DAApp::test_da_app();

        //TEST_DAVSEValue::Test();
        //TEST_DAInvitation::test_da_invitation();

        TEST_DAWidgetConfig::test();
        
        //TEST_WidgetData::Test();
        //ReportInfo("Tests Finished!");
        ?> 
    </body>
</html>

<?php

class TEST_DAApp {

    public static function test_da_app() {
        $testName = "DA DEVICE TEST";
        ReportInfo("Initiating $testName");

        $createdApp = TEST_DAApp::testAppCreation();

        TEST_DAApp::testAppListRetrieval();

        $modifiedApp = TEST_DAApp::testAppModification($createdApp);

        $apiGenerationApp = TEST_DAApp::testAPIKeyRegeneration($modifiedApp);

        $deletedApp = TEST_DAApp::testAppDeletion($apiGenerationApp);

        TEST_DAApp::testAppListRetrieval();

        ReportInfo("Complete: $testName");
    }

    private static function testAppCreation() {
        $newApp = new be_app();
        $newApp->account_id = 1;
        $newApp->app_nickname = "JN GALILEO1";
        $newApp->app_description = "";

        ReportInfo("App to Create:");
        print_r($newApp);

        $registeredApp = da_apps_registry::RegisterNewApp($newApp);
        ReportInfo("App Created:");
        print_r($registeredApp);

        if ($registeredApp->app_id > 0) {
            ReportSuccess("Created App seems to be OK!");
        } else {
            ReportError("Created app seems to be WRONG! :(");
        }

        return $registeredApp;
    }

    private static function testAppListRetrieval() {
        ReportInfo("Testing retrieval of a list of apps for an account...");
        $account_id = 1;
        $apps = da_apps_registry::GetListOfApps($account_id);
        print_r($apps);
        if (count($apps) > 0) {
            ReportSuccess("Result seems to be fine.");
        } else {
            ReportSuccess("Result seems to be WRONG");
        }
    }

    /**
     * 
     * @param be_app $appToModify
     * @return be_app
     */
    private static function testAppModification($appToModify) {

        ReportInfo("App to Modify:");
        print_r($appToModify);

        $appToModify->app_nickname = "JN_GALILEO_MODIFIED";
        $appToModify->app_description = "Modified Galielo Entry";

        $modifiedApp = da_apps_registry::UpdateApp($appToModify);

        if ($modifiedApp->app_nickname == $appToModify->app_nickname && $modifiedApp->app_description == $appToModify->app_description) {
            ReportSuccess("App Seems to be properly modified");
        } else {
            ReportError("App Modification seemed to fail!");
        }

        $appToModify->app_nickname = "JN GALILEO MODIFIED 2";
        ReportInfo("Second Modification:");
        print_r($appToModify);

        $modifiedApp = da_apps_registry::UpdateApp($appToModify);

        if ($modifiedApp->app_nickname == $appToModify->app_nickname && $modifiedApp->app_description == $appToModify->app_description) {
            ReportSuccess("App Seems to be properly modified");
        } else {
            ReportError("App Modification seemed to fail!");
        }

        return $modifiedApp;
    }

    /**
     * 
     * @param be_app $appToModify
     * @return be_app
     */
    private static function testAPIKeyRegeneration($appToModify) {
        ReportInfo("App to Generate API KEY for:");
        print_r($appToModify);

        $modifiedApp = da_apps_registry::RegenerateApiKey($appToModify->app_id);

        ReportInfo("App with new API KEY:");
        print_r($modifiedApp);

        if ($modifiedApp->api_key != "" && $modifiedApp->api_key != $appToModify->api_key) {
            ReportSuccess("API KEY properly modified");
        } else {
            ReportError("API KEY GENERQATION seemed to fail!");
        }

        return $modifiedApp;
    }

    /**
     * 
     * @param be_app $appToDelete
     * @return be_app
     */
    private static function testAppDeletion($appToDelete) {
        ReportInfo("App to DELETE:");
        print_r($appToDelete);

        $deletedApp = da_apps_registry::DeleteApp($appToDelete->app_id);

        ReportInfo("RESULT:");
        print_r($deletedApp);

        if ($deletedApp->deleted_datetime != NULL) {
            ReportSuccess("API KEY properly modified");
        } else {
            ReportError("API KEY GENERQATION seemed to fail!");
        }

        return $deletedApp;
    }

}

class TEST_DASession {

    public static function test_da_session() {
        ReportInfo("Initiating Session Test");
        ReportInfo("creating session on jose.a.nunez@gmail.com");
        $session = da_session::CreateSession(1);
        print_r($session);
        if ($session->token != '') {
            ReportSuccess("Session seems to be Correct!");
        } else {
            ReportError("Session seems to be BAD");
        }
        
        ReportInfo("Loging out...");
        $loggedOffSession = da_session::Logout($session->account_id, $session->token);
        ReportInfo("Session after Logout begins here..-------------------");
        print_r($loggedOffSession);
        ReportInfo("Session after Logout ends here..-------------------");
        if($loggedOffSession->account_id == $session->account_id && $loggedOffSession->token ==$session->token && $loggedOffSession->expiration_datetime!=$session->expiration_datetime ){
            ReportSuccess("Seems to be OK after logoff.");
        } else{
            ReportError("IT seems result is NOT OK. Is that a good session value for Logout?");
        }
        
        ReportInfo("Session Tests Complete!");
    }

}

class TEST_DAVSEValue {

    public static function Test() {
        $uuid = uniqid();
        TEST_DAVSEValue::testAddEntries($uuid);

        //TEST_DAVSEValue::testGetEntries($uuid);

        TEST_DAVSEValue::testGetLastEntry();

        TEST_DAVSEValue::testClearEntries($uuid);        
        
    }

    private static function testAddEntries($uuid) {
        ReportInfo("Testing Entries Addition");

        ReportInfo("Adding 100 entries: ");

        $successfulHits = 0;
        for ($i = 0; $i < 100; $i++) {
            $entryToAdd = new be_vse_data();
            $entryToAdd->app_id = 1;
            $entryToAdd->vse_label = "TEST_DATA_$uuid";
            $entryToAdd->vse_value = $i;
            $entryToAdd->vse_type = "NUMBER";
            $entryToAdd->vse_annotations = "This is testing data on value $i";
            $entryToAdd->captured_datetime = date("Y-m-d H:i:s");
            $addedEntry = da_vse_data::AddEntry($entryToAdd);

            if ($addedEntry->entry_id > 0 && $addedEntry->app_id == $entryToAdd->app_id && $addedEntry->vse_annotations == $entryToAdd->vse_annotations) {
                $successfulHits++;
            } else {
                ReportError("Oops! Entry addition seems failed!");
                ReportError("Requested Addition:");
                print_r($entryToAdd);

                ReportError("Result:");
                print_r($addedEntry);
            }
        } //END FOR

        ReportInfo("$successfulHits were added properly!");
    }

    private static function testGetEntries($uuid) {
        ReportInfo("Testing GET All Entries - Phase 1: Just app limit");
        $entries_test_01 = da_vse_data::GetEntries(1, '', 0);

        if (count($entries_test_01) >= 100) {
            ReportSuccess("Just retrieved " . count($entries_test_01) . " entries for app 1. no additional filters");
        } else {
            ReportError("Just retrieved " . count($entries_test_01) . " entries for app 1. no additional filters");
        }
        print_r($entries_test_01);

        ReportInfo("Testing GET All Entries - Phase 2: App and Label limits");
        $targetLabel = "TEST_DATA_$uuid";
        $entries_test_02 = da_vse_data::GetEntries(1, $targetLabel, 0);
        if (count($entries_test_02) == 100) {
            ReportSuccess("Just retrieved " . count($entries_test_02) . " entries for app 1. Label Filter");
        } else {
            ReportError("Just retrieved " . count($entries_test_02) . " entries for app 1. Label Filter");
        }
        print_r($entries_test_02);


        ReportInfo("Testing GET All Entries - Phase 3:  App, Label and Count Limits");
        $entries_test_03 = da_vse_data::GetEntries(1, $targetLabel, 50);

        if (count($entries_test_03) == 50) {
            ReportSuccess("Just retrieved " . count($entries_test_03) . " entries for app 1. Label Filter + last 50 filter");
        } else {
            ReportError("Just retrieved " . count($entries_test_03) . " entries for app 1. Label Filter + last 50 filter");
        }


        print_r($entries_test_03);
    }

    private static function testGetLastEntry() {
        ReportInfo("Testing to get the last entry of a app without Label Filter");
        $lastEntry01 = da_vse_data::GetLastEntry(1, '');
        print_r($lastEntry01);
        ReportInfo("Testing to get last entry with Label Filter");
        $lastEntry02 = da_vse_data::GetLastEntry(1, "TEST_DATA");
        print_r($lastEntry02);
        ReportInfo("COMPLETE! Testing to get the last entry");
    }

    private static function testClearEntries($uuid) {
        ReportInfo("Testing Clearing Entries");
        ReportInfo("Clearing All");
        $result = da_vse_data::ClearEntries(1, "");
        ReportInfo("Result:");
        print_r($result);

        for ($i = 1; $i <= 10; $i++) {
            $entry = new be_vse_data();
            $entry->app_id = 1;
            $entry->vse_label = "TEST FOR CLEARING_01";
            $entry->vse_value = $i . "OK";
            $entry->vse_type = "ANY";
            $entry->vse_annotations = "Testing for clearing methods";
            $entry->captured_datetime = date("Y-m-d H:i:s");
            da_vse_data::AddEntry($entry);
        }

        for ($i = 1; $i <= 10; $i++) {
            $entry = new be_vse_data();
            $entry->app_id = 1;
            $entry->vse_label = "TEST FOR CLEARING_02";
            $entry->vse_value = $i . "OK";
            $entry->vse_type = "ANY";
            $entry->vse_annotations = "Testing for clearing methods";
            $entry->captured_datetime = date("Y-m-d H:i:s");
            da_vse_data::AddEntry($entry);
        }
        
        ReportInfo("Getting all entries...");
        $allrecords = da_vse_data::GetEntries(1, '', 0);
        print_r($allrecords);
        
        ReportInfo("Clearing TEST_FOR_CLEARING_02");
        $check01 = da_vse_data::ClearEntries(1, 'TEST FOR CLEARING_02');
        print_r($check01);
        
        ReportInfo("Getting all entries again...");
        $allrecords = da_vse_data::GetEntries(1, '', 0);
        print_r($allrecords);   
        
        ReportInfo("Clearing TEST_FOR_CLEARING_01");
        $check02 = da_vse_data::ClearEntries(1, 'TEST FOR CLEARING_01');
        print_r($check02);
        
        ReportInfo("At this point all should be clear for app 1");
        $allrecords = da_vse_data::GetEntries(1, '', 0);
        print_r($allrecords);           
        
    }

}

class TEST_WidgetData {
    public static function Test(){
        ReportInfo("TESTING GetEntriesDorWidget...");
        $result = da_vse_data::GetEntriesForWidget(1,0,0);
        
        print_r($result);
        
        ReportInfo("FINISHED TEST");
    }
}

class TEST_DAInvitation {

    public static function test_da_invitation() {
        ReportInfo("Initiating Invitation Test");
        ReportInfo("creating invitation for robertoviquez@gmail.com");
        $invitation = da_invitation::AddNewInvitation("roberto.viquez@intel.com", "robertoviquez@gmail.com");
        ReportInfo("El resultado de la creacion de la invitacion: ".print_r($invitation, true));    
        
        ReportInfo("Invitation Tests Complete!");
    }

}

class TEST_DAWidgetConfig{
    public static function test(){
        ReportInfo("Testing DAWidgetConfig");
        ReportInfo("Creating a new widget config");
        $newWidgetConfig = new be_widget_config();
        $newWidgetConfig->widget_id = 1;
        $newWidgetConfig->vse_label = "TEST";
        $newWidgetConfig->simple_object_property = "";
        $newWidgetConfig->friendly_label = "PRUEBA";
        $newWidgetConfig->options_json = "";
        ReportInfo("Widget to create:");
        print_r($newWidgetConfig);
        $savedWidgetConfig = da_widget_config::InsertWidgetConfig($newWidgetConfig);
        
        if ( is_numeric($savedWidgetConfig->widget_config_id) && $savedWidgetConfig->widget_config_id != $newWidgetConfig->widget_config_id && $savedWidgetConfig->widget_config_id > 0){
            ReportSuccess("Widget Config Created Successfully");
            print_r($savedWidgetConfig);
            
            $savedWidgetConfig->vse_label = "MODIFIED";
            $savedWidgetConfig->options_json = "{'color':'red'}";
            //sleep(2);
            ReportInfo("Widget Config Modification:");
            print_r($savedWidgetConfig);
            $modifiedWidgetConfig = da_widget_config::UpdateWidgetConfig($savedWidgetConfig);
            
            if($modifiedWidgetConfig->vse_label == "MODIFIED"
               && $modifiedWidgetConfig->options_json == "{'color':'red'}")
            {
                
                 ReportSuccess("Widget Modified Sucessfully");
                 $deletedResult = da_widget_config::DeleteWidgetConfig($modifiedWidgetConfig->widget_config_id);
                 print_r($deletedResult);
            }
            else
            {
                  ReportError("Modification failed :(");
            }
            
            
            ReportInfo("Modification Result:");
            print_r($modifiedWidgetConfig);
        }
        else
        {
            ReportError("Insertion failed :(");
        }
    }   
}

function test_da_account() {
    $createdAccount = da_account::AddNewAccount("roberto.viquez@intel.com", "neo", sha1("sion"));
    if ($createdAccount == NULL) {
        echo ("ERROR");
    } else {
        echo ("OK<br>");
        print_r($createdAccount);
    }
}

function ReportInfo($message) {
    $moment = Date("Y-m-d H:i:s");
    echo("<hr><div style=\"color:darkblue;\">$moment - $message</div>");
}

function ReportSuccess($message) {
    $moment = Date("Y-m-d H:i:s");
    echo("<hr><div style=\"color:green; background-color:#ccffcc\">$moment - $message</div>");
}

function ReportError($message) {
    $moment = Date("Y-m-d H:i:s");
    echo("<hr><div style=\"color:maroon;font-weight:bold;background-color:EBABAB\">[!!!]$moment - $message</div>");
}

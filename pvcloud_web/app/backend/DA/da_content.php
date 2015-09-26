<?php

/**
 * @author amenaari
 */
class be_content {

    public $content_id = 0;
    public $title = "";
    public $description = "";
    public $Content = "";    
}

class da_content {


    public static function SaveNewContent($content){
        $sqlCommand = "INSERT INTO docs_and_drivers (title,description,Content)"
                . "VALUES (?,'',?)";

        $paramTypeSpec = "ss";


        $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
           echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
        }

        //echo $content->content;
        if (!$stmt->bind_param($paramTypeSpec, $content->title, $content->content)) {
             echo "Binding parameters failed: (" . $mysqli->errno . ") " . $mysqli->error;

        }

        if (!$stmt->execute()) {
            echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
        }

        $stmt->close();

      //  $insertedContentId = $mysqli->document_id;
        //TODL retrieve content
        //$retrievedContent = da_apps_registry::GetApp($insertedAppID);
        return 'yeeeeeah';

    }


    /**
     * Returns the list of all content documents 
     * @param N/A
     * return Array
     */
    public static function GetListOfContents() {
        $sqlCommand = "SELECT document_id,title,description,Content FROM docs_and_drivers";

        $mysqli = DA_Helper::mysqli_connect();
        if ($mysqli->connect_errno) {
            echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
        }

        if (!($stmt = $mysqli->prepare($sqlCommand))) {
            echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
        }       

        if (!$stmt->execute()) {
            echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
        }

        $contentEntry = new be_content();

        $stmt->bind_result(
                $contentEntry->content_id, $contentEntry->title, $contentEntry->description, $contentEntry->Content);

        $arrayResult = [];
        while ($stmt->fetch()) {
            $arrayResult[] = json_decode(json_encode($contentEntry));
        }



        $stmt->close();

        return $arrayResult;
    }



}

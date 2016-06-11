<?php
/**
 * Standard response object for ws calls
 */
class SimpleResponse {
    /**
     * Use one of the constants beginning with STATUS_*** specified in BL/BL_ConstantsAndUtils.php
     * @var string
     */
    public $status = ""; 
    /**
     * Use to document huma-readable messages for technical people such as exception messages to be loggued.
     * @var string
     */
    public $message = "";
    
    /**
     * List here the validation codes that need to be fixed.
     * @var array_of_strings
     */
    public $validationCodes = [];
    
    /**
     * Business data to be returned in response.
     * @var Object
     */
    public $data = NULL;
}
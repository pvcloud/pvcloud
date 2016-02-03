<?php

/**
 * Description of DAConf
 *
 * @author janunezc
 */
class DAConf {
    public static $databaseURL = "localhost";
    public static $databaseUName = ""; ///i.e.: root .. WAIT! do not use root!
    public static $databasePWord = ""; //i.e.: 1234
    public static $databaseName = ""; //i.e.: pvcloud
    public static $key = "12345678901234567890123456789012"; //Only keys of sizes 16, 24 or 32 supported
}

//VVVVV   UNCOMMENT THESE LINES FOR Cloud9 ENVIRONMENT VVV
// DAConf::$databaseURL = getenv('IP');
// DAConf::$databaseUName = getenv('C9_USER');

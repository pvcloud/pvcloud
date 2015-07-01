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
}

//VVVVV   REMOVE THESE LINES IF YOU ARE NOT ON Cloud9 VVV
DAConf::$databaseURL = getenv('IP');
DAConf::$databaseUName = getenv('C9_USER');

//^^^^^^   REMOVE THESE LINES IF YOU ARE NOT ON Cloud9 ^^^
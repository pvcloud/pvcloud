<?php

function getBaseURL() {

    $server_https = filter_input(INPUT_SERVER, "HTTPS");

    $port = filter_input(INPUT_SERVER, "SERVER_PORT");

    $protocol = (!empty($server_https) && $server_https !== 'off' || $port == 443) ? "https://" : "http://";

    $host = filter_input(INPUT_SERVER, "HTTP_HOST") . ":$port";

    $uri = filter_input(INPUT_SERVER, "REQUEST_URI");

    $result = "$protocol$host$uri";

    $backendPartPos = strrpos($result, "/backend");

    if ($backendPartPos) {
        $result = substr($result, 0, $backendPartPos);
    }
    
    return $result;
}

function getClientBaseURL($resource) {

    $server_https = filter_input(INPUT_SERVER, "HTTPS");
    $protocol = (!empty($server_https) && $server_https !== 'off') ? "https://" : "http://";
    $domainName = filter_input(INPUT_SERVER, "HTTP_HOST") . "/";

    $referrer = filter_input(INPUT_SERVER, "HTTP_REFERER");

    $port9KDetection = strpos($referrer, ":9000");
    $server_port = filter_input(INPUT_SERVER, "SERVER_PORT");
    if ($port9KDetection > 0) { //OVERRIDE PORT WITH 9000 IF THAT's THE PORT OF REFERRAL
        $server_port = "9000";
        $protocol = "http://";
        $domainName = "localhost:9000";
        $resource = str_replace("pvcloud", "", $resource);
    }
    $url = $protocol . $domainName . "$resource/";
    return $url;
}

/**
 * Finds corsURL from DAConf and returns it.
 * @return type
 */
function GetCORSURL() {
    return DAConf::$corsURL;
}

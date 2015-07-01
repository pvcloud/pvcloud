<?php

function getBaseURL($resource) {
    $server_https = filter_input(INPUT_SERVER, "HTTPS");
    $server_port = filter_input(INPUT_SERVER, "SERVER_PORT");
    $protocol = (!empty($server_https) && $server_https !== 'off' || $server_port == 443) ? "https://" : "http://";
    $domainName = filter_input(INPUT_SERVER, "HTTP_HOST") . "/";
    return $protocol . $domainName . "$resource/";
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

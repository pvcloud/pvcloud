<?php

$files = scandir("../vse_files/");

$now = time();

foreach ($files as $file) {
    $targetFile = "../vse_files/$file";
    if (is_file($targetFile)) {
        $filetime = filemtime($targetFile);

        if ($now - $filetime >= 60 * 60 * 24 * 15 /* 15 days */) {
            print_r($filetime);
            echo("<hr>");

            unlink($targetFile);
        }
    }
}
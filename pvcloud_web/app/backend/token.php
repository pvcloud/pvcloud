<?php

require 'vendor/autoload.php';
require_once 'DA/da_conf.php';

$app = new \Slim\Slim();

$app->post('/', function () {
    $app = \Slim\Slim::getInstance();
    $credentials = new stdClass();
    $credentials->user = $app->request->headers->get("Php-Auth-User");
    $credentials->pass = $app->request->headers->get("Php-Auth-Pw");

    $credentialsJSON = json_encode($credentials);

    $cipherText = tokenHelper::encrypt($credentialsJSON);

    echo $cipherText;
});


$app->run();

class tokenHelper {

    public static function createKey() {
        $key = pack('H*', bin2hex(DAConf::$key));
        $key_size = strlen($key);
        echo ("Tamaño de la clave: " . $key_size . "\n");
    }

    public static function encrypt($plainContent) {
        
        $key = tokenHelper::createKey();
        
        # crear una aleatoria IV para utilizarla co condificación CBC
        $iv_size = mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC);
        $iv = mcrypt_create_iv($iv_size, MCRYPT_RAND);

        # crea un texto cifrado compatible con AES (tamaño de bloque Rijndael = 128)
        # para hacer el texto confidencial 
        # solamente disponible para entradas codificadas que nunca finalizan con el
        # el valor  00h (debido al relleno con ceros)
        $ciphertext = mcrypt_encrypt(MCRYPT_RIJNDAEL_128, $key, $plainContent, MCRYPT_MODE_CBC, $iv);

        # anteponer la IV para que esté disponible para el descifrado
        $ciphertext = $iv . $ciphertext;

        # codificar el texto cifrado resultante para que pueda ser representado por un string
        $ciphertext_base64 = base64_encode($ciphertext);

        echo ($ciphertext_base64 . "\n");

        $ciphertext_dec = base64_decode($ciphertext_base64);

        # recupera la IV, iv_size debería crearse usando mcrypt_get_iv_size()
        $iv_dec = substr($ciphertext_dec, 0, $iv_size);

        # recupera el texto cifrado (todo excepto el $iv_size en el frente)
        $ciphertext_dec = substr($ciphertext_dec, $iv_size);

        # podrían eliminarse los caracteres con valor 00h del final del texto puro
        $plaintext_dec = mcrypt_decrypt(MCRYPT_RIJNDAEL_128, $key, $ciphertext_dec, MCRYPT_MODE_CBC, $iv_dec);

        echo ($plaintext_dec . "\n");


        //Get the ExpiresUtc
        $minutes = 60;
        $seconds = $minutes * 60;
        echo( gmdate("Y-m-d\TH:i:s\Z", time() + $seconds));
        //include 'inc/incJSONHeaders.php';
        //echo(json_encode($credentials));

        return $ciphertext_base64;
    }

}

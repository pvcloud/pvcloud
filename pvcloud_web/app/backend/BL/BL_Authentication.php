<?php

class BL_Authentication {

    /**
     * Gets a salted strong hash and decomposes it into SALT and STRONG HASH separately
     * @param type $saltedStrongHash
     * @return DecomposedSaltedHash containing Salt and StrongHash
     */
    public static function DecomposeSaltedStrongHash($saltedStrongHash) {
        $result = new DecomposedSaltedHash();
        $result->Salt = substr($saltedStrongHash, 0, 6);
        $result->StrongHash = substr($saltedStrongHash, 6);

        return $result;
    }

    /**
     * Receives a Simple Hash, creates and adds SALT and hashes it again to create an STRONG HASH
     * @param type $simpleHash
     * @return string Strong Hash
     */
    public static function GenerateSaltedStrongHash($simpleHash) {
        $newSalt = random_int(100000, 999999);
        $newSaltedHash = $newSalt . $simpleHash;
        $newStrongHash = sha1($newSaltedHash);
        $newSaltedStrongHash = $newSalt . $newStrongHash;

        return $newSaltedStrongHash;
    }

}

/**
 * Datagram containing SALT and StrongHash separately
 */
class DecomposedSaltedHash {

    public $Salt = "";
    public $StrongHash = "";

}

package com.securevault.util;

public class EncryptionTest {

    public static void main(String[] args) {

        String originalPassword =
                "GmailPass123!";

        String encrypted =
                EncryptionUtil.encrypt(originalPassword);

        String decrypted =
                EncryptionUtil.decrypt(encrypted);

        System.out.println(
                "Original: " + originalPassword
        );

        System.out.println(
                "Encrypted: " + encrypted
        );

        System.out.println(
                "Decrypted: " + decrypted
        );
    }
}
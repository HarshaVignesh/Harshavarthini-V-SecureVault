package com.securevault.util;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

public class EncryptionUtil {

    private static final String ALGORITHM = "AES/GCM/NoPadding";

    // Temporary development key.
    // We will move this to environment variables later.
    private static final String SECRET_KEY =
            "01234567890123456789012345678901";

    private static final int IV_LENGTH = 12;
    private static final int TAG_LENGTH = 128;

    private static SecretKeySpec getSecretKey() {

        return new SecretKeySpec(
                SECRET_KEY.getBytes(StandardCharsets.UTF_8),
                "AES"
        );
    }

    public static String encrypt(String plainText) {

        try {

            byte[] iv = new byte[IV_LENGTH];

            SecureRandom secureRandom = new SecureRandom();
            secureRandom.nextBytes(iv);

            Cipher cipher = Cipher.getInstance(ALGORITHM);

            GCMParameterSpec gcmParameterSpec =
                    new GCMParameterSpec(TAG_LENGTH, iv);

            cipher.init(
                    Cipher.ENCRYPT_MODE,
                    getSecretKey(),
                    gcmParameterSpec
            );

            byte[] encrypted =
                    cipher.doFinal(
                            plainText.getBytes(StandardCharsets.UTF_8)
                    );

            byte[] combined =
                    new byte[iv.length + encrypted.length];

            System.arraycopy(
                    iv,
                    0,
                    combined,
                    0,
                    iv.length
            );

            System.arraycopy(
                    encrypted,
                    0,
                    combined,
                    iv.length,
                    encrypted.length
            );

            return Base64.getEncoder()
                    .encodeToString(combined);

        } catch (Exception e) {

            throw new RuntimeException(
                    "Encryption failed",
                    e
            );
        }
    }

    public static String decrypt(String encryptedText) {

        try {

            byte[] combined =
                    Base64.getDecoder()
                            .decode(encryptedText);

            byte[] iv =
                    new byte[IV_LENGTH];

            byte[] encrypted =
                    new byte[
                            combined.length - IV_LENGTH
                            ];

            System.arraycopy(
                    combined,
                    0,
                    iv,
                    0,
                    IV_LENGTH
            );

            System.arraycopy(
                    combined,
                    IV_LENGTH,
                    encrypted,
                    0,
                    encrypted.length
            );

            Cipher cipher =
                    Cipher.getInstance(ALGORITHM);

            GCMParameterSpec gcmParameterSpec =
                    new GCMParameterSpec(
                            TAG_LENGTH,
                            iv
                    );

            cipher.init(
                    Cipher.DECRYPT_MODE,
                    getSecretKey(),
                    gcmParameterSpec
            );

            byte[] decrypted =
                    cipher.doFinal(encrypted);

            return new String(
                    decrypted,
                    StandardCharsets.UTF_8
            );

        } catch (Exception e) {

            throw new RuntimeException(
                    "Decryption failed",
                    e
            );
        }
    }
}
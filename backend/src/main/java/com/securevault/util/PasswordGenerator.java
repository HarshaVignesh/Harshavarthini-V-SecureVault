package com.securevault.util;

import java.security.SecureRandom;

public class PasswordGenerator {

    private static final String UPPERCASE =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    private static final String LOWERCASE =
            "abcdefghijklmnopqrstuvwxyz";

    private static final String NUMBERS =
            "0123456789";

    private static final String SPECIAL =
            "!@#$%^&*()-_=+";

    private static final SecureRandom random =
            new SecureRandom();

    public static String generatePassword(
            int length,
            boolean useUppercase,
            boolean useLowercase,
            boolean useNumbers,
            boolean useSpecial) {

        if (length < 8) {
            throw new IllegalArgumentException(
                    "Password length must be at least 8"
            );
        }

        StringBuilder characterPool =
                new StringBuilder();

        StringBuilder password =
                new StringBuilder();

        // Add selected character groups to the pool
        if (useUppercase) {
            characterPool.append(UPPERCASE);
        }

        if (useLowercase) {
            characterPool.append(LOWERCASE);
        }

        if (useNumbers) {
            characterPool.append(NUMBERS);
        }

        if (useSpecial) {
            characterPool.append(SPECIAL);
        }

        // At least one character type must be selected
        if (characterPool.isEmpty()) {
            throw new IllegalArgumentException(
                    "Select at least one character type"
            );
        }

        // Count selected character groups
        int selectedTypes = 0;

        if (useUppercase) selectedTypes++;
        if (useLowercase) selectedTypes++;
        if (useNumbers) selectedTypes++;
        if (useSpecial) selectedTypes++;

        // Password must be long enough to satisfy
        // the selected character rules
        if (length < selectedTypes) {
            throw new IllegalArgumentException(
                    "Password length is too short for the selected character types"
            );
        }

        // Guarantee at least one character from
        // every selected category
        if (useUppercase) {
            password.append(
                    randomCharacter(UPPERCASE)
            );
        }

        if (useLowercase) {
            password.append(
                    randomCharacter(LOWERCASE)
            );
        }

        if (useNumbers) {
            password.append(
                    randomCharacter(NUMBERS)
            );
        }

        if (useSpecial) {
            password.append(
                    randomCharacter(SPECIAL)
            );
        }

        // Fill remaining characters from selected pool
        while (password.length() < length) {

            password.append(
                    randomCharacter(
                            characterPool.toString()
                    )
            );
        }

        // Shuffle the password
        char[] characters =
                password.toString().toCharArray();

        for (int i = characters.length - 1;
             i > 0;
             i--) {

            int j = random.nextInt(i + 1);

            char temp = characters[i];

            characters[i] = characters[j];
            characters[j] = temp;
        }

        return new String(characters);
    }

    private static char randomCharacter(
            String characters) {

        return characters.charAt(
                random.nextInt(
                        characters.length()
                )
        );
    }
}
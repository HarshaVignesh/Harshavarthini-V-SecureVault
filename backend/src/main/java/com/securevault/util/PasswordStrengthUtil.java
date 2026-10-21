package com.securevault.util;

import java.util.ArrayList;
import java.util.List;

public class PasswordStrengthUtil {

    public static StrengthResult checkStrength(
            String password) {

        if (password == null ||
                password.isEmpty()) {

            return new StrengthResult(
                    "VERY WEAK",
                    List.of(
                            "Password is required",
                            "Use at least 8 characters",
                            "Add uppercase and lowercase letters",
                            "Add numbers and special characters"
                    )
            );
        }

        int score = 0;

        List<String> suggestions =
                new ArrayList<>();

        // Length
        if (password.length() >= 8) {
            score++;
        } else {
            suggestions.add(
                    "Use at least 8 characters"
            );
        }

        if (password.length() >= 12) {
            score++;
        } else if (password.length() >= 8) {
            suggestions.add(
                    "Consider using at least 12 characters"
            );
        }

        // Uppercase
        if (password.matches(".*[A-Z].*")) {
            score++;
        } else {
            suggestions.add(
                    "Add at least one uppercase letter"
            );
        }

        // Lowercase
        if (password.matches(".*[a-z].*")) {
            score++;
        } else {
            suggestions.add(
                    "Add at least one lowercase letter"
            );
        }

        // Number
        if (password.matches(".*[0-9].*")) {
            score++;
        } else {
            suggestions.add(
                    "Add at least one number"
            );
        }

        // Special character
        if (password.matches(".*[^a-zA-Z0-9].*")) {
            score++;
        } else {
            suggestions.add(
                    "Add at least one special character"
            );
        }

        String strength;

        if (score <= 2) {
            strength = "WEAK";
        } else if (score <= 4) {
            strength = "MEDIUM";
        } else {
            strength = "STRONG";
        }

        // Strong password does not need suggestions
        if (strength.equals("STRONG")) {
            suggestions.clear();
        }

        return new StrengthResult(
                strength,
                suggestions
        );
    }

    public static class StrengthResult {

        private final String strength;
        private final List<String> suggestions;

        public StrengthResult(
                String strength,
                List<String> suggestions) {

            this.strength = strength;
            this.suggestions = suggestions;
        }

        public String getStrength() {
            return strength;
        }

        public List<String> getSuggestions() {
            return suggestions;
        }
    }
}
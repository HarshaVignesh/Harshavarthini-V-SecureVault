package com.securevault.controller;

import com.securevault.util.PasswordStrengthUtil;
import com.securevault.util.PasswordStrengthUtil.StrengthResult;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/password")
public class PasswordStrengthController {

    @PostMapping("/strength")
    public ResponseEntity<?> checkStrength(
            @RequestBody Map<String, String> request) {

        String password =
                request.get("password");

        if (password == null ||
                password.isEmpty()) {

            return ResponseEntity.badRequest()
                    .body(
                            Map.of(
                                    "error",
                                    "Password is required"
                            )
                    );
        }

        StrengthResult result =
                PasswordStrengthUtil.checkStrength(
                        password
                );

        // Do NOT return the actual password
        // in the response.
        return ResponseEntity.ok(
                Map.of(
                        "strength",
                        result.getStrength(),

                        "suggestions",
                        result.getSuggestions()
                )
        );
    }
}
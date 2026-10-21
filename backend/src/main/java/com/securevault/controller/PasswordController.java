package com.securevault.controller;

import com.securevault.util.PasswordGenerator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/password")
public class PasswordController {

    @GetMapping("/generate")
    public ResponseEntity<?> generatePassword(

            @RequestParam(
                    defaultValue = "16"
            )
            int length,

            @RequestParam(
                    defaultValue = "true"
            )
            boolean uppercase,

            @RequestParam(
                    defaultValue = "true"
            )
            boolean lowercase,

            @RequestParam(
                    defaultValue = "true"
            )
            boolean numbers,

            @RequestParam(
                    defaultValue = "true"
            )
            boolean special
    ) {

        try {

            String password =
                    PasswordGenerator.generatePassword(
                            length,
                            uppercase,
                            lowercase,
                            numbers,
                            special
                    );

            return ResponseEntity.ok(
                    Map.of(
                            "password", password,
                            "length", password.length(),
                            "uppercase", uppercase,
                            "lowercase", lowercase,
                            "numbers", numbers,
                            "special", special
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(
                            Map.of(
                                    "error",
                                    e.getMessage()
                            )
                    );
        }
    }
}
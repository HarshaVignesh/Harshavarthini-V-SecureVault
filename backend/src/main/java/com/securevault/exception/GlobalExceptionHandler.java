package com.securevault.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        String msg = ex.getMessage();
        HttpStatus status = HttpStatus.BAD_REQUEST;

        if (msg != null) {
            String lower = msg.toLowerCase();
            if (lower.contains("permission") || lower.contains("unauthorized") || lower.contains("only the team owner") || lower.contains("expired")) {
                status = HttpStatus.FORBIDDEN;
            } else if (lower.contains("not found")) {
                status = HttpStatus.NOT_FOUND;
            }
        }

        return ResponseEntity.status(status).body(Map.of(
                "message", msg != null ? msg : "An error occurred",
                "error", msg != null ? msg : "An error occurred"
        ));
    }
}

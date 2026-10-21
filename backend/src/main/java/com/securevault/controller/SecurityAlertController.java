package com.securevault.controller;

import com.securevault.dto.SecurityAlertResponse;
import com.securevault.service.SecurityAlertService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/security-alerts")
public class SecurityAlertController {

    private final SecurityAlertService securityAlertService;

    public SecurityAlertController(SecurityAlertService securityAlertService) {
        this.securityAlertService = securityAlertService;
    }

    @GetMapping("/my")
    public ResponseEntity<List<SecurityAlertResponse>> getMyAlerts(
            Authentication authentication) {
        return ResponseEntity.ok(
                securityAlertService.getMyAlerts(authentication.getName()));
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<SecurityAlertResponse> resolveAlert(
            Authentication authentication,
            @PathVariable Long id) {
        return ResponseEntity.ok(
                securityAlertService.resolveMyAlert(authentication.getName(), id));
    }
}

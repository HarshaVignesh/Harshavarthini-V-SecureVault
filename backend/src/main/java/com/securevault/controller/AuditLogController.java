package com.securevault.controller;

import com.securevault.dto.AuditLogResponse;
import com.securevault.entity.AuditLogAction;
import com.securevault.service.AuditLogService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {

    private final AuditLogService auditLogService;

    public AuditLogController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @GetMapping("/my")
    public ResponseEntity<Page<AuditLogResponse>> getMyAuditLogs(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Page<AuditLogResponse> logs = auditLogService.getUserAuditLogs(
                authentication.getName(), page, size);

        return ResponseEntity.ok(logs);
    }

    @GetMapping
    public ResponseEntity<Page<AuditLogResponse>> getAllAuditLogs(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Page<AuditLogResponse> logs = auditLogService.getAllAuditLogs(page, size);

        return ResponseEntity.ok(logs);
    }

    @GetMapping("/action/{action}")
    public ResponseEntity<Page<AuditLogResponse>> getAuditLogsByAction(
            Authentication authentication,
            @PathVariable AuditLogAction action,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Page<AuditLogResponse> logs = auditLogService.getAuditLogsByAction(action, page, size);

        return ResponseEntity.ok(logs);
    }

    @GetMapping("/date-range")
    public ResponseEntity<Page<AuditLogResponse>> getAuditLogsByDateRange(
            Authentication authentication,
            @RequestParam String start,
            @RequestParam String end,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        LocalDateTime startDateTime = LocalDateTime.parse(start);
        LocalDateTime endDateTime = LocalDateTime.parse(end);

        Page<AuditLogResponse> logs = auditLogService.getAuditLogsByDateRange(
                startDateTime, endDateTime, page, size);

        return ResponseEntity.ok(logs);
    }

    @GetMapping("/my/download")
    public ResponseEntity<?> downloadMyAuditLogs(
            Authentication authentication) {

        byte[] csvData = auditLogService.generateAuditLogsCsv(authentication.getName());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", "login-history.csv");

        return ResponseEntity.ok()
                .headers(headers)
                .body(csvData);
    }
}

package com.securevault.service;

import com.securevault.dto.AuditLogResponse;
import com.securevault.entity.AuditLog;
import com.securevault.entity.AuditLogAction;
import com.securevault.entity.User;
import com.securevault.respository.AuditLogRepository;
import com.securevault.respository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.nio.charset.StandardCharsets;

@Service
public class AuditLogService {

    private static final Logger logger = LoggerFactory.getLogger(AuditLogService.class);
    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    public AuditLogService(AuditLogRepository auditLogRepository, UserRepository userRepository) {
        this.auditLogRepository = auditLogRepository;
        this.userRepository = userRepository;
    }

    public void logAuditEvent(String userEmail, AuditLogAction action, String description,
                             String ipAddress, String status) {
        try {
            User user = userRepository.findByEmail(userEmail)
                    .orElse(null);

            if (user == null) {
                logger.warn("User not found for audit log: {}", userEmail);
                return;
            }

            AuditLog auditLog = new AuditLog(user, action, description, ipAddress, status);
            auditLogRepository.save(auditLog);
        } catch (Exception e) {
            logger.error("Failed to log audit event for user: {}, action: {}", userEmail, action, e);
        }
    }

    public long countRecentFailedLogins(String userEmail, LocalDateTime since) {
        return userRepository.findByEmail(userEmail)
                .map(user -> auditLogRepository.countByUserIdAndActionAndTimestampAfter(
                        user.getId(), AuditLogAction.LOGIN_FAILED, since))
                .orElse(0L);
    }

    public boolean hasRecentAuditEvent(String userEmail, AuditLogAction action,
                                       LocalDateTime since) {
        return userRepository.findByEmail(userEmail)
                .map(user -> auditLogRepository.existsByUserIdAndActionAndTimestampAfter(
                        user.getId(), action, since))
                .orElse(false);
    }

    public Page<AuditLogResponse> getUserAuditLogs(String userEmail, int page, int size) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());
        Page<AuditLog> auditLogs = auditLogRepository.findByUserId(user.getId(), pageable);

        return auditLogs.map(this::convertToResponse);
    }

    public Page<AuditLogResponse> getAllAuditLogs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());
        Page<AuditLog> auditLogs = auditLogRepository.findAll(pageable);

        return auditLogs.map(this::convertToResponse);
    }

    public Page<AuditLogResponse> getAuditLogsByAction(AuditLogAction action, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());
        Page<AuditLog> auditLogs = auditLogRepository.findByAction(action, pageable);

        return auditLogs.map(this::convertToResponse);
    }

    public Page<AuditLogResponse> getAuditLogsByDateRange(LocalDateTime start, LocalDateTime end,
                                                          int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());
        Page<AuditLog> auditLogs = auditLogRepository.findByTimestampBetween(start, end, pageable);

        return auditLogs.map(this::convertToResponse);
    }

    public List<AuditLogResponse> getUserAuditLogsRecent(String userEmail, int limit) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<AuditLog> auditLogs = auditLogRepository.findByUserIdOrderByTimestampDesc(user.getId());
        return auditLogs.stream()
                .limit(limit)
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private AuditLogResponse convertToResponse(AuditLog auditLog) {
        return new AuditLogResponse(
                auditLog.getId(),
                auditLog.getUser().getEmail(),
                auditLog.getAction(),
                auditLog.getDescription(),
                auditLog.getTimestamp(),
                auditLog.getIpAddress(),
                auditLog.getStatus()
        );
    }

    public byte[] generateAuditLogsCsv(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<AuditLog> auditLogs = auditLogRepository.findByUserIdOrderByTimestampDesc(user.getId());

        StringBuilder csv = new StringBuilder();
        csv.append("Date/Time,Action,Status,IP Address,Description\n");

        for (AuditLog log : auditLogs) {
            csv.append(escapeCsvField(log.getTimestamp().toString())).append(",");
            csv.append(escapeCsvField(log.getAction().toString())).append(",");
            csv.append(escapeCsvField(log.getStatus())).append(",");
            csv.append(escapeCsvField(log.getIpAddress() != null ? log.getIpAddress() : "")).append(",");
            csv.append(escapeCsvField(log.getDescription() != null ? log.getDescription() : "")).append("\n");
        }

        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    private String escapeCsvField(String field) {
        if (field == null) {
            return "";
        }
        if (field.contains(",") || field.contains("\"") || field.contains("\n")) {
            return "\"" + field.replace("\"", "\"\"") + "\"";
        }
        return field;
    }
}

package com.securevault.dto;

import java.time.LocalDateTime;

public class SecurityAlertResponse {

    private final Long id;
    private final String type;
    private final String severity;
    private final String message;
    private final LocalDateTime createdAt;
    private final String status;

    public SecurityAlertResponse(Long id, String type, String severity,
                                 String message, LocalDateTime createdAt,
                                 String status) {
        this.id = id;
        this.type = type;
        this.severity = severity;
        this.message = message;
        this.createdAt = createdAt;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public String getType() {
        return type;
    }

    public String getSeverity() {
        return severity;
    }

    public String getMessage() {
        return message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getStatus() {
        return status;
    }
}

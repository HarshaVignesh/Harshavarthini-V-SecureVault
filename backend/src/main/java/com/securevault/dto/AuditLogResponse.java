package com.securevault.dto;

import com.securevault.entity.AuditLogAction;
import java.time.LocalDateTime;

public class AuditLogResponse {

    private Long id;
    private String userEmail;
    private AuditLogAction action;
    private String description;
    private LocalDateTime timestamp;
    private String ipAddress;
    private String status;

    public AuditLogResponse() {
    }

    public AuditLogResponse(Long id, String userEmail, AuditLogAction action, String description,
                           LocalDateTime timestamp, String ipAddress, String status) {
        this.id = id;
        this.userEmail = userEmail;
        this.action = action;
        this.description = description;
        this.timestamp = timestamp;
        this.ipAddress = ipAddress;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public AuditLogAction getAction() {
        return action;
    }

    public void setAction(AuditLogAction action) {
        this.action = action;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

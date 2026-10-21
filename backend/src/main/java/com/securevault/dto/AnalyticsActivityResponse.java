package com.securevault.dto;

import java.time.LocalDateTime;

public class AnalyticsActivityResponse {

    private String action;
    private String status;
    private String description;
    private LocalDateTime timestamp;

    public AnalyticsActivityResponse() {
    }

    public AnalyticsActivityResponse(String action, String status, String description,
                                     LocalDateTime timestamp) {
        this.action = action;
        this.status = status;
        this.description = description;
        this.timestamp = timestamp;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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
}


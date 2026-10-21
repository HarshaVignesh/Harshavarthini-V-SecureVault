package com.securevault.dto;

import java.time.LocalDateTime;

public class AddTeamMemberRequest {
    private String userEmail;
    private String permission;
    private LocalDateTime expiresAt;

    public AddTeamMemberRequest() {}

    public AddTeamMemberRequest(String userEmail, String permission) {
        this.userEmail = userEmail;
        this.permission = permission;
    }

    public AddTeamMemberRequest(String userEmail, String permission, LocalDateTime expiresAt) {
        this.userEmail = userEmail;
        this.permission = permission;
        this.expiresAt = expiresAt;
    }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getPermission() { return permission; }
    public void setPermission(String permission) { this.permission = permission; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
}

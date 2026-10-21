package com.securevault.dto;

import java.time.LocalDateTime;

public class UpdateTeamMemberRequest {
    private String permission;
    private LocalDateTime expiresAt;
    private Boolean removeExpiration;

    public UpdateTeamMemberRequest() {}

    public UpdateTeamMemberRequest(String permission, LocalDateTime expiresAt, Boolean removeExpiration) {
        this.permission = permission;
        this.expiresAt = expiresAt;
        this.removeExpiration = removeExpiration;
    }

    public String getPermission() { return permission; }
    public void setPermission(String permission) { this.permission = permission; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

    public Boolean getRemoveExpiration() { return removeExpiration; }
    public void setRemoveExpiration(Boolean removeExpiration) { this.removeExpiration = removeExpiration; }
}

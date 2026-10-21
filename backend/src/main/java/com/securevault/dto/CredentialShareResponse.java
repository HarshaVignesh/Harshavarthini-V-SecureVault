package com.securevault.dto;

import java.time.LocalDateTime;

public class CredentialShareResponse {

    private Long id;
    private Long credentialId;
    private String sharedWithUserEmail;
    private String permission;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
    private Boolean expired;

    public CredentialShareResponse() {
    }

    public CredentialShareResponse(
            Long id,
            Long credentialId,
            String sharedWithUserEmail,
            String permission,
            LocalDateTime expiresAt,
            LocalDateTime createdAt,
            Boolean expired) {
        this.id = id;
        this.credentialId = credentialId;
        this.sharedWithUserEmail = sharedWithUserEmail;
        this.permission = permission;
        this.expiresAt = expiresAt;
        this.createdAt = createdAt;
        this.expired = expired;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCredentialId() {
        return credentialId;
    }

    public void setCredentialId(Long credentialId) {
        this.credentialId = credentialId;
    }

    public String getSharedWithUserEmail() {
        return sharedWithUserEmail;
    }

    public void setSharedWithUserEmail(String sharedWithUserEmail) {
        this.sharedWithUserEmail = sharedWithUserEmail;
    }

    public String getPermission() {
        return permission;
    }

    public void setPermission(String permission) {
        this.permission = permission;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Boolean getExpired() {
        return expired;
    }

    public void setExpired(Boolean expired) {
        this.expired = expired;
    }
}

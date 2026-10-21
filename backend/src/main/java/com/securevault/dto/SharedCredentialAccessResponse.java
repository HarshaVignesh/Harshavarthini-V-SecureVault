package com.securevault.dto;

import java.time.LocalDateTime;

public class SharedCredentialAccessResponse {

    private Long credentialId;
    private Long shareId;
    private String title;
    private String username;
    private String password;
    private String url;
    private String notes;
    private String permission;
    private String sharedBy;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
    private Boolean canView;
    private Boolean canEdit;
    private Boolean canDelete;
    private Boolean canManageShares;

    public SharedCredentialAccessResponse() {
    }

    public SharedCredentialAccessResponse(
            Long credentialId,
            Long shareId,
            String title,
            String username,
            String password,
            String url,
            String notes,
            String permission,
            String sharedBy,
            LocalDateTime expiresAt,
            LocalDateTime createdAt,
            Boolean canView,
            Boolean canEdit,
            Boolean canDelete,
            Boolean canManageShares) {
        this.credentialId = credentialId;
        this.shareId = shareId;
        this.title = title;
        this.username = username;
        this.password = password;
        this.url = url;
        this.notes = notes;
        this.permission = permission;
        this.sharedBy = sharedBy;
        this.expiresAt = expiresAt;
        this.createdAt = createdAt;
        this.canView = canView;
        this.canEdit = canEdit;
        this.canDelete = canDelete;
        this.canManageShares = canManageShares;
    }

    public Long getCredentialId() {
        return credentialId;
    }

    public void setCredentialId(Long credentialId) {
        this.credentialId = credentialId;
    }

    public Long getShareId() {
        return shareId;
    }

    public void setShareId(Long shareId) {
        this.shareId = shareId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getPermission() {
        return permission;
    }

    public void setPermission(String permission) {
        this.permission = permission;
    }

    public String getSharedBy() {
        return sharedBy;
    }

    public void setSharedBy(String sharedBy) {
        this.sharedBy = sharedBy;
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

    public Boolean getCanView() {
        return canView;
    }

    public void setCanView(Boolean canView) {
        this.canView = canView;
    }

    public Boolean getCanEdit() {
        return canEdit;
    }

    public void setCanEdit(Boolean canEdit) {
        this.canEdit = canEdit;
    }

    public Boolean getCanDelete() {
        return canDelete;
    }

    public void setCanDelete(Boolean canDelete) {
        this.canDelete = canDelete;
    }

    public Boolean getCanManageShares() {
        return canManageShares;
    }

    public void setCanManageShares(Boolean canManageShares) {
        this.canManageShares = canManageShares;
    }
}

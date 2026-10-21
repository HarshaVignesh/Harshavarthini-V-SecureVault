package com.securevault.dto;

import java.time.LocalDateTime;

public class TeamMemberResponse {
    private Long id;
    private String userEmail;
    private String userFullName;
    private String permission;
    private LocalDateTime joinedAt;
    private LocalDateTime expiresAt;
    private Boolean expired;

    public TeamMemberResponse(Long id, String userEmail, String userFullName, String permission, LocalDateTime joinedAt) {
        this(id, userEmail, userFullName, permission, joinedAt, null, false);
    }

    public TeamMemberResponse(Long id, String userEmail, String userFullName, String permission, LocalDateTime joinedAt, LocalDateTime expiresAt, Boolean expired) {
        this.id = id;
        this.userEmail = userEmail;
        this.userFullName = userFullName;
        this.permission = permission;
        this.joinedAt = joinedAt;
        this.expiresAt = expiresAt;
        this.expired = expired != null ? expired : false;
    }

    public Long getId() { return id; }
    public String getUserEmail() { return userEmail; }
    public String getUserFullName() { return userFullName; }
    public String getPermission() { return permission; }
    public LocalDateTime getJoinedAt() { return joinedAt; }
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public Boolean getExpired() { return expired; }
}

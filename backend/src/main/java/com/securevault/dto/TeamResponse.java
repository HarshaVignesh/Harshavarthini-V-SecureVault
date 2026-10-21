package com.securevault.dto;

import java.time.LocalDateTime;
import java.util.Set;

public class TeamResponse {
    private Long id;
    private String name;
    private String ownerEmail;
    private LocalDateTime createdAt;
    private Set<TeamMemberResponse> members;

    public TeamResponse(Long id, String name, String ownerEmail, LocalDateTime createdAt, Set<TeamMemberResponse> members) {
        this.id = id;
        this.name = name;
        this.ownerEmail = ownerEmail;
        this.createdAt = createdAt;
        this.members = members;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getOwnerEmail() { return ownerEmail; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public Set<TeamMemberResponse> getMembers() { return members; }
}

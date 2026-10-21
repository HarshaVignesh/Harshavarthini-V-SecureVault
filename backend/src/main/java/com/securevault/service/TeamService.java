package com.securevault.service;

import com.securevault.entity.Permission;
import com.securevault.entity.Team;
import com.securevault.entity.TeamMember;
import com.securevault.entity.User;
import com.securevault.entity.Vault;
import com.securevault.dto.TeamResponse;
import com.securevault.dto.TeamMemberResponse;
import com.securevault.respository.TeamRepository;
import com.securevault.respository.TeamMemberRepository;
import com.securevault.respository.UserRepository;
import com.securevault.respository.VaultRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final UserRepository userRepository;
    private final VaultRepository vaultRepository;

    public TeamService(TeamRepository teamRepository,
                      TeamMemberRepository teamMemberRepository,
                      UserRepository userRepository,
                      VaultRepository vaultRepository) {
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.userRepository = userRepository;
        this.vaultRepository = vaultRepository;
    }

    @Transactional
    public TeamResponse createTeam(String userEmail, String teamName) {
        User owner = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Team team = new Team(teamName, owner, LocalDateTime.now());

        // Create team vault
        Vault teamVault = new Vault();
        teamVault.setName("Team Vault: " + teamName);
        teamVault.setUser(owner);
        teamVault.setCreatedAt(LocalDateTime.now());
        teamVault = vaultRepository.save(teamVault);

        team.setVault(teamVault);
        team = teamRepository.save(team);

        // Add owner as FULL_MANAGEMENT member with no expiration
        TeamMember ownerMember = new TeamMember(team, owner, Permission.FULL_MANAGEMENT, LocalDateTime.now(), null);
        teamMemberRepository.save(ownerMember);
        team.addMember(ownerMember);

        return toTeamResponse(team);
    }

    public List<TeamResponse> getUserTeams(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<TeamMember> memberships = teamMemberRepository.findByUserId(user.getId());
        List<Team> activeTeams = memberships.stream()
                .filter(m -> !m.isExpired())
                .map(TeamMember::getTeam)
                .collect(Collectors.toList());

        return activeTeams.stream().map(this::toTeamResponse).collect(Collectors.toList());
    }

    @Transactional
    public TeamMemberResponse addTeamMember(String requesterEmail, Long teamId, String memberEmail, String permissionStr, LocalDateTime expiresAt) {
        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        // Verify requester permission and active membership
        verifyManagementPermission(team, requester);

        if (memberEmail == null || memberEmail.trim().isEmpty()) {
            throw new RuntimeException("Please enter a valid user email.");
        }

        User memberUser = userRepository.findByEmail(memberEmail.trim())
                .orElseThrow(() -> new RuntimeException("Please enter a valid user email."));

        // Prevent duplicate members or adding owner
        if (team.getOwner().getId().equals(memberUser.getId()) ||
                teamMemberRepository.findByTeamIdAndUserId(teamId, memberUser.getId()).isPresent()) {
            throw new RuntimeException("User is already a member of this team.");
        }

        Permission permission = Permission.valueOf(permissionStr.toUpperCase());
        TeamMember newMember = new TeamMember(team, memberUser, permission, LocalDateTime.now(), expiresAt);
        newMember = teamMemberRepository.save(newMember);
        team.addMember(newMember);

        return toTeamMemberResponse(newMember);
    }

    @Transactional
    public TeamMemberResponse updateTeamMember(String requesterEmail, Long teamId, Long memberId, String permissionStr, LocalDateTime expiresAt, Boolean removeExpiration) {
        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        verifyManagementPermission(team, requester);

        TeamMember member = teamMemberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Team member not found"));

        if (!member.getTeam().getId().equals(teamId)) {
            throw new RuntimeException("Team member does not belong to this team.");
        }

        if (team.getOwner().getId().equals(member.getUser().getId())) {
            throw new RuntimeException("Cannot edit team owner access.");
        }

        if (permissionStr != null && !permissionStr.isBlank()) {
            member.setPermission(Permission.valueOf(permissionStr.toUpperCase()));
        }

        if (Boolean.TRUE.equals(removeExpiration)) {
            member.setExpiresAt(null);
        } else if (expiresAt != null) {
            member.setExpiresAt(expiresAt);
        }

        member = teamMemberRepository.save(member);
        return toTeamMemberResponse(member);
    }

    @Transactional
    public void removeTeamMember(String requesterEmail, Long teamId, Long memberId) {
        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        verifyManagementPermission(team, requester);

        TeamMember member = teamMemberRepository.findById(memberId)
                .orElse(null);

        if (member == null) {
            // Try by userId for backward compatibility
            member = teamMemberRepository.findByTeamIdAndUserId(teamId, memberId)
                    .orElseThrow(() -> new RuntimeException("Team member not found"));
        }

        if (team.getOwner().getId().equals(member.getUser().getId())) {
            throw new RuntimeException("Cannot remove team owner.");
        }

        team.removeMember(member);
        teamMemberRepository.delete(member);
    }

    @Transactional
    public void deleteTeam(String requesterEmail, Long teamId) {
        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        // Only owner can delete team
        if (!team.getOwner().getId().equals(requester.getId())) {
            throw new RuntimeException("You do not have permission to perform this action.");
        }

        Vault teamVault = team.getVault();
        teamRepository.delete(team);
        if (teamVault != null) {
            vaultRepository.delete(teamVault);
        }
    }

    public List<TeamMemberResponse> getTeamMembers(String userEmail, Long teamId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        if (!team.getOwner().getId().equals(user.getId())) {
            TeamMember requesterMember = teamMemberRepository.findByTeamIdAndUserId(teamId, user.getId())
                    .orElseThrow(() -> new RuntimeException("You do not have permission to perform this action."));

            if (requesterMember.isExpired()) {
                throw new RuntimeException("This team membership has expired.");
            }
        }

        List<TeamMember> members = teamMemberRepository.findByTeamId(teamId);
        return members.stream().map(this::toTeamMemberResponse).collect(Collectors.toList());
    }

    private void verifyManagementPermission(Team team, User requester) {
        if (!team.getOwner().getId().equals(requester.getId())) {
            TeamMember requesterMember = teamMemberRepository.findByTeamIdAndUserId(team.getId(), requester.getId())
                    .orElseThrow(() -> new RuntimeException("You do not have permission to perform this action."));

            if (requesterMember.isExpired()) {
                throw new RuntimeException("This team membership has expired.");
            }

            if (requesterMember.getPermission() != Permission.FULL_MANAGEMENT) {
                throw new RuntimeException("You do not have permission to perform this action.");
            }
        }
    }

    private TeamResponse toTeamResponse(Team team) {
        Set<TeamMemberResponse> members = team.getMembers().stream()
                .map(this::toTeamMemberResponse)
                .collect(Collectors.toSet());
        return new TeamResponse(team.getId(), team.getName(), team.getOwner().getEmail(), team.getCreatedAt(), members);
    }

    private TeamMemberResponse toTeamMemberResponse(TeamMember member) {
        return new TeamMemberResponse(
                member.getId(),
                member.getUser().getEmail(),
                member.getUser().getFullName(),
                member.getPermission().name(),
                member.getJoinedAt(),
                member.getExpiresAt(),
                member.isExpired()
        );
    }
}

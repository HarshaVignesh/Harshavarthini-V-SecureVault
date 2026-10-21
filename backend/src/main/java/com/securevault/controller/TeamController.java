package com.securevault.controller;

import com.securevault.dto.AddTeamMemberRequest;
import com.securevault.dto.CreateTeamRequest;
import com.securevault.dto.TeamMemberResponse;
import com.securevault.dto.TeamResponse;
import com.securevault.dto.UpdateTeamMemberRequest;
import com.securevault.service.TeamService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @PostMapping
    public ResponseEntity<TeamResponse> createTeam(
            Authentication authentication,
            @RequestBody CreateTeamRequest request) {
        String userEmail = authentication.getName();
        TeamResponse response = teamService.createTeam(userEmail, request.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/my")
    public ResponseEntity<List<TeamResponse>> getMyTeams(
            Authentication authentication) {
        String userEmail = authentication.getName();
        List<TeamResponse> teams = teamService.getUserTeams(userEmail);
        return ResponseEntity.ok(teams);
    }

    @DeleteMapping("/{teamId}")
    public ResponseEntity<Void> deleteTeam(
            Authentication authentication,
            @PathVariable Long teamId) {
        String userEmail = authentication.getName();
        teamService.deleteTeam(userEmail, teamId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{teamId}/members")
    public ResponseEntity<List<TeamMemberResponse>> getTeamMembers(
            Authentication authentication,
            @PathVariable Long teamId) {
        String userEmail = authentication.getName();
        List<TeamMemberResponse> members = teamService.getTeamMembers(userEmail, teamId);
        return ResponseEntity.ok(members);
    }

    @PostMapping("/{teamId}/members")
    public ResponseEntity<TeamMemberResponse> addTeamMember(
            Authentication authentication,
            @PathVariable Long teamId,
            @RequestBody AddTeamMemberRequest request) {
        String userEmail = authentication.getName();
        TeamMemberResponse response = teamService.addTeamMember(
                userEmail, teamId, request.getUserEmail(), request.getPermission(), request.getExpiresAt());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{teamId}/members/{memberId}")
    public ResponseEntity<TeamMemberResponse> updateTeamMember(
            Authentication authentication,
            @PathVariable Long teamId,
            @PathVariable Long memberId,
            @RequestBody UpdateTeamMemberRequest request) {
        String userEmail = authentication.getName();
        TeamMemberResponse response = teamService.updateTeamMember(
                userEmail, teamId, memberId, request.getPermission(), request.getExpiresAt(), request.getRemoveExpiration());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{teamId}/members/{memberId}")
    public ResponseEntity<Void> removeTeamMember(
            Authentication authentication,
            @PathVariable Long teamId,
            @PathVariable Long memberId) {
        String userEmail = authentication.getName();
        teamService.removeTeamMember(userEmail, teamId, memberId);
        return ResponseEntity.noContent().build();
    }
}

package com.securevault.service;

import com.securevault.entity.AuditLogAction;
import com.securevault.entity.CredentialShare;
import com.securevault.entity.Permission;
import com.securevault.entity.Team;
import com.securevault.entity.TeamMember;
import com.securevault.respository.CredentialShareRepository;
import com.securevault.respository.TeamMemberRepository;
import com.securevault.respository.TeamRepository;
import java.time.LocalDateTime;
import com.securevault.dto.CredentialRequest;
import com.securevault.util.EncryptionUtil;
import com.securevault.dto.CredentialResponse;
import com.securevault.entity.Credential;
import com.securevault.entity.User;
import com.securevault.entity.Vault;
import com.securevault.respository.CredentialRepository;
import com.securevault.respository.UserRepository;
import com.securevault.respository.VaultRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CredentialService {

    private final CredentialRepository credentialRepository;
    private final VaultRepository vaultRepository;
    private final UserRepository userRepository;
    private final CredentialShareRepository shareRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final AuditLogService auditLogService;

    public CredentialService(CredentialRepository credentialRepository,
                             VaultRepository vaultRepository,
                             UserRepository userRepository,
                             CredentialShareRepository shareRepository,
                             TeamRepository teamRepository,
                             TeamMemberRepository teamMemberRepository,
                             AuditLogService auditLogService) {

        this.credentialRepository = credentialRepository;
        this.vaultRepository = vaultRepository;
        this.userRepository = userRepository;
        this.shareRepository = shareRepository;
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.auditLogService = auditLogService;
    }

    private Vault getVaultWithAccess(String email, Long vaultId, Permission requiredPermission, boolean isDeleteAction) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Vault vault = vaultRepository.findById(vaultId)
                .orElseThrow(() -> new RuntimeException("Vault not found"));

        // 1. Check if user is the direct owner of the vault
        if (vault.getUser().getId().equals(user.getId())) {
            if (isDeleteAction) {
                Team team = teamRepository.findByVaultId(vaultId).orElse(null);
                if (team != null && credentialRepository.countByVault(vault) <= 1) {
                    throw new RuntimeException("This team must contain at least one credential.");
                }
            }
            return vault;
        }

        // 2. Check if the vault belongs to a Team
        Team team = teamRepository.findByVaultId(vaultId)
                .orElseThrow(() -> new RuntimeException("Vault not found"));

        TeamMember member = teamMemberRepository.findByTeamIdAndUserId(team.getId(), user.getId())
                .orElseThrow(() -> new RuntimeException("You do not have permission to access this team vault."));

        if (member.isExpired()) {
            throw new RuntimeException("This team membership has expired.");
        }

        Permission perm = member.getPermission();
        if (requiredPermission == Permission.EDIT) {
            if (perm != Permission.EDIT && perm != Permission.FULL_MANAGEMENT) {
                throw new RuntimeException("You do not have permission to perform this action.");
            }
        } else if (requiredPermission == Permission.FULL_MANAGEMENT) {
            if (perm != Permission.FULL_MANAGEMENT) {
                throw new RuntimeException("You do not have permission to perform this action.");
            }
        }

        if (isDeleteAction) {
            if (credentialRepository.countByVault(vault) <= 1) {
                throw new RuntimeException("This team must contain at least one credential.");
            }
        }

        return vault;
    }

    // CREATE

    public CredentialResponse createCredential(
            String email,
            Long vaultId,
            CredentialRequest request) {

        Vault vault = getVaultWithAccess(email, vaultId, Permission.EDIT, false);

        LocalDateTime now = LocalDateTime.now();

        Credential credential = new Credential();
        credential.setTitle(request.getTitle());
        credential.setUsername(request.getUsername());
        credential.setPassword(
                EncryptionUtil.encrypt(request.getPassword())
        );
        credential.setUrl(request.getUrl());
        credential.setNotes(request.getNotes());
        credential.setVault(vault);
        credential.setCreatedAt(now);
        credential.setUpdatedAt(now);

        Credential saved = credentialRepository.save(credential);

        auditLogService.logAuditEvent(
                email,
                AuditLogAction.CREDENTIAL_CREATED,
                "Created credential: " + request.getTitle(),
                null,
                "SUCCESS"
        );

        return toResponse(saved);
    }

    // READ ALL

    public List<CredentialResponse> getCredentials(
            String email,
            Long vaultId) {

        Vault vault = getVaultWithAccess(email, vaultId, Permission.VIEW_ONLY, false);

        return credentialRepository
                .findByVault(vault)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // READ ONE

    public CredentialResponse getCredential(
            String email,
            Long vaultId,
            Long credentialId) {

        Vault vault = getVaultWithAccess(email, vaultId, Permission.VIEW_ONLY, false);

        Credential credential = credentialRepository
                .findByIdAndVault(credentialId, vault)
                .orElseThrow(() -> new RuntimeException("Credential not found"));

        auditLogService.logAuditEvent(
                email,
                AuditLogAction.CREDENTIAL_ACCESSED,
                "Accessed credential: " + credential.getTitle(),
                null,
                "SUCCESS"
        );

        return toResponse(credential);
    }

    // UPDATE

    public CredentialResponse updateCredential(
            String email,
            Long vaultId,
            Long credentialId,
            CredentialRequest request) {

        Vault vault = getVaultWithAccess(email, vaultId, Permission.EDIT, false);

        Credential credential = credentialRepository.findById(credentialId)
                .orElseThrow(() -> new RuntimeException("Credential not found"));

        if (!credential.getVault().getId().equals(vaultId)) {
            throw new RuntimeException("Credential does not belong to this vault");
        }

        credential.setTitle(request.getTitle());
        credential.setUsername(request.getUsername());
        credential.setPassword(
                EncryptionUtil.encrypt(request.getPassword())
        );
        credential.setUrl(request.getUrl());
        credential.setNotes(request.getNotes());
        credential.setUpdatedAt(LocalDateTime.now());

        Credential updatedCredential = credentialRepository.save(credential);

        auditLogService.logAuditEvent(
                email,
                AuditLogAction.CREDENTIAL_UPDATED,
                "Updated credential: " + request.getTitle(),
                null,
                "SUCCESS"
        );

        return toResponse(updatedCredential);
    }

    // DELETE

    public void deleteCredential(
            String email,
            Long vaultId,
            Long credentialId) {

        Vault vault = getVaultWithAccess(email, vaultId, Permission.FULL_MANAGEMENT, true);

        Credential credential = credentialRepository.findById(credentialId)
                .orElseThrow(() -> new RuntimeException("Credential not found"));

        if (!credential.getVault().getId().equals(vaultId)) {
            throw new RuntimeException("Credential does not belong to this vault");
        }

        String credentialTitle = credential.getTitle();
        credentialRepository.delete(credential);

        auditLogService.logAuditEvent(
                email,
                AuditLogAction.CREDENTIAL_DELETED,
                "Deleted credential: " + credentialTitle,
                null,
                "SUCCESS"
        );
    }

    private CredentialResponse toResponse(Credential credential) {
        return new CredentialResponse(
                credential.getId(),
                credential.getTitle(),
                credential.getUsername(),
                EncryptionUtil.decrypt(credential.getPassword()),
                credential.getUrl(),
                credential.getNotes(),
                credential.getCreatedAt(),
                credential.getUpdatedAt()
        );
    }
}
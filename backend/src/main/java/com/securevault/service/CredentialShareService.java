package com.securevault.service;

import com.securevault.dto.CredentialShareResponse;
import com.securevault.dto.SharedCredentialAccessResponse;
import com.securevault.dto.ShareCredentialRequest;
import com.securevault.entity.AuditLogAction;
import com.securevault.entity.Credential;
import com.securevault.entity.CredentialShare;
import com.securevault.entity.Permission;
import com.securevault.entity.User;
import com.securevault.respository.CredentialRepository;
import com.securevault.respository.CredentialShareRepository;
import com.securevault.respository.UserRepository;
import com.securevault.util.EncryptionUtil;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class CredentialShareService {

    private final CredentialRepository credentialRepository;
    private final CredentialShareRepository shareRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    public CredentialShareService(
            CredentialRepository credentialRepository,
            CredentialShareRepository shareRepository,
            UserRepository userRepository,
            AuditLogService auditLogService) {

        this.credentialRepository = credentialRepository;
        this.shareRepository = shareRepository;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    public Map<String, Object> shareCredential(
            String ownerEmail,
            Long credentialId,
            ShareCredentialRequest request) {

        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Owner not found"));

        Credential credential = credentialRepository.findById(credentialId)
                .orElseThrow(() -> new IllegalArgumentException("Credential not found"));

        if (!credential.getVault().getUser().getId().equals(owner.getId())) {
            throw new IllegalArgumentException("You do not own this credential");
        }

        User sharedWithUser = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User to share with not found"));

        if (owner.getId().equals(sharedWithUser.getId())) {
            throw new IllegalArgumentException("You cannot share a credential with yourself");
        }

        Permission permission = parsePermission(request.getPermission());

        try {
            CredentialShare share = new CredentialShare(
                    credential,
                    sharedWithUser,
                    permission
            );
            share.setExpiresAt(request.getExpiresAt());
            shareRepository.save(share);

            auditLogService.logAuditEvent(
                    ownerEmail,
                    AuditLogAction.CREDENTIAL_SHARED,
                    "Shared credential '" + credential.getTitle() + "' with " + sharedWithUser.getEmail() +
                    " (" + permission.toString() + ")",
                    null,
                    "SUCCESS"
            );

            return Map.of(
                    "message", "Credential shared successfully",
                    "credentialId", credentialId,
                    "sharedWith", sharedWithUser.getEmail(),
                    "permission", permission.toString(),
                    "expiresAt", share.getExpiresAt() == null ? "Never" : share.getExpiresAt().toString()
            );
        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException("Credential already shared with this user");
        }
    }

    public List<CredentialShareResponse> getShares(
            String userEmail,
            Long credentialId) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Credential credential = credentialRepository.findById(credentialId)
                .orElseThrow(() -> new IllegalArgumentException("Credential not found"));

        boolean isOwner = credential.getVault().getUser().getId().equals(user.getId());

        if (!isOwner) {
            enforceFullManagementPermission(credential, user);
        }

        return shareRepository.findByCredential(credential)
                .stream()
                .map(share -> new CredentialShareResponse(
                        share.getId(),
                        share.getCredential().getId(),
                        share.getSharedWithUser().getEmail(),
                        share.getPermission().toString(),
                        share.getExpiresAt(),
                        share.getCreatedAt(),
                        share.isExpired()
                ))
                .toList();
    }

    public void removeShare(
            String userEmail,
            Long credentialId,
            Long shareId) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Credential credential = credentialRepository.findById(credentialId)
                .orElseThrow(() -> new IllegalArgumentException("Credential not found"));

        CredentialShare share = shareRepository.findById(shareId)
                .orElseThrow(() -> new IllegalArgumentException("Share not found"));

        if (!share.getCredential().getId().equals(credentialId)) {
            throw new IllegalArgumentException("Share does not belong to this credential");
        }

        boolean isOwner = credential.getVault().getUser().getId().equals(user.getId());

        if (!isOwner) {
            enforceFullManagementPermission(credential, user);
        }

        String sharedWithEmail = share.getSharedWithUser().getEmail();
        shareRepository.delete(share);

        auditLogService.logAuditEvent(
                userEmail,
                AuditLogAction.SHARE_REMOVED,
                "Removed share for credential '" + credential.getTitle() + "' from " + sharedWithEmail,
                null,
                "SUCCESS"
        );
    }

    public SharedCredentialAccessResponse accessSharedCredential(
            String userEmail,
            Long credentialId) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Credential credential = credentialRepository.findById(credentialId)
                .orElseThrow(() -> new IllegalArgumentException("Credential not found"));

        CredentialShare share = shareRepository
                .findByCredentialAndSharedWithUser(credential, user)
                .orElseThrow(() -> new IllegalArgumentException("You do not have access to this credential"));

        if (share.isExpired()) {
            throw new IllegalArgumentException("Credential sharing has expired");
        }

        String password = EncryptionUtil.decrypt(credential.getPassword());

        boolean canEdit = share.getPermission() == Permission.EDIT ||
                          share.getPermission() == Permission.FULL_MANAGEMENT;
        boolean canDelete = share.getPermission() == Permission.FULL_MANAGEMENT;
        boolean canManageShares = share.getPermission() == Permission.FULL_MANAGEMENT;

        return new SharedCredentialAccessResponse(
                credential.getId(),
                share.getId(),
                credential.getTitle(),
                credential.getUsername(),
                password,
                credential.getUrl(),
                credential.getNotes(),
                share.getPermission().toString(),
                credential.getVault().getUser().getEmail(),
                share.getExpiresAt(),
                share.getCreatedAt(),
                true,
                canEdit,
                canDelete,
                canManageShares
        );
    }

    public Map<String, Object> updateSharePermission(
            String userEmail,
            Long credentialId,
            Long shareId,
            String permissionValue) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Credential credential = credentialRepository.findById(credentialId)
                .orElseThrow(() -> new IllegalArgumentException("Credential not found"));

        CredentialShare share = shareRepository.findById(shareId)
                .orElseThrow(() -> new IllegalArgumentException("Share not found"));

        if (!share.getCredential().getId().equals(credentialId)) {
            throw new IllegalArgumentException("Share does not belong to this credential");
        }

        boolean isOwner = credential.getVault().getUser().getId().equals(user.getId());

        if (!isOwner) {
            enforceFullManagementPermission(credential, user);
        }

        Permission permission = parsePermission(permissionValue);
        share.setPermission(permission);
        shareRepository.save(share);

        return Map.of(
                "message", "Share permission updated successfully",
                "credentialId", credentialId,
                "shareId", shareId,
                "permission", permission.toString()
        );
    }

    public List<SharedCredentialAccessResponse> getSharedWithMeCredentials(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return shareRepository.findBySharedWithUser(user)
                .stream()
                .filter(share -> !share.isExpired())
                .map(share -> {
                    String password = EncryptionUtil.decrypt(share.getCredential().getPassword());
                    boolean canEdit = share.getPermission() == Permission.EDIT ||
                                      share.getPermission() == Permission.FULL_MANAGEMENT;
                    boolean canDelete = share.getPermission() == Permission.FULL_MANAGEMENT;
                    boolean canManageShares = share.getPermission() == Permission.FULL_MANAGEMENT;

                    return new SharedCredentialAccessResponse(
                            share.getCredential().getId(),
                            share.getId(),
                            share.getCredential().getTitle(),
                            share.getCredential().getUsername(),
                            password,
                            share.getCredential().getUrl() != null ?
                                share.getCredential().getUrl() : "",
                            share.getCredential().getNotes() != null ?
                                share.getCredential().getNotes() : "",
                            share.getPermission().toString(),
                            share.getCredential().getVault().getUser().getEmail(),
                            share.getExpiresAt(),
                            share.getCreatedAt(),
                            true,
                            canEdit,
                            canDelete,
                            canManageShares
                    );
                })
                .toList();
    }

    private Permission parsePermission(String permissionValue) {
        try {
            return Permission.valueOf(permissionValue.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Permission must be VIEW_ONLY, EDIT, or FULL_MANAGEMENT");
        }
    }

    private void enforceFullManagementPermission(Credential credential, User user) {
        CredentialShare userShare = shareRepository
                .findByCredentialAndSharedWithUser(credential, user)
                .orElseThrow(() -> new IllegalArgumentException(
                        "You do not have access to manage shares for this credential"));

        if (userShare.isExpired()) {
            throw new IllegalArgumentException("Your access to this credential has expired");
        }

        if (userShare.getPermission() != Permission.FULL_MANAGEMENT) {
            throw new IllegalArgumentException(
                    "Your permission level does not allow managing shares for this credential");
        }
    }
}
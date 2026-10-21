package com.securevault.controller;

import com.securevault.dto.UpdateShareRequest;
import com.securevault.dto.ShareCredentialRequest;
import com.securevault.dto.CredentialShareResponse;
import com.securevault.dto.SharedCredentialAccessResponse;
import com.securevault.service.CredentialShareService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/credentials")
public class CredentialShareController {

    private final CredentialShareService shareService;

    public CredentialShareController(CredentialShareService shareService) {
        this.shareService = shareService;
    }

    @PostMapping("/{credentialId}/share")
    public ResponseEntity<?> shareCredential(
            Authentication authentication,
            @PathVariable Long credentialId,
            @Valid @RequestBody ShareCredentialRequest request) {

        return ResponseEntity.ok(
                shareService.shareCredential(
                        authentication.getName(),
                        credentialId,
                        request
                )
        );
    }

    @GetMapping("/{credentialId}/shares")
    public ResponseEntity<List<CredentialShareResponse>> getShares(
            Authentication authentication,
            @PathVariable Long credentialId) {

        return ResponseEntity.ok(
                shareService.getShares(
                        authentication.getName(),
                        credentialId
                )
        );
    }

    @DeleteMapping("/{credentialId}/shares/{shareId}")
    public ResponseEntity<?> removeShare(
            Authentication authentication,
            @PathVariable Long credentialId,
            @PathVariable Long shareId) {

        shareService.removeShare(
                authentication.getName(),
                credentialId,
                shareId
        );

        return ResponseEntity.ok(
                Map.of("message", "Credential share removed successfully")
        );
    }

    @GetMapping("/{credentialId}/shared")
    public ResponseEntity<SharedCredentialAccessResponse> accessSharedCredential(
            Authentication authentication,
            @PathVariable Long credentialId) {

        return ResponseEntity.ok(
                shareService.accessSharedCredential(
                        authentication.getName(),
                        credentialId
                )
        );
    }

    @PutMapping("/{credentialId}/shares/{shareId}")
    public ResponseEntity<?> updateSharePermission(
            Authentication authentication,
            @PathVariable Long credentialId,
            @PathVariable Long shareId,
            @Valid @RequestBody UpdateShareRequest request) {

        return ResponseEntity.ok(
                shareService.updateSharePermission(
                        authentication.getName(),
                        credentialId,
                        shareId,
                        request.getPermission()
                )
        );
    }

    @GetMapping("/shared-with-me")
    public ResponseEntity<List<SharedCredentialAccessResponse>> getSharedWithMeCredentials(
            Authentication authentication) {

        return ResponseEntity.ok(
                shareService.getSharedWithMeCredentials(
                        authentication.getName()
                )
        );
    }
}
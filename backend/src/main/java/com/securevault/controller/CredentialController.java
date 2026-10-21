package com.securevault.controller;

import com.securevault.dto.CredentialRequest;
import com.securevault.dto.CredentialResponse;
import com.securevault.service.CredentialService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vaults/{vaultId}/credentials")
public class CredentialController {

    private final CredentialService credentialService;

    public CredentialController(
            CredentialService credentialService) {

        this.credentialService = credentialService;
    }

    @PostMapping
    public ResponseEntity<CredentialResponse> createCredential(
            Authentication authentication,
            @PathVariable Long vaultId,
            @Valid @RequestBody CredentialRequest request) {

        String email = authentication.getName();

        CredentialResponse response =
                credentialService.createCredential(
                        email,
                        vaultId,
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<CredentialResponse>> getCredentials(
            Authentication authentication,
            @PathVariable Long vaultId) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                credentialService.getCredentials(
                        email,
                        vaultId
                )
        );
    }

    @GetMapping("/{credentialId}")
    public ResponseEntity<CredentialResponse> getCredential(
            Authentication authentication,
            @PathVariable Long vaultId,
            @PathVariable Long credentialId) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                credentialService.getCredential(
                        email,
                        vaultId,
                        credentialId
                )
        );
    }

    @PutMapping("/{credentialId}")
    public ResponseEntity<CredentialResponse> updateCredential(
            Authentication authentication,
            @PathVariable Long vaultId,
            @PathVariable Long credentialId,
            @Valid @RequestBody CredentialRequest request) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                credentialService.updateCredential(
                        email,
                        vaultId,
                        credentialId,
                        request
                )
        );
    }

    @DeleteMapping("/{credentialId}")
    public ResponseEntity<Void> deleteCredential(
            Authentication authentication,
            @PathVariable Long vaultId,
            @PathVariable Long credentialId) {

        String email = authentication.getName();

        credentialService.deleteCredential(
                email,
                vaultId,
                credentialId
        );

        return ResponseEntity.noContent().build();
    }

}
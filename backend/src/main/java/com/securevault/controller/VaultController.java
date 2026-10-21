package com.securevault.controller;

import com.securevault.dto.VaultRequest;
import com.securevault.dto.VaultResponse;
import com.securevault.service.VaultService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vaults")
public class VaultController {

    private final VaultService vaultService;

    public VaultController(VaultService vaultService) {
        this.vaultService = vaultService;
    }

    @PostMapping
    public ResponseEntity<VaultResponse> createVault(
            Authentication authentication,
            @Valid @RequestBody VaultRequest request) {

        String email = authentication.getName();

        VaultResponse response =
                vaultService.createVault(email, request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<VaultResponse>> getMyVaults(
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                vaultService.getMyVaults(email)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<VaultResponse> getVault(
            Authentication authentication,
            @PathVariable Long id) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                vaultService.getVault(email, id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<VaultResponse> updateVault(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody VaultRequest request) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                vaultService.updateVault(
                        email,
                        id,
                        request
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVault(
            Authentication authentication,
            @PathVariable Long id) {

        String email = authentication.getName();

        vaultService.deleteVault(email, id);

        return ResponseEntity.noContent().build();
    }
}
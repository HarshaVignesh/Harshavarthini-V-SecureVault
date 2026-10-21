package com.securevault.service;

import com.securevault.dto.VaultRequest;
import com.securevault.dto.VaultResponse;
import com.securevault.entity.User;
import com.securevault.entity.Vault;
import com.securevault.respository.UserRepository;
import com.securevault.respository.VaultRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class VaultService {

    private final VaultRepository vaultRepository;
    private final UserRepository userRepository;

    public VaultService(
            VaultRepository vaultRepository,
            UserRepository userRepository) {

        this.vaultRepository = vaultRepository;
        this.userRepository = userRepository;
    }

    public VaultResponse createVault(
            String email,
            VaultRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Vault vault = new Vault();

        vault.setName(request.getName());
        vault.setUser(user);
        vault.setCreatedAt(LocalDateTime.now());

        Vault savedVault = vaultRepository.save(vault);

        return new VaultResponse(
                savedVault.getId(),
                savedVault.getName(),
                savedVault.getCreatedAt()
        );
    }

    public List<VaultResponse> getMyVaults(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return vaultRepository.findByUser(user)
                .stream()
                .map(vault -> new VaultResponse(
                        vault.getId(),
                        vault.getName(),
                        vault.getCreatedAt()
                ))
                .toList();
    }

    public VaultResponse getVault(
            String email,
            Long vaultId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Vault vault = vaultRepository
                .findByIdAndUser(vaultId, user)
                .orElseThrow(() ->
                        new RuntimeException("Vault not found"));

        return new VaultResponse(
                vault.getId(),
                vault.getName(),
                vault.getCreatedAt()
        );
    }

    public VaultResponse updateVault(
            String email,
            Long vaultId,
            VaultRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Vault vault = vaultRepository
                .findByIdAndUser(vaultId, user)
                .orElseThrow(() ->
                        new RuntimeException("Vault not found"));

        vault.setName(request.getName());

        Vault updatedVault = vaultRepository.save(vault);

        return new VaultResponse(
                updatedVault.getId(),
                updatedVault.getName(),
                updatedVault.getCreatedAt()
        );
    }

    public void deleteVault(
            String email,
            Long vaultId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Vault vault = vaultRepository
                .findByIdAndUser(vaultId, user)
                .orElseThrow(() ->
                        new RuntimeException("Vault not found"));

        vaultRepository.delete(vault);
    }
}
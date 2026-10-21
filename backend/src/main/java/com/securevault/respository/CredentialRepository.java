package com.securevault.respository;

import com.securevault.entity.Credential;
import com.securevault.entity.Vault;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CredentialRepository
        extends JpaRepository<Credential, Long> {

    List<Credential> findByVault(Vault vault);

    List<Credential> findByVaultUserId(Long userId);

    long countByVaultUserId(Long userId);

    long countByVault(Vault vault);

    Optional<Credential> findByIdAndVault(
            Long id,
            Vault vault
    );
}
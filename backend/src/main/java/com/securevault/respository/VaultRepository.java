package com.securevault.respository;

import com.securevault.entity.User;
import com.securevault.entity.Vault;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VaultRepository extends JpaRepository<Vault, Long> {

    List<Vault> findByUser(User user);

    long countByUserId(Long userId);

    Optional<Vault> findByIdAndUser(Long id, User user);
}
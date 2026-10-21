package com.securevault.respository;

import com.securevault.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    List<Team> findByOwnerId(Long ownerId);
    Optional<Team> findById(Long teamId);
    Optional<Team> findByVaultId(Long vaultId);
}

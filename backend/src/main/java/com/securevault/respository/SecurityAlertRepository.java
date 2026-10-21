package com.securevault.respository;

import com.securevault.entity.SecurityAlert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SecurityAlertRepository extends JpaRepository<SecurityAlert, Long> {

    boolean existsByUserIdAndTypeAndResolvedFalse(Long userId, String type);

    long countByUserIdAndResolvedFalse(Long userId);

    long countByUserIdAndResolvedTrue(Long userId);

    List<SecurityAlert> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<SecurityAlert> findByIdAndUserId(Long id, Long userId);
}

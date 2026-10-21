package com.securevault.respository;

import com.securevault.entity.AuditLog;
import com.securevault.entity.AuditLogAction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    Page<AuditLog> findByUserId(Long userId, Pageable pageable);

    List<AuditLog> findByUserIdOrderByTimestampDesc(Long userId);

    Page<AuditLog> findByAction(AuditLogAction action, Pageable pageable);

    long countByUserIdAndAction(Long userId, AuditLogAction action);

    Page<AuditLog> findByTimestampBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);

    Page<AuditLog> findByUserIdAndTimestampBetween(Long userId, LocalDateTime start, LocalDateTime end, Pageable pageable);

    long countByUserIdAndActionAndTimestampAfter(Long userId, AuditLogAction action, LocalDateTime timestamp);

    boolean existsByUserIdAndActionAndTimestampAfter(Long userId, AuditLogAction action, LocalDateTime timestamp);
}

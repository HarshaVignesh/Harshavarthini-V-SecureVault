package com.securevault.service;

import com.securevault.dto.SecurityAlertResponse;
import com.securevault.entity.SecurityAlert;
import com.securevault.respository.SecurityAlertRepository;
import com.securevault.respository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SecurityAlertService {

    private final SecurityAlertRepository securityAlertRepository;
    private final UserRepository userRepository;

    public SecurityAlertService(SecurityAlertRepository securityAlertRepository,
                                UserRepository userRepository) {
        this.securityAlertRepository = securityAlertRepository;
        this.userRepository = userRepository;
    }

    public void createHighSeverityAlertIfUnresolved(String userEmail, String type,
                                                    String description) {
        userRepository.findByEmail(userEmail).ifPresent(user -> {
            if (!securityAlertRepository.existsByUserIdAndTypeAndResolvedFalse(user.getId(), type)) {
                securityAlertRepository.save(new SecurityAlert(user, type, "HIGH", description));
            }
        });
    }

    public List<SecurityAlertResponse> getMyAlerts(String userEmail) {
        Long userId = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

        return securityAlertRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public SecurityAlertResponse resolveMyAlert(String userEmail, Long alertId) {
        Long userId = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

        SecurityAlert alert = securityAlertRepository.findByIdAndUserId(alertId, userId)
                .orElseThrow(() -> new RuntimeException("Security alert not found"));

        alert.setResolved(true);
        return toResponse(securityAlertRepository.save(alert));
    }

    private SecurityAlertResponse toResponse(SecurityAlert alert) {
        return new SecurityAlertResponse(
                alert.getId(),
                alert.getType(),
                alert.getSeverity(),
                alert.getDescription(),
                alert.getCreatedAt(),
                alert.isResolved() ? "RESOLVED" : "ACTIVE"
        );
    }
}

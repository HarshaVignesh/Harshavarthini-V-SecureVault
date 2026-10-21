package com.securevault.service;

import com.securevault.dto.AnalyticsActivityResponse;
import com.securevault.dto.AnalyticsResponse;
import com.securevault.entity.AuditLog;
import com.securevault.entity.AuditLogAction;
import com.securevault.entity.Credential;
import com.securevault.entity.User;
import com.securevault.respository.AuditLogRepository;
import com.securevault.respository.CredentialRepository;
import com.securevault.respository.SecurityAlertRepository;
import com.securevault.respository.UserRepository;
import com.securevault.respository.VaultRepository;
import com.securevault.util.EncryptionUtil;
import com.securevault.util.PasswordStrengthUtil;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnalyticsService {

    private static final int RECENT_ACTIVITY_LIMIT = 10;

    private final UserRepository userRepository;
    private final VaultRepository vaultRepository;
    private final CredentialRepository credentialRepository;
    private final SecurityAlertRepository securityAlertRepository;
    private final AuditLogRepository auditLogRepository;

    public AnalyticsService(UserRepository userRepository,
                            VaultRepository vaultRepository,
                            CredentialRepository credentialRepository,
                            SecurityAlertRepository securityAlertRepository,
                            AuditLogRepository auditLogRepository) {
        this.userRepository = userRepository;
        this.vaultRepository = vaultRepository;
        this.credentialRepository = credentialRepository;
        this.securityAlertRepository = securityAlertRepository;
        this.auditLogRepository = auditLogRepository;
    }

    public AnalyticsResponse getMyAnalytics(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long userId = user.getId();
        List<Credential> credentials = credentialRepository.findByVaultUserId(userId);
        List<AuditLog> recentLogs = auditLogRepository.findByUserIdOrderByTimestampDesc(userId);

        long strongPasswords = 0;
        long mediumPasswords = 0;
        long weakPasswords = 0;

        for (Credential credential : credentials) {
            String plainTextPassword = EncryptionUtil.decrypt(credential.getPassword());
            String strength = PasswordStrengthUtil.checkStrength(plainTextPassword).getStrength();

            if ("STRONG".equalsIgnoreCase(strength)) {
                strongPasswords++;
            } else if ("MEDIUM".equalsIgnoreCase(strength)) {
                mediumPasswords++;
            } else {
                weakPasswords++;
            }
        }

        long totalCredentials = credentialRepository.countByVaultUserId(userId);
        long totalVaults = vaultRepository.countByUserId(userId);
        long activeAlerts = securityAlertRepository.countByUserIdAndResolvedFalse(userId);
        long resolvedAlerts = securityAlertRepository.countByUserIdAndResolvedTrue(userId);
        long successfulLogins = auditLogRepository.countByUserIdAndAction(userId, AuditLogAction.LOGIN_SUCCESS);
        long failedLogins = auditLogRepository.countByUserIdAndAction(userId, AuditLogAction.LOGIN_FAILED);

        int passwordHealthScore = calculatePasswordHealthScore(
                strongPasswords,
                mediumPasswords,
                weakPasswords
        );

        List<AnalyticsActivityResponse> recentActivity = recentLogs.stream()
                .limit(RECENT_ACTIVITY_LIMIT)
                .map(this::toRecentActivityResponse)
                .toList();

        return new AnalyticsResponse(
                totalCredentials,
                totalVaults,
                activeAlerts,
                resolvedAlerts,
                passwordHealthScore,
                strongPasswords,
                mediumPasswords,
                weakPasswords,
                successfulLogins,
                failedLogins,
                recentActivity
        );
    }

    /**
     * Health score formula:
     * score = round(((strong * 100) + (medium * 50) + (weak * 0)) / totalPasswords)
     *
     * This keeps the result in a 0-100 range, rewards strong passwords most,
     * gives medium passwords partial credit, and assigns no credit to weak passwords.
     */
    int calculatePasswordHealthScore(long strongPasswords, long mediumPasswords, long weakPasswords) {
        long totalPasswords = strongPasswords + mediumPasswords + weakPasswords;
        if (totalPasswords == 0) {
            return 0;
        }

        double weightedScore = (strongPasswords * 100.0) + (mediumPasswords * 50.0);
        return (int) Math.round(weightedScore / totalPasswords);
    }

    private AnalyticsActivityResponse toRecentActivityResponse(AuditLog auditLog) {
        return new AnalyticsActivityResponse(
                auditLog.getAction().name(),
                auditLog.getStatus(),
                auditLog.getDescription(),
                auditLog.getTimestamp()
        );
    }
}



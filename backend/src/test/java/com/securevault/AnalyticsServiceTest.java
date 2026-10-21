package com.securevault;

import com.securevault.dto.AnalyticsResponse;
import com.securevault.entity.AuditLog;
import com.securevault.entity.AuditLogAction;
import com.securevault.entity.Credential;
import com.securevault.entity.User;
import com.securevault.entity.Vault;
import com.securevault.respository.AuditLogRepository;
import com.securevault.respository.CredentialRepository;
import com.securevault.respository.SecurityAlertRepository;
import com.securevault.respository.UserRepository;
import com.securevault.respository.VaultRepository;
import com.securevault.service.AnalyticsService;
import com.securevault.util.EncryptionUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AnalyticsServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private VaultRepository vaultRepository;

    @Mock
    private CredentialRepository credentialRepository;

    @Mock
    private SecurityAlertRepository securityAlertRepository;

    @Mock
    private AuditLogRepository auditLogRepository;

    @Test
    void returnsAuthenticatedUsersAnalytics() {
        User user = user(1L, "user@example.com");
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(credentialRepository.findByVaultUserId(1L)).thenReturn(List.of(
                credential(user, "StrongPass1!"),
                credential(user, "Password123"),
                credential(user, "weak")
        ));
        when(credentialRepository.countByVaultUserId(1L)).thenReturn(3L);
        when(vaultRepository.countByUserId(1L)).thenReturn(2L);
        when(securityAlertRepository.countByUserIdAndResolvedFalse(1L)).thenReturn(4L);
        when(securityAlertRepository.countByUserIdAndResolvedTrue(1L)).thenReturn(1L);
        when(auditLogRepository.countByUserIdAndAction(1L, AuditLogAction.LOGIN_SUCCESS)).thenReturn(7L);
        when(auditLogRepository.countByUserIdAndAction(1L, AuditLogAction.LOGIN_FAILED)).thenReturn(2L);
        when(auditLogRepository.findByUserIdOrderByTimestampDesc(1L)).thenReturn(recentLogs(user));

        AnalyticsResponse response = service().getMyAnalytics(user.getEmail());

        assertEquals(3L, response.getTotalCredentials());
        assertEquals(2L, response.getTotalVaults());
        assertEquals(4L, response.getActiveAlerts());
        assertEquals(1L, response.getResolvedAlerts());
        assertEquals(50, response.getPasswordHealthScore());
        assertEquals(1L, response.getStrongPasswords());
        assertEquals(1L, response.getMediumPasswords());
        assertEquals(1L, response.getWeakPasswords());
        assertEquals(7L, response.getSuccessfulLogins());
        assertEquals(2L, response.getFailedLogins());
        assertEquals(10, response.getRecentActivity().size());
        assertEquals("LOGIN_SUCCESS", response.getRecentActivity().get(0).getAction());
        assertEquals("SUCCESS", response.getRecentActivity().get(0).getStatus());
        assertEquals("Activity 0", response.getRecentActivity().get(0).getDescription());
        assertNotNull(response.getRecentActivity().get(0).getTimestamp());
        verify(credentialRepository).findByVaultUserId(1L);
        verify(vaultRepository).countByUserId(1L);
        verify(securityAlertRepository).countByUserIdAndResolvedFalse(1L);
        verify(securityAlertRepository).countByUserIdAndResolvedTrue(1L);
        verify(auditLogRepository).countByUserIdAndAction(1L, AuditLogAction.LOGIN_SUCCESS);
        verify(auditLogRepository).countByUserIdAndAction(1L, AuditLogAction.LOGIN_FAILED);
    }

    @Test
    void countsOwnedCredentialsAndVaultsOnly() {
        User user = user(1L, "owner@example.com");
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(credentialRepository.findByVaultUserId(1L)).thenReturn(List.of(credential(user, "StrongPass1!")));
        when(credentialRepository.countByVaultUserId(1L)).thenReturn(1L);
        when(vaultRepository.countByUserId(1L)).thenReturn(1L);
        when(securityAlertRepository.countByUserIdAndResolvedFalse(1L)).thenReturn(0L);
        when(securityAlertRepository.countByUserIdAndResolvedTrue(1L)).thenReturn(0L);
        when(auditLogRepository.countByUserIdAndAction(1L, AuditLogAction.LOGIN_SUCCESS)).thenReturn(0L);
        when(auditLogRepository.countByUserIdAndAction(1L, AuditLogAction.LOGIN_FAILED)).thenReturn(0L);
        when(auditLogRepository.findByUserIdOrderByTimestampDesc(1L)).thenReturn(List.of());

        AnalyticsResponse response = service().getMyAnalytics(user.getEmail());

        assertEquals(1L, response.getTotalCredentials());
        assertEquals(1L, response.getTotalVaults());
        verify(credentialRepository, never()).countByVaultUserId(2L);
        verify(vaultRepository, never()).countByUserId(2L);
    }

    @Test
    void countsSuccessfulAndFailedLoginsFromAuditLogs() {
        User user = user(1L, "logins@example.com");
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(credentialRepository.findByVaultUserId(1L)).thenReturn(List.of());
        when(credentialRepository.countByVaultUserId(1L)).thenReturn(0L);
        when(vaultRepository.countByUserId(1L)).thenReturn(0L);
        when(securityAlertRepository.countByUserIdAndResolvedFalse(1L)).thenReturn(0L);
        when(securityAlertRepository.countByUserIdAndResolvedTrue(1L)).thenReturn(0L);
        when(auditLogRepository.countByUserIdAndAction(1L, AuditLogAction.LOGIN_SUCCESS)).thenReturn(12L);
        when(auditLogRepository.countByUserIdAndAction(1L, AuditLogAction.LOGIN_FAILED)).thenReturn(3L);
        when(auditLogRepository.findByUserIdOrderByTimestampDesc(1L)).thenReturn(List.of());

        AnalyticsResponse response = service().getMyAnalytics(user.getEmail());

        assertEquals(12L, response.getSuccessfulLogins());
        assertEquals(3L, response.getFailedLogins());
    }

    @Test
    void countsActiveAndResolvedAlerts() {
        User user = user(1L, "alerts@example.com");
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(credentialRepository.findByVaultUserId(1L)).thenReturn(List.of());
        when(credentialRepository.countByVaultUserId(1L)).thenReturn(0L);
        when(vaultRepository.countByUserId(1L)).thenReturn(0L);
        when(securityAlertRepository.countByUserIdAndResolvedFalse(1L)).thenReturn(2L);
        when(securityAlertRepository.countByUserIdAndResolvedTrue(1L)).thenReturn(5L);
        when(auditLogRepository.countByUserIdAndAction(1L, AuditLogAction.LOGIN_SUCCESS)).thenReturn(0L);
        when(auditLogRepository.countByUserIdAndAction(1L, AuditLogAction.LOGIN_FAILED)).thenReturn(0L);
        when(auditLogRepository.findByUserIdOrderByTimestampDesc(1L)).thenReturn(List.of());

        AnalyticsResponse response = service().getMyAnalytics(user.getEmail());

        assertEquals(2L, response.getActiveAlerts());
        assertEquals(5L, response.getResolvedAlerts());
    }

    @Test
    void calculatesPasswordHealthFromActualCredentialPasswords() {
        User user = user(1L, "health@example.com");
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(credentialRepository.findByVaultUserId(1L)).thenReturn(List.of(
                credential(user, "Str0ng!Password"),
                credential(user, "Password123"),
                credential(user, "weak")
        ));
        when(credentialRepository.countByVaultUserId(1L)).thenReturn(3L);
        when(vaultRepository.countByUserId(1L)).thenReturn(0L);
        when(securityAlertRepository.countByUserIdAndResolvedFalse(1L)).thenReturn(0L);
        when(securityAlertRepository.countByUserIdAndResolvedTrue(1L)).thenReturn(0L);
        when(auditLogRepository.countByUserIdAndAction(1L, AuditLogAction.LOGIN_SUCCESS)).thenReturn(0L);
        when(auditLogRepository.countByUserIdAndAction(1L, AuditLogAction.LOGIN_FAILED)).thenReturn(0L);
        when(auditLogRepository.findByUserIdOrderByTimestampDesc(1L)).thenReturn(List.of());

        AnalyticsResponse response = service().getMyAnalytics(user.getEmail());

        assertEquals(1L, response.getStrongPasswords());
        assertEquals(1L, response.getMediumPasswords());
        assertEquals(1L, response.getWeakPasswords());
        assertEquals(50, response.getPasswordHealthScore());
    }

    @Test
    void recentActivityIsNewestFirstAndLimitedToTenSafeEntries() {
        User user = user(1L, "activity@example.com");
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(credentialRepository.findByVaultUserId(1L)).thenReturn(List.of());
        when(credentialRepository.countByVaultUserId(1L)).thenReturn(0L);
        when(vaultRepository.countByUserId(1L)).thenReturn(0L);
        when(securityAlertRepository.countByUserIdAndResolvedFalse(1L)).thenReturn(0L);
        when(securityAlertRepository.countByUserIdAndResolvedTrue(1L)).thenReturn(0L);
        when(auditLogRepository.countByUserIdAndAction(1L, AuditLogAction.LOGIN_SUCCESS)).thenReturn(0L);
        when(auditLogRepository.countByUserIdAndAction(1L, AuditLogAction.LOGIN_FAILED)).thenReturn(0L);
        when(auditLogRepository.findByUserIdOrderByTimestampDesc(1L)).thenReturn(recentLogs(user));

        AnalyticsResponse response = service().getMyAnalytics(user.getEmail());

        assertEquals(10, response.getRecentActivity().size());
        assertEquals("Activity 0", response.getRecentActivity().get(0).getDescription());
        assertEquals("Activity 9", response.getRecentActivity().get(9).getDescription());
        assertEquals("LOGIN_SUCCESS", response.getRecentActivity().get(0).getAction());
    }

    @Test
    void anotherUsersDataCannotAppearInAnalytics() {
        User currentUser = user(1L, "current@example.com");
        when(userRepository.findByEmail(currentUser.getEmail())).thenReturn(Optional.of(currentUser));
        when(credentialRepository.findByVaultUserId(1L)).thenReturn(List.of(credential(currentUser, "StrongPass1!")));
        when(credentialRepository.countByVaultUserId(1L)).thenReturn(1L);
        when(vaultRepository.countByUserId(1L)).thenReturn(1L);
        when(securityAlertRepository.countByUserIdAndResolvedFalse(1L)).thenReturn(0L);
        when(securityAlertRepository.countByUserIdAndResolvedTrue(1L)).thenReturn(0L);
        when(auditLogRepository.countByUserIdAndAction(1L, AuditLogAction.LOGIN_SUCCESS)).thenReturn(1L);
        when(auditLogRepository.countByUserIdAndAction(1L, AuditLogAction.LOGIN_FAILED)).thenReturn(0L);
        when(auditLogRepository.findByUserIdOrderByTimestampDesc(1L))
                .thenReturn(List.of(activity(currentUser, AuditLogAction.LOGIN_SUCCESS, "Current user activity", "SUCCESS")));

        AnalyticsResponse response = service().getMyAnalytics(currentUser.getEmail());

        assertEquals(1L, response.getTotalCredentials());
        assertEquals(1L, response.getTotalVaults());
        assertEquals("Current user activity", response.getRecentActivity().get(0).getDescription());
        verify(credentialRepository, never()).findByVaultUserId(2L);
        verify(vaultRepository, never()).countByUserId(2L);
        verify(securityAlertRepository, never()).countByUserIdAndResolvedFalse(2L);
        verify(securityAlertRepository, never()).countByUserIdAndResolvedTrue(2L);
        verify(auditLogRepository, never()).countByUserIdAndAction(eq(2L), any());
    }

    @Test
    void missingUserIsRejected() {
        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> service().getMyAnalytics("missing@example.com"));
        verifyNoInteractions(vaultRepository, credentialRepository, securityAlertRepository, auditLogRepository);
    }

    private AnalyticsService service() {
        return new AnalyticsService(userRepository, vaultRepository, credentialRepository,
                securityAlertRepository, auditLogRepository);
    }

    private User user(Long id, String email) {
        User user = new User();
        user.setId(id);
        user.setEmail(email);
        user.setFullName("Test User");
        user.setPassword("ignored");
        user.setCreatedAt(LocalDateTime.now());
        return user;
    }

    private Credential credential(User owner, String plainPassword) {
        Vault vault = new Vault();
        vault.setId(100L);
        vault.setName("Main Vault");
        vault.setUser(owner);
        vault.setCreatedAt(LocalDateTime.now());

        Credential credential = new Credential();
        credential.setId(System.nanoTime());
        credential.setTitle("Credential");
        credential.setUsername("user");
        credential.setPassword(EncryptionUtil.encrypt(plainPassword));
        credential.setUrl("https://example.com");
        credential.setNotes("notes");
        credential.setVault(vault);
        credential.setCreatedAt(LocalDateTime.now());
        credential.setUpdatedAt(LocalDateTime.now());
        return credential;
    }

    private AuditLog activity(User user, AuditLogAction action, String description, String status) {
        AuditLog log = new AuditLog(user, action, description, null, status);
        return log;
    }

    private List<AuditLog> recentLogs(User user) {
        LocalDateTime newest = LocalDateTime.of(2026, 10, 5, 12, 0);
        return java.util.stream.IntStream.range(0, 12)
                .mapToObj(index -> {
                    AuditLog log = activity(user,
                            index % 2 == 0 ? AuditLogAction.LOGIN_SUCCESS : AuditLogAction.CREDENTIAL_ACCESSED,
                            "Activity " + index,
                            index % 2 == 0 ? "SUCCESS" : "INFO");
                    log.setTimestamp(newest.minusMinutes(index));
                    return log;
                })
                .toList();
    }
}




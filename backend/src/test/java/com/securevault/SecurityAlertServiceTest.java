package com.securevault;

import com.securevault.dto.SecurityAlertResponse;
import com.securevault.entity.SecurityAlert;
import com.securevault.entity.User;
import com.securevault.respository.SecurityAlertRepository;
import com.securevault.respository.UserRepository;
import com.securevault.service.SecurityAlertService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SecurityAlertServiceTest {

    @Mock
    private SecurityAlertRepository securityAlertRepository;

    @Mock
    private UserRepository userRepository;

    @Test
    void returnsOnlyAuthenticatedUsersAlertsNewestFirst() {
        User user = user(1L, "one@example.com");
        SecurityAlert alert = alert(user, 10L, false);
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(securityAlertRepository.findByUserIdOrderByCreatedAtDesc(1L))
                .thenReturn(List.of(alert));

        List<SecurityAlertResponse> responses = service().getMyAlerts(user.getEmail());

        assertEquals(1, responses.size());
        assertEquals(10L, responses.get(0).getId());
        assertEquals("ACTIVE", responses.get(0).getStatus());
        verify(securityAlertRepository).findByUserIdOrderByCreatedAtDesc(1L);
    }

    @Test
    void cannotResolveAnotherUsersAlert() {
        User owner = user(1L, "owner@example.com");
        when(userRepository.findByEmail("other@example.com"))
                .thenReturn(Optional.of(user(2L, "other@example.com")));
        when(securityAlertRepository.findByIdAndUserId(10L, 2L))
                .thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> service().resolveMyAlert("other@example.com", 10L));
    }

    @Test
    void resolvesOwnAlertAndKeepsItPersisted() {
        User user = user(1L, "one@example.com");
        SecurityAlert alert = alert(user, 10L, false);
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(securityAlertRepository.findByIdAndUserId(10L, 1L))
                .thenReturn(Optional.of(alert));
        when(securityAlertRepository.save(alert)).thenReturn(alert);

        SecurityAlertResponse response = service().resolveMyAlert(user.getEmail(), 10L);

        assertEquals("RESOLVED", response.getStatus());
        verify(securityAlertRepository).save(alert);
    }

    @Test
    void responseContainsSafeAlertFieldsOnly() {
        User user = user(1L, "one@example.com");
        SecurityAlert alert = alert(user, 10L, false);
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(securityAlertRepository.findByUserIdOrderByCreatedAtDesc(1L))
                .thenReturn(List.of(alert));

        SecurityAlertResponse response = service().getMyAlerts(user.getEmail()).get(0);

        assertEquals("MULTIPLE_FAILED_LOGINS", response.getType());
        assertEquals("HIGH", response.getSeverity());
        assertEquals("Multiple failed login attempts detected. Account temporarily locked.",
                response.getMessage());
        assertEquals(6, SecurityAlertResponse.class.getDeclaredFields().length);
    }

    private SecurityAlertService service() {
        return new SecurityAlertService(securityAlertRepository, userRepository);
    }

    private User user(Long id, String email) {
        User user = new User();
        user.setId(id);
        user.setEmail(email);
        user.setFullName("Test User");
        user.setPassword("not-returned");
        user.setCreatedAt(LocalDateTime.now());
        return user;
    }

    private SecurityAlert alert(User user, Long id, boolean resolved) {
        SecurityAlert alert = new SecurityAlert(
                user,
                "MULTIPLE_FAILED_LOGINS",
                "HIGH",
                "Multiple failed login attempts detected. Account temporarily locked.");
        alert.setResolved(resolved);
        try {
            var idField = SecurityAlert.class.getDeclaredField("id");
            idField.setAccessible(true);
            idField.set(alert, id);
        } catch (ReflectiveOperationException exception) {
            throw new AssertionError(exception);
        }
        return alert;
    }
}

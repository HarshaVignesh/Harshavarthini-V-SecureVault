package com.securevault;

import com.securevault.dto.AuthResponse;
import com.securevault.dto.LoginRequest;
import com.securevault.entity.AuditLogAction;
import com.securevault.entity.User;
import com.securevault.respository.UserRepository;
import com.securevault.security.JwtService;
import com.securevault.service.AuditLogService;
import com.securevault.service.AuthService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuditLogService auditLogService;

    @Test
    void rejectsLockedAccountBeforeCheckingPassword() {
        User user = user("secret");
        user.setLockedUntil(LocalDateTime.now().plusMinutes(15));
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        AuthService authService = service();

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> authService.loginUser(login("wrong"), "127.0.0.1"));

        assertEquals("Account temporarily locked due to multiple failed login attempts. Please try again after 5 minutes.",
                exception.getMessage());
        verify(passwordEncoder, never()).matches(anyString(), anyString());
        verify(auditLogService, never()).logAuditEvent(
                anyString(), any(), anyString(), anyString(), anyString());
    }

    @Test
    void locksAccountOnSixthFailureAndCreatesOneLockoutAlert() {
        User user = user("secret");
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "secret")).thenReturn(false);
        when(auditLogService.countRecentFailedLogins(eq("user@example.com"), any()))
                .thenReturn(5L);
        when(auditLogService.hasRecentAuditEvent(
                eq("user@example.com"), eq(AuditLogAction.ACCOUNT_LOCKED), any()))
                .thenReturn(false);
        AuthService authService = service();

        assertThrows(RuntimeException.class,
                () -> authService.loginUser(login("wrong"), "127.0.0.1"));

        assertEquals(6, user.getFailedLoginAttempts());
        assertNotNull(user.getLockedUntil());
        assertTrue(user.getLockedUntil().isAfter(LocalDateTime.now().plusMinutes(4)));
        verify(auditLogService).logAuditEvent(
                "user@example.com", AuditLogAction.LOGIN_FAILED,
                "Invalid email or password", "127.0.0.1", "FAILED");
        verify(auditLogService).logAuditEvent(
                "user@example.com", AuditLogAction.ACCOUNT_LOCKED,
                "Multiple failed login attempts detected. Account temporarily locked.",
                "127.0.0.1", "FAILED");
    }

    @Test
    void doesNotLockWhenOnlyFailuresInsideRollingWindowReachFive() {
        User user = user("secret");
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "secret")).thenReturn(false);
        when(auditLogService.countRecentFailedLogins(eq("user@example.com"), any()))
                .thenReturn(4L);
        AuthService authService = service();

        assertThrows(RuntimeException.class,
                () -> authService.loginUser(login("wrong"), "127.0.0.1"));

        assertEquals(5, user.getFailedLoginAttempts());
        assertNull(user.getLockedUntil());
        verify(auditLogService, never()).hasRecentAuditEvent(
                anyString(), eq(AuditLogAction.ACCOUNT_LOCKED), any());
    }

    @Test
    void failuresOutsideRollingWindowDoNotContributeToLockout() {
        User user = user("secret");
        user.setFailedLoginAttempts(5);
        user.setLastFailedLoginAt(LocalDateTime.now().minusMinutes(11));
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "secret")).thenReturn(false);
        when(auditLogService.countRecentFailedLogins(eq("user@example.com"), any()))
                .thenReturn(0L);
        AuthService authService = service();

        assertThrows(RuntimeException.class,
                () -> authService.loginUser(login("wrong"), "127.0.0.1"));

        assertEquals(1, user.getFailedLoginAttempts());
        assertNull(user.getLockedUntil());
    }

    @Test
    void successfulLoginResetsFailuresAndLockState() {
        User user = user("secret");
        user.setFailedLoginAttempts(5);
        user.setLockedUntil(LocalDateTime.now().minusMinutes(1));
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("secret", "secret")).thenReturn(true);
        when(jwtService.generateToken("user@example.com")).thenReturn("token");
        AuthService authService = service();

        AuthResponse response = authService.loginUser(login("secret"), "127.0.0.1");

        assertEquals("token", response.getToken());
        assertEquals(0, user.getFailedLoginAttempts());
        assertNull(user.getLockedUntil());
        verify(auditLogService).logAuditEvent(
                "user@example.com", AuditLogAction.LOGIN_SUCCESS,
                "User login successful", "127.0.0.1", "SUCCESS");
    }

    @Test
    void unknownAndIncorrectCredentialsUseTheSameSafeMessage() {
        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());
        AuthService authService = service();

        RuntimeException unknown = assertThrows(RuntimeException.class,
                () -> authService.loginUser(loginFor("missing@example.com", "wrong")));

        User user = user("secret");
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "secret")).thenReturn(false);
        when(auditLogService.countRecentFailedLogins(eq("user@example.com"), any()))
                .thenReturn(0L);
        RuntimeException incorrect = assertThrows(RuntimeException.class,
                () -> authService.loginUser(login("wrong")));

        assertEquals(unknown.getMessage(), incorrect.getMessage());
        assertEquals("Invalid username or password.", unknown.getMessage());
    }

    private AuthService service() {
        return new AuthService(userRepository, passwordEncoder, jwtService, auditLogService);
    }

    private User user(String password) {
        User user = new User();
        user.setId(1L);
        user.setFullName("Test User");
        user.setEmail("user@example.com");
        user.setPassword(password);
        user.setCreatedAt(LocalDateTime.now());
        return user;
    }

    private LoginRequest login(String password) {
        return loginFor("user@example.com", password);
    }

    private LoginRequest loginFor(String email, String password) {
        LoginRequest request = new LoginRequest();
        request.setEmail(email);
        request.setPassword(password);
        return request;
    }
}

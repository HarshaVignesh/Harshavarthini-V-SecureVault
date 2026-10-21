package com.securevault.service;

import com.securevault.dto.AuthResponse;
import com.securevault.dto.LoginRequest;
import com.securevault.dto.RegisterRequest;
import com.securevault.entity.AuditLogAction;
import com.securevault.entity.User;
import com.securevault.exception.AccountLockedException;
import com.securevault.respository.UserRepository;
import com.securevault.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private static final int MAX_FAILED_LOGINS = 5;
    private static final int FAILED_LOGIN_WINDOW_MINUTES = 10;
    private static final int LOCKOUT_MINUTES = 5;
    private static final String INVALID_LOGIN_MESSAGE = "Invalid username or password.";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuditLogService auditLogService;
    private final SecurityAlertService securityAlertService;

    @Autowired
    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuditLogService auditLogService,
                       SecurityAlertService securityAlertService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.auditLogService = auditLogService;
        this.securityAlertService = securityAlertService;
    }

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuditLogService auditLogService) {
        this(userRepository, passwordEncoder, jwtService, auditLogService, null);
    }

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this(userRepository, passwordEncoder, jwtService, null);
    }

    // =========================
    // REGISTER
    // =========================

    public User registerUser(RegisterRequest request) {

        // Check whether email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Hash password using BCrypt
        String hashedPassword =
                passwordEncoder.encode(request.getPassword());

        // Create user
        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(hashedPassword);
        user.setCreatedAt(LocalDateTime.now());
        user.setFailedLoginAttempts(0);
        user.setLastFailedLoginAt(null);
        user.setFailedLoginResetAt(null);
        user.setLockedUntil(null);

        // Save user to PostgreSQL
        return userRepository.save(user);
    }


    // =========================
    // LOGIN
    // =========================

    public AuthResponse loginUser(LoginRequest request) {
        return loginUser(request, null);
    }

    public AuthResponse loginUser(LoginRequest request, String ipAddress) {

        // Find user by email
        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException(INVALID_LOGIN_MESSAGE));

        LocalDateTime now = LocalDateTime.now();

        // This check deliberately happens before password verification. It
        // prevents a locked account from using password checks as an oracle.
        if (user.isLockedAt(now)) {
            throw new AccountLockedException();
        }

        // Verify password
        boolean passwordMatches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );

        if (!passwordMatches) {
            recordFailedLogin(user, now, ipAddress);
            throw new RuntimeException(INVALID_LOGIN_MESSAGE);
        }

        resetLoginFailures(user, now);

        // Generate JWT token
        String token = jwtService.generateToken(user.getEmail());

        logAuditEvent(user.getEmail(), AuditLogAction.LOGIN_SUCCESS,
                "User login successful", ipAddress, "SUCCESS");

        // Return authentication response
        return new AuthResponse(
                token,
                user.getId(),
                user.getFullName(),
                user.getEmail()
        );
    }

    private void recordFailedLogin(User user, LocalDateTime now, String ipAddress) {
        LocalDateTime windowStart = now.minusMinutes(FAILED_LOGIN_WINDOW_MINUTES);
        if (user.getFailedLoginResetAt() != null
                && user.getFailedLoginResetAt().isAfter(windowStart)) {
            windowStart = user.getFailedLoginResetAt();
        }
        long loggedFailures = auditLogService == null
                ? user.getFailedLoginAttempts()
                : auditLogService.countRecentFailedLogins(user.getEmail(), windowStart);
        long persistedFailures = user.getLastFailedLoginAt() != null
                && !user.getLastFailedLoginAt().isBefore(windowStart)
                ? user.getFailedLoginAttempts()
                : user.getLastFailedLoginAt() == null && loggedFailures == 0
                ? user.getFailedLoginAttempts()
                : 0;
        long recentFailures = Math.max(loggedFailures, persistedFailures);
        int failureCount = Math.toIntExact(Math.min(Integer.MAX_VALUE, recentFailures + 1));

        user.setFailedLoginAttempts(failureCount);
        user.setLastFailedLoginAt(now);
        boolean lockoutStarted = failureCount > MAX_FAILED_LOGINS;
        if (lockoutStarted) {
            user.setLockedUntil(now.plusMinutes(LOCKOUT_MINUTES));
        }
        userRepository.save(user);

        logAuditEvent(user.getEmail(), AuditLogAction.LOGIN_FAILED,
                "Invalid email or password", ipAddress, "FAILED");

        if (lockoutStarted && !hasRecentLockoutAlert(user, now)) {
            logAuditEvent(user.getEmail(), AuditLogAction.ACCOUNT_LOCKED,
                    "Multiple failed login attempts detected. Account temporarily locked.",
                    ipAddress, "FAILED");
            if (securityAlertService != null) {
                securityAlertService.createHighSeverityAlertIfUnresolved(
                        user.getEmail(),
                        "MULTIPLE_FAILED_LOGINS",
                        "Multiple failed login attempts detected. Account temporarily locked.");
            }
        }
    }

    private void resetLoginFailures(User user, LocalDateTime now) {
        user.setFailedLoginAttempts(0);
        user.setLastFailedLoginAt(null);
        user.setFailedLoginResetAt(now);
        user.setLockedUntil(null);
        userRepository.save(user);
    }

    private boolean hasRecentLockoutAlert(User user, LocalDateTime now) {
        if (auditLogService == null) {
            return false;
        }
        return auditLogService.hasRecentAuditEvent(
                user.getEmail(),
                AuditLogAction.ACCOUNT_LOCKED,
                now.minusMinutes(LOCKOUT_MINUTES));
    }

    private void logAuditEvent(String email, AuditLogAction action, String description,
                               String ipAddress, String status) {
        if (auditLogService != null) {
            auditLogService.logAuditEvent(email, action, description, ipAddress, status);
        }
    }
}
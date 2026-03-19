package com.tirth.microservices.auth_service.controller;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tirth.microservices.auth_service.dto.AccountProfileResponse;
import com.tirth.microservices.auth_service.dto.ApiResponse;
import com.tirth.microservices.auth_service.dto.ChangePasswordRequest;
import com.tirth.microservices.auth_service.dto.DeleteAccountRequest;
import com.tirth.microservices.auth_service.dto.ForgotPasswordRequest;
import com.tirth.microservices.auth_service.dto.LoginRequest;
import com.tirth.microservices.auth_service.dto.LoginResponse;
import com.tirth.microservices.auth_service.dto.RegisterRequest;
import com.tirth.microservices.auth_service.dto.ResendVerificationRequest;
import com.tirth.microservices.auth_service.dto.ResetPasswordRequest;
import com.tirth.microservices.auth_service.dto.UpdateAccountRequest;
import com.tirth.microservices.auth_service.entity.User;
import com.tirth.microservices.auth_service.repository.UserRepository;
import com.tirth.microservices.auth_service.util.JwtUtil;

import jakarta.validation.Valid;


@RestController
public class AuthController {

    private static final int RESET_TOKEN_MINUTES = 30;

    private final UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/auth/test")
    public String test() {
        return "Auth service is working";
    }

    @PostMapping("/auth/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername());
        if (user == null) {
            user = userRepository.findByEmail(request.getUsername());
        }

        if (user == null) {
            return new LoginResponse(false, "User not found", null);
        }

        if (Boolean.FALSE.equals(user.getActive())) {
            return new LoginResponse(false, "Account is deactivated. Contact support.", null);
        }

        boolean isVerified = user.getEmailVerified() == null || user.getEmailVerified();
        if (!isVerified) {
            return new LoginResponse(false, "Please verify your email before signing in.", null);
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new LoginResponse(false, "Wrong password", null);
        }

        String selectedRole = request.getRole() != null ? request.getRole().toUpperCase().trim() : "";
        String storedRole = user.getRole() != null ? user.getRole().toUpperCase().trim() : "";

        if (!selectedRole.isEmpty() && !storedRole.equals(selectedRole)) {
            return new LoginResponse(false,
                    "You are registered as " + storedRole + ". Please select the correct role.",
                    null);
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole(), user.getEmail());
        return new LoginResponse(true, user.getRole(), token);
    }

    @PostMapping("/auth/register")
    public ApiResponse register(@Valid @RequestBody RegisterRequest request) {
        if ("ADMIN".equalsIgnoreCase(request.getRole())) {
            return new ApiResponse(false, "Cannot register as admin", null);
        }

        String role = request.getRole() != null ? request.getRole().toUpperCase().trim() : "";
        if (!role.equals("USER") && !role.equals("PROVIDER")) {
            return new ApiResponse(false, "Role must be USER or PROVIDER", null);
        }

        String trimmedUsername = request.getUsername().trim();
        if (!userRepository.findAllByUsername(trimmedUsername).isEmpty()) {
            return new ApiResponse(false, "Username already exists", null);
        }

        String normalizedEmail = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        if (!userRepository.findAllByEmail(normalizedEmail).isEmpty()) {
            return new ApiResponse(false, "Email already in use", null);
        }

        String verificationToken = UUID.randomUUID().toString();

        User user = new User();
        user.setUsername(trimmedUsername);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(normalizedEmail);
        user.setRole(role);
        user.setEmailVerified(false);
        user.setEmailVerificationToken(verificationToken);
        user.setActive(true);

        userRepository.save(user);

        return new ApiResponse(
                true,
                "Registration successful. Verify your email before signing in.",
                Map.of(
                        "verificationToken", verificationToken,
                        "email", normalizedEmail));
    }

    @GetMapping("/auth/verify-email")
    public ApiResponse verifyEmail(@RequestParam("token") String token) {
        User user = userRepository.findByEmailVerificationToken(token);
        if (user == null) {
            return new ApiResponse(false, "Invalid or expired verification token", null);
        }

        user.setEmailVerified(true);
        user.setEmailVerificationToken(null);
        userRepository.save(user);

        return new ApiResponse(true, "Email verified successfully", null);
    }

    @PostMapping("/auth/resend-verification")
    public ApiResponse resendVerification(@Valid @RequestBody ResendVerificationRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail);

        if (user == null) {
            return new ApiResponse(true, "If the email exists, a verification link has been sent", null);
        }

        boolean isVerified = user.getEmailVerified() == null || user.getEmailVerified();
        if (isVerified) {
            return new ApiResponse(true, "Email is already verified", null);
        }

        String verificationToken = UUID.randomUUID().toString();
        user.setEmailVerificationToken(verificationToken);
        userRepository.save(user);

        return new ApiResponse(
                true,
                "Verification token generated",
                Map.of("verificationToken", verificationToken));
    }

    @PostMapping("/auth/forgot-password")
    public ApiResponse forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail);

        if (user == null) {
            return new ApiResponse(true, "If the email exists, reset instructions have been generated", null);
        }

        String resetToken = UUID.randomUUID().toString();
        user.setPasswordResetToken(resetToken);
        user.setPasswordResetTokenExpiry(LocalDateTime.now().plusMinutes(RESET_TOKEN_MINUTES));
        userRepository.save(user);

        return new ApiResponse(
                true,
                "Reset token generated",
                Map.of("resetToken", resetToken));
    }

    @PostMapping("/auth/reset-password")
    public ApiResponse resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        User user = userRepository.findByPasswordResetToken(request.getToken());
        if (user == null) {
            return new ApiResponse(false, "Invalid reset token", null);
        }

        if (user.getPasswordResetTokenExpiry() == null
                || user.getPasswordResetTokenExpiry().isBefore(LocalDateTime.now())) {
            return new ApiResponse(false, "Reset token has expired", null);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpiry(null);
        userRepository.save(user);

        return new ApiResponse(true, "Password reset successful", null);
    }

    @GetMapping("/auth/account")
    public ApiResponse getAccount(@RequestHeader("Authorization") String authorizationHeader) {
        User user = getAuthenticatedUser(authorizationHeader);

        return new ApiResponse(
                true,
                "Account loaded",
                new AccountProfileResponse(
                        user.getUsername(),
                        user.getEmail(),
                        user.getRole(),
                        user.getEmailVerified() == null || user.getEmailVerified(),
                        user.getActive() == null || user.getActive()));
    }

    @PutMapping("/auth/account")
    public ApiResponse updateAccount(
            @RequestHeader("Authorization") String authorizationHeader,
            @Valid @RequestBody UpdateAccountRequest request) {

        User user = getAuthenticatedUser(authorizationHeader);
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmailIgnoreCaseAndIdNot(normalizedEmail, user.getId())) {
            return new ApiResponse(false, "Email already in use", null);
        }

        boolean emailChanged = !normalizedEmail.equalsIgnoreCase(user.getEmail());
        user.setEmail(normalizedEmail);

        if (emailChanged) {
            String verificationToken = UUID.randomUUID().toString();
            user.setEmailVerified(false);
            user.setEmailVerificationToken(verificationToken);
            userRepository.save(user);

            return new ApiResponse(
                    true,
                    "Profile updated. Please verify your new email.",
                    Map.of("verificationToken", verificationToken));
        }

        userRepository.save(user);
        return new ApiResponse(true, "Profile updated", null);
    }

    @PutMapping("/auth/change-password")
    public ApiResponse changePassword(
            @RequestHeader("Authorization") String authorizationHeader,
            @Valid @RequestBody ChangePasswordRequest request) {

        User user = getAuthenticatedUser(authorizationHeader);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            return new ApiResponse(false, "Current password is incorrect", null);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return new ApiResponse(true, "Password changed successfully", null);
    }

    @DeleteMapping("/auth/account")
    public ApiResponse deleteAccount(
            @RequestHeader("Authorization") String authorizationHeader,
            @Valid @RequestBody DeleteAccountRequest request) {

        User user = getAuthenticatedUser(authorizationHeader);

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new ApiResponse(false, "Password is incorrect", null);
        }

        user.setActive(false);
        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpiry(null);
        user.setEmailVerificationToken(null);
        userRepository.save(user);

        return new ApiResponse(true, "Account deactivated successfully", null);
    }

    private User getAuthenticatedUser(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Missing Authorization header");
        }

        String token = authorizationHeader.substring(7);
        if (!jwtUtil.isTokenValid(token)) {
            throw new IllegalArgumentException("Invalid token");
        }

        String username = jwtUtil.extractUsername(token);
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }

        return user;
    }
}

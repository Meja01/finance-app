package org.example.finance.security.application;

import org.example.finance.security.JwtService;
import org.example.finance.security.RefreshToken;
import org.example.finance.security.RefreshTokenService;
import org.example.finance.security.SpringDataRefreshTokenRepository;
import org.example.finance.users.application.LogoutUserService;
import org.example.finance.users.application.RefreshAccessTokenService;
import org.example.finance.users.application.RegisterUserService;
import org.example.finance.users.domain.User;
import org.example.finance.users.infrastructure.SpringDataUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class RefreshTokenIntegrationTest {

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private RefreshAccessTokenService refreshAccessTokenService;

    @Autowired
    private LogoutUserService logoutUserService;

    @Autowired
    private RegisterUserService registerUserService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private SpringDataRefreshTokenRepository springDataRefreshTokenRepository;

    @Autowired
    private SpringDataUserRepository springDataUserRepository;

    @BeforeEach
    void cleanup() {
        springDataRefreshTokenRepository.deleteAll();
        springDataUserRepository.deleteAll();
    }

    @Test
    void createRefreshToken() {
        User user = registerUserService.register(
                "TestUser",
                "testuser@example.com",
                "secret1234"
        );

        RefreshToken refreshToken =
                refreshTokenService.createRefreshToken(user.getId());

        assertNotNull(refreshToken);
        assertNotNull(refreshToken.getId());
        assertNotNull(refreshToken.getToken());

        assertEquals(user.getId(), refreshToken.getUserId());

        assertFalse(refreshToken.isRevoked());

        assertTrue(refreshToken.getExpiresAt().isAfter(LocalDateTime.now()));

        assertTrue(springDataRefreshTokenRepository.findByToken(refreshToken.getToken()).isPresent());
    }

    @Test
    void validRefreshTokenGeneratesAccessToken() {
        User user = registerUserService.register(
                "TestUser",
                "testuser@example.com",
                "secret1234"
        );

        RefreshToken refreshToken =
                refreshTokenService.createRefreshToken(user.getId());

        String accessToken =
                refreshAccessTokenService.refreshAccessToken(
                        refreshToken.getToken()
                );

        assertNotNull(accessToken);
        assertTrue(jwtService.isTokenValid(accessToken));
        assertEquals(user.getId(), jwtService.getUserId(accessToken));
    }

    @Test
    void revokedRefreshTokenCannotGenerateAccessToken() {
        User user = registerUserService.register(
                "TestUser",
                "testuser@example.com",
                "secret1234"
        );

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        logoutUserService.logout(refreshToken.getToken());

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> refreshAccessTokenService.refreshAccessToken(
                        refreshToken.getToken()
                )
        );

        assertEquals("Refresh Token is invalid!", exception.getMessage());
    }

    @Test
    void logoutRevokesRefreshToken() {
        User user = registerUserService.register(
                "TestUser",
                "testuser@example.com",
                "secret1234"
        );

        RefreshToken refreshToken =
                refreshTokenService.createRefreshToken(user.getId());

        assertFalse(refreshToken.isRevoked());

        logoutUserService.logout(
                refreshToken.getToken()
        );

        RefreshToken persisted =
                springDataRefreshTokenRepository
                        .findByToken(refreshToken.getToken())
                        .orElseThrow();

        assertTrue(persisted.isRevoked());
    }

    @Test
    void expiredRefreshTokenCannotGenerateAccessToken() {
        User user = registerUserService.register(
                "TestUser",
                "testuser@example.com",
                "secret1234"
        );

        RefreshToken expiredToken = new RefreshToken(
                user.getId(),
                "expired-test-token",
                LocalDateTime.now().minusDays(1)
        );

        springDataRefreshTokenRepository.save(expiredToken);

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> refreshAccessTokenService.refreshAccessToken(
                        expiredToken.getToken()
                )
        );

        assertEquals("Refresh Token is expired!", exception.getMessage());
    }

    @Test
    void unknownRefreshTokenIsRejected() {
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> refreshAccessTokenService.refreshAccessToken(
                        "this-token-does-not-exist"
                )
        );

        assertEquals("Refresh Token is invalid!", exception.getMessage());
    }
}
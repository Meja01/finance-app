package org.example.finance.security;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.UUID;

@Service
public class RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;
    @Value("${refresh-token.expiration-days}")
    private long refreshTokenExpirationDays;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    public RefreshToken createRefreshToken(UUID userId) {
        String token = generateToken();
        LocalDateTime expiresAt = LocalDateTime.now().plusDays(refreshTokenExpirationDays);
        RefreshToken refreshToken = new RefreshToken(userId, token, expiresAt);
        return refreshTokenRepository.save(refreshToken);
    }

    private String generateToken() {
        byte[] bytes = new byte[32];

        SecureRandom secureRandom = new SecureRandom();
        secureRandom.nextBytes(bytes);

        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}

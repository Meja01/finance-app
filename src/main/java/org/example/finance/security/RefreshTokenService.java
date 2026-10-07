package org.example.finance.security;


import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.UUID;

@Service
public class RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    public RefreshToken createRefreshToken(UUID userId) {
        String token = generateToken();
        LocalDateTime expiresAt = LocalDateTime.now().plusDays(30);
        RefreshToken refreshToken = new RefreshToken(userId, token, expiresAt);
        return refreshTokenRepository.save(refreshToken);
    }

    private String generateToken() {
        byte[] bytes = new byte[32];

        SecureRandom secureRandom = new SecureRandom();
        secureRandom.nextBytes(bytes);

        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    public boolean validateRefreshToken(String refreshTokenToValidate) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(refreshTokenToValidate)
                .orElseThrow(() -> new IllegalArgumentException("Refresh Token is invalid!"));

        if (refreshToken.isRevoked()) {
           throw new IllegalArgumentException("Refresh Token is invalid!");
        }
        if (refreshToken.getExpiresAt().isAfter(LocalDateTime.now())) {
            throw new IllegalArgumentException("Refresh Token is expired!");
        }

        return true;
    }
}

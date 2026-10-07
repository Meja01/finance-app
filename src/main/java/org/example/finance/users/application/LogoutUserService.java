package org.example.finance.users.application;

import org.example.finance.security.RefreshToken;
import org.example.finance.security.RefreshTokenRepository;
import org.springframework.stereotype.Service;

@Service
public class LogoutUserService {
    private final RefreshTokenRepository refreshTokenRepository;

    public LogoutUserService(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    public void logout(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Refresh Token is invalid!"));

        if (!refreshToken.isRevoked()) {
            refreshToken.revoke();
            refreshTokenRepository.save(refreshToken);
        }
    }
}

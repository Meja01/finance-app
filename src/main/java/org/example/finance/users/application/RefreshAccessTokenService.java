package org.example.finance.users.application;

import org.example.finance.security.JwtService;
import org.example.finance.security.RefreshToken;
import org.example.finance.security.RefreshTokenRepository;
import org.example.finance.users.domain.User;
import org.example.finance.users.domain.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class RefreshAccessTokenService {
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public RefreshAccessTokenService(RefreshTokenRepository refreshTokenRepository, UserRepository userRepository, JwtService jwtService) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public String refreshAccessToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Refresh Token is invalid!"));
        if (refreshToken.isRevoked()) {
            throw new IllegalArgumentException("Refresh Token is invalid!");
        }
        if (!refreshToken.getExpiresAt().isAfter(LocalDateTime.now())) {
            throw new IllegalArgumentException("Refresh Token is expired!");
        }

        UUID userId = refreshToken.getUserId();
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found!"));

        return jwtService.generateToken(user);
    }
}
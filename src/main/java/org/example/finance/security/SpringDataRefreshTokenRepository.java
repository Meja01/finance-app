package org.example.finance.security;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface SpringDataRefreshTokenRepository extends JpaRepository <RefreshToken, UUID> {
    Optional<RefreshToken> findByToken(String token);
}

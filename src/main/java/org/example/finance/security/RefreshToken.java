package org.example.finance.security;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {
    @Id
    private UUID id;
    @Column(nullable = false)
    private UUID userId;
    @Column(nullable = false, unique = true)
    private String token;
    @Column(nullable = false)
    private LocalDateTime expiresAt;
    @Column(nullable = false)
    private boolean revoked;
    @Column(nullable = false)
    private LocalDateTime createdAt;

    protected RefreshToken() {
    }

    public RefreshToken(
            UUID userId,
            String token,
            LocalDateTime expiresAt
    ) {
        this.id = UUID.randomUUID();
        this.userId = userId;
        this.token = token;
        this.expiresAt = expiresAt;
        this.revoked = false;
        this.createdAt = LocalDateTime.now();
    }

    public String getToken() {
        return token;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public boolean isRevoked() {
        return revoked;
    }
    public void revoke() {
        this.revoked = true;
    }

    public UUID getUserId() {
        return userId;
    }

    public UUID getId() {return id;}
}

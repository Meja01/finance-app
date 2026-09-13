package org.example.finance.accounts.domain;

import jakarta.persistence.*;
import net.bytebuddy.asm.Advice;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
@Entity
@Table(name = "accounts")
public class Account {
    @Id
    UUID id;
    @Column(nullable = false)
    UUID userId;
    @Column(nullable = false)
    private String name;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountType type;
    @Column(nullable = false)
    private BigDecimal initialBalance;
    @Column(nullable = false)
    private LocalDateTime createdAt;

    protected Account() {

    }

    public Account(UUID userID, String name, AccountType type, BigDecimal initialBalance) {
        this.id = UUID.randomUUID();
        this.userId = userID;
        this.name = name;
        this.type = type;
        this.initialBalance = initialBalance;
        this.createdAt = LocalDateTime.now();
    }
    public UUID getId() {
        return id;
    }

    public UUID getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public AccountType getType() {
        return type;
    }

    public BigDecimal getInitialBalance() {
        return initialBalance;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void update(
            String name,
            AccountType type,
            BigDecimal initialBalance
    ) {
        this.name = name;
        this.type = type;
        this.initialBalance = initialBalance;
    }
}


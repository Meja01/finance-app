package org.example.finance.accounts.infrastructure;

import org.example.finance.accounts.domain.AccountType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record AccountResponse(
        UUID id,
        String name,
        AccountType type,
        BigDecimal initialBalance,
        LocalDateTime createdAt) {
}

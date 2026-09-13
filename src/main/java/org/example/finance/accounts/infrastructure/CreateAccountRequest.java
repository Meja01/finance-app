package org.example.finance.accounts.infrastructure;

import org.example.finance.accounts.domain.AccountType;

import java.math.BigDecimal;
import java.util.UUID;

public record CreateAccountRequest(
        String name,
        AccountType type,
        BigDecimal initialBalance) {
}

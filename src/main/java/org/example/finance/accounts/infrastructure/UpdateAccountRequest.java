package org.example.finance.accounts.infrastructure;

import org.example.finance.accounts.domain.AccountType;

import java.math.BigDecimal;

public record UpdateAccountRequest(
        String name,
        AccountType type,
        BigDecimal initialBalance) {
}

package org.example.finance.accounts.infrastructure;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.example.finance.accounts.domain.AccountType;

import java.math.BigDecimal;
import java.util.UUID;

public record CreateAccountRequest(
        @NotBlank
        @Size(max = 100)
        String name,
        @NotNull
        AccountType type,
        @NotNull
        BigDecimal initialBalance
) {
}

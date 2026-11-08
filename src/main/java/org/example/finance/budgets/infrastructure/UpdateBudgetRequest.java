package org.example.finance.budgets.infrastructure;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record UpdateBudgetRequest(
        @NotNull
        @Positive
        BigDecimal amount
) {
}

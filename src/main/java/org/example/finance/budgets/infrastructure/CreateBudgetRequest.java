package org.example.finance.budgets.infrastructure;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.UUID;

public record CreateBudgetRequest(
        @NotNull
        UUID categoryId,
        @Min(2000)
        int year,
        @Min(1)
        @Max(12)
        int month,
        @NotNull
        @Positive
        BigDecimal amount
) {
}
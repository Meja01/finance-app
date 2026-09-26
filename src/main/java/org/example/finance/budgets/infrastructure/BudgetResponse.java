package org.example.finance.budgets.infrastructure;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record BudgetResponse(
        UUID id,
        UUID categoryId,
        int year,
        int month,
        BigDecimal amount,
        LocalDateTime createdAt
) {
}

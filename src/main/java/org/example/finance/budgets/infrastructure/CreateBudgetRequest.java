package org.example.finance.budgets.infrastructure;

import java.math.BigDecimal;
import java.util.UUID;

public record CreateBudgetRequest(
        UUID categoryId,
        int year,
        int month,
        BigDecimal amount
) {
}

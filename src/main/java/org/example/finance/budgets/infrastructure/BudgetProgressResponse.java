package org.example.finance.budgets.infrastructure;

import java.math.BigDecimal;
import java.util.UUID;

public record BudgetProgressResponse(
        UUID budgetId,
        UUID categoryId,
        String categoryName,
        BigDecimal budgetAmount,
        BigDecimal spentAmount,
        BigDecimal remainingAmount,
        BigDecimal percentageUsed

) {
}

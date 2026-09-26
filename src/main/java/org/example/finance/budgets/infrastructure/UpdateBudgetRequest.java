package org.example.finance.budgets.infrastructure;

import java.math.BigDecimal;

public record UpdateBudgetRequest(
        BigDecimal amount
) {
}

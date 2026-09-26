package org.example.finance.transactions.infrastructure;

import java.math.BigDecimal;

public record MonthlyStatsResponse(
        BigDecimal income,
        BigDecimal expenses,
        BigDecimal balance
) {}

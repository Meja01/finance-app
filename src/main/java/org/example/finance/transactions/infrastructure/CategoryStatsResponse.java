package org.example.finance.transactions.infrastructure;

import java.math.BigDecimal;
import java.util.UUID;

public record CategoryStatsResponse(
        UUID categoryId,
        String categoryName,
        BigDecimal amount
) {
}
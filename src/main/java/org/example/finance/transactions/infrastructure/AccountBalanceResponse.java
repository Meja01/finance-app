package org.example.finance.transactions.infrastructure;

import java.math.BigDecimal;
import java.util.UUID;

public record AccountBalanceResponse(
        UUID accountId,
        String accountName,
        BigDecimal balance
) {}
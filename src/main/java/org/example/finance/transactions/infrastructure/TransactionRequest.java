package org.example.finance.transactions.infrastructure;

import org.example.finance.transactions.domain.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record TransactionRequest (
        UUID accountId,
        UUID categoryId,
        BigDecimal amount,
        LocalDateTime dateTime,
        String note,
        TransactionType type
) {}

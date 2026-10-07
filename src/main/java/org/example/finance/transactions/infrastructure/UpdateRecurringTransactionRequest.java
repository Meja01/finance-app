package org.example.finance.transactions.infrastructure;

import org.example.finance.transactions.domain.RecurringFrequency;
import org.example.finance.transactions.domain.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record UpdateRecurringTransactionRequest(
        UUID accountId,
        UUID categoryId,
        BigDecimal amount,
        String note,
        TransactionType type,
        RecurringFrequency frequency,
        LocalDate endDate
) {
}

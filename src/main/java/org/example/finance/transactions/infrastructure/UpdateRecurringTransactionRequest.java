package org.example.finance.transactions.infrastructure;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import org.example.finance.transactions.domain.RecurringFrequency;
import org.example.finance.transactions.domain.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record UpdateRecurringTransactionRequest(
        @NotNull
        UUID accountId,

        @NotNull
        UUID categoryId,

        @NotNull
        @Positive
        BigDecimal amount,

        @Size(max = 500)
        String note,

        @NotNull
        TransactionType type,

        @NotNull
        RecurringFrequency frequency,

        LocalDate endDate
) {
}

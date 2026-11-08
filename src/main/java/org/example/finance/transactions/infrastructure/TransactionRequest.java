package org.example.finance.transactions.infrastructure;

import org.example.finance.transactions.domain.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record TransactionRequest(
        @NotNull
        UUID accountId,
        @NotNull
        UUID categoryId,
        @NotNull
        @Positive
        BigDecimal amount,
        @NotNull
        LocalDateTime dateTime,
        @Size(max = 500)
        String note,
        @NotNull
        TransactionType type
) {}

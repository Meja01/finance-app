package org.example.finance.transactions.infrastructure;

import org.example.finance.transactions.domain.TransactionType;

import java.util.UUID;

public record CategoryResponse(
        UUID id,
        String name,
        TransactionType type,
        UUID userId
) {
}

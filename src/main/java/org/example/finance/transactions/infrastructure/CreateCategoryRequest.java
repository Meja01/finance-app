package org.example.finance.transactions.infrastructure;

import org.example.finance.transactions.domain.TransactionType;

public record CreateCategoryRequest(
        String name,
        TransactionType type
) {
}

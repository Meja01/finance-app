package org.example.finance.transactions.infrastructure;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.example.finance.transactions.domain.TransactionType;

public record CreateCategoryRequest(
        @NotBlank
        @Size(max = 100)
        String name,
        @NotNull
        TransactionType type
) {
}

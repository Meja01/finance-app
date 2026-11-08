package org.example.finance.transactions.application;

import org.example.finance.accounts.domain.Account;
import org.example.finance.accounts.domain.AccountRepository;
import org.example.finance.common.exception.ForbiddenOperationException;
import org.example.finance.common.exception.ResourceNotFoundException;
import org.example.finance.transactions.domain.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Service
public class CreateRecurringTransactionService {
    private final RecurringTransactionRepository recurringTransactionRepository;
    private final AccountRepository accountRepository;
    private final CategoryRepository categoryRepository;

    public CreateRecurringTransactionService(RecurringTransactionRepository recurringTransactionRepository, AccountRepository accountRepository, CategoryRepository categoryRepository) {
        this.recurringTransactionRepository = recurringTransactionRepository;
        this.accountRepository = accountRepository;
        this.categoryRepository = categoryRepository;
    }

    public RecurringTransaction createRecurringTransaction(
            UUID userId,
            UUID accountId,
            UUID categoryId,
            BigDecimal amount,
            String note,
            TransactionType transactionType,
            RecurringFrequency recurringFrequency,
            LocalDate startDate,
            LocalDate endDate
    ) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Account not found!")
                );

        if (!account.getUserId().equals(userId)) {
            throw new ForbiddenOperationException(
                    "Account does not belong to user!"
            );
        }

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found!")
                );

        if (!category.isGlobal() && !category.getUserId().equals(userId)) {
            throw new ForbiddenOperationException(
                    "Category must either be global or belong to the user!"
            );
        }

        if (category.getType() != transactionType) {
            throw new IllegalArgumentException(
                    "Transaction type and category type must match!"
            );
        }

        if (endDate != null && startDate.isAfter(endDate)) {
            throw new IllegalArgumentException(
                    "End Date must be after or equal to Start Date!"
            );
        }

        RecurringTransaction recurringTransaction =
                new RecurringTransaction(
                        userId,
                        accountId,
                        categoryId,
                        amount,
                        transactionType,
                        note,
                        recurringFrequency,
                        startDate,
                        endDate
                );

        return recurringTransactionRepository.save(recurringTransaction);
    }
}

package org.example.finance.transactions.application;

import org.example.finance.accounts.domain.Account;
import org.example.finance.accounts.domain.AccountRepository;
import org.example.finance.common.exception.ForbiddenOperationException;
import org.example.finance.common.exception.ResourceNotFoundException;
import org.example.finance.transactions.domain.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class CreateTransactionService {
    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final CategoryRepository categoryRepository;

    public CreateTransactionService(TransactionRepository transactionRepository, AccountRepository accountRepository, CategoryRepository categoryRepository) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
        this.categoryRepository = categoryRepository;
    }

    public Transaction createTransaction(
            UUID userId,
            UUID accountId,
            UUID categoryId,
            BigDecimal amount,
            LocalDateTime dateTime,
            String note,
            TransactionType transactionType
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

        Transaction transaction = new Transaction(
                userId,
                accountId,
                categoryId,
                amount,
                dateTime,
                note,
                transactionType
        );
        return transactionRepository.save(transaction);
    }
}

package org.example.finance.transactions.application;

import org.example.finance.accounts.domain.Account;
import org.example.finance.accounts.domain.AccountRepository;
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

    public Transaction createTransaction(UUID userId,
                                         UUID accountId,
                                         UUID categoryId,
                                         BigDecimal amount,
                                         LocalDateTime dateTime,
                                         String note,
                                         TransactionType transactionType) {
        if (accountId == null) {
            throw new IllegalArgumentException("Account must not be null!");
        }
        if (categoryId == null) {
            throw new IllegalArgumentException("Category Id must not be null!");
        }
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                    "Amount must be greater than zero!"
            );
        }
        if (transactionType == null) {
            throw new IllegalArgumentException("Transaction Type must not be null!");
        }

        Account account = accountRepository.findById(accountId).orElseThrow(() ->
                new IllegalArgumentException("Account not found!"));

        if (!account.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Account does not belong to user!");
        }

        Category category = categoryRepository.findById(categoryId).orElseThrow(() ->
                        new IllegalArgumentException("Category not found!"));

        if (!category.isGlobal() && !category.getUserId().equals(userId)) {
            throw new IllegalArgumentException(
                    "Category must either be global or belong to the user!"
            );
        }

        if (category.getType() != transactionType) {
            throw new IllegalArgumentException(
                    "Transaction type and category type must match!"
            );
        }

        Transaction transaction = new Transaction(userId, accountId, categoryId, amount, dateTime, note, transactionType);
        return transactionRepository.save(transaction);
    }
}

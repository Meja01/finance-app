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
public class UpdateTransactionService {
    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final AccountRepository accountRepository;

    public UpdateTransactionService(TransactionRepository transactionRepository, CategoryRepository categoryRepository, AccountRepository accountRepository) {
        this.transactionRepository = transactionRepository;
        this.categoryRepository = categoryRepository;
        this.accountRepository = accountRepository;
    }

    public Transaction updateTransaction(
            UUID transactionId,
            UUID userId,
            UUID accountId,
            UUID categoryId,
            BigDecimal amount,
            LocalDateTime dateTime,
            String note,
            TransactionType transactionType
    ) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found!"));

        if (!transaction.getUserId().equals(userId)) {
            throw new ForbiddenOperationException("Transaction does not belong to user!");
        }

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found!"));

        if (!account.getUserId().equals(userId)) {
            throw new ForbiddenOperationException("Account does not belong to user!");
        }

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found!"));

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
        transaction.update(amount, accountId, dateTime, note, transactionType, categoryId);

        return transactionRepository.save(transaction);
    }
}

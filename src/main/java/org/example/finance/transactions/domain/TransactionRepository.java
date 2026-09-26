package org.example.finance.transactions.domain;

import org.example.finance.accounts.domain.Account;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TransactionRepository {
    Transaction save(Transaction transaction);
    List<Transaction> findByUserId(UUID userId);
    List<Transaction> findByCategoryId(UUID categoryId);
    Optional<Transaction> findById(UUID id);
    void delete(Transaction transaction);
    List<Transaction> findByUserIdAndAccountId(UUID userId, UUID accountId);
    List<Transaction> findByUserIdAndCategoryId(UUID userId, UUID categoryId);
    List<Transaction> findByUserIdAndTransactionType(UUID userId, TransactionType type);
    List<Transaction> findByUserIdAndDateTimeBetween(UUID userId, LocalDateTime from, LocalDateTime to);
}

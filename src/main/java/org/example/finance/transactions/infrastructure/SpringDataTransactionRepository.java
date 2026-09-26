package org.example.finance.transactions.infrastructure;

import org.example.finance.transactions.domain.Transaction;
import org.example.finance.transactions.domain.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface SpringDataTransactionRepository extends JpaRepository <Transaction, UUID> {
    List<Transaction> findByUserId(UUID userId);
    List<Transaction> findByCategoryId(UUID categoryId);
    List<Transaction> findByUserIdAndAccountId(UUID userId, UUID accountId);
    List<Transaction> findByUserIdAndCategoryId(UUID userId, UUID categoryId);
    List<Transaction> findByUserIdAndTransactionType(UUID userId, TransactionType type);
    List<Transaction> findByUserIdAndDateTimeBetween(UUID userId, LocalDateTime from, LocalDateTime to);
}

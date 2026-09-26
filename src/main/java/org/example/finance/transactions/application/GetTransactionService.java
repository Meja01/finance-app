package org.example.finance.transactions.application;

import org.example.finance.transactions.domain.Transaction;
import org.example.finance.transactions.domain.TransactionRepository;
import org.example.finance.transactions.domain.TransactionType;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class GetTransactionService {
    private final TransactionRepository transactionRepository;

    public GetTransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public List<Transaction> getTransactions(UUID userId) {
        return new ArrayList<>(transactionRepository.findByUserId(userId));
    }
    public Transaction getTransaction(UUID userId, UUID transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId).orElseThrow(() ->
                new IllegalArgumentException("Transaction not found!")
        );
        if (!transaction.getUserId().equals(userId)) {
            throw new IllegalArgumentException(
                    "Transaction does not belong to user!"
            );
        }
        return transaction;
    }
    public List<Transaction> getTransactionsByAccount(UUID userId, UUID accountId) {
        return transactionRepository.findByUserIdAndAccountId(userId, accountId);
    }

    public List<Transaction> getTransactionsByCategory(UUID userId, UUID categoryId) {
        return transactionRepository.findByUserIdAndCategoryId(userId, categoryId);
    }

    public List<Transaction> getTransactionsByTransactionType(UUID userId, TransactionType type) {
        return transactionRepository.findByUserIdAndTransactionType(userId, type);
    }
    public List<Transaction> getTransactionsByDateTimeBetween(UUID userId, LocalDateTime from, LocalDateTime to) {
        return transactionRepository.findByUserIdAndDateTimeBetween(userId, from, to);
    }

}

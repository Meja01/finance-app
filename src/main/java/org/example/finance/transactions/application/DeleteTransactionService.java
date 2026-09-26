package org.example.finance.transactions.application;

import org.example.finance.transactions.domain.Transaction;
import org.example.finance.transactions.domain.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class DeleteTransactionService {
    private final TransactionRepository transactionRepository;

    public DeleteTransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public void deleteTransaction(UUID transactionId, UUID userId) {
        Transaction transaction = transactionRepository.findById(transactionId).orElseThrow(() -> new IllegalArgumentException("Transaction not found!"));
        if (!transaction.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Transaction does not belong to user!");
        }
        transactionRepository.delete(transaction);
    }
}

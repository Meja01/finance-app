package org.example.finance.transactions.application;

import org.example.finance.transactions.domain.RecurringTransaction;
import org.example.finance.transactions.domain.RecurringTransactionRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class DeactivateRecurringTransactionService {
    private final RecurringTransactionRepository recurringTransactionRepository;

    public DeactivateRecurringTransactionService(RecurringTransactionRepository recurringTransactionRepository) {
        this.recurringTransactionRepository = recurringTransactionRepository;
    }

    public void deactivateRecurringTransaction(UUID recurringTransactionId, UUID userId) {
        RecurringTransaction recurringTransaction = recurringTransactionRepository.findById(recurringTransactionId).orElseThrow(() -> new IllegalArgumentException("Recurring Transaction not found!"));
        if (!recurringTransaction.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Recurring Transaction does not belong to user!");
        }
        recurringTransaction.deactivate();
        recurringTransactionRepository.save(recurringTransaction);
    }
}

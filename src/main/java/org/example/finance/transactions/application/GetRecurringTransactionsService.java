package org.example.finance.transactions.application;

import org.example.finance.transactions.domain.RecurringTransaction;
import org.example.finance.transactions.domain.RecurringTransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class GetRecurringTransactionsService {

    private final RecurringTransactionRepository recurringTransactionRepository;

    public GetRecurringTransactionsService(RecurringTransactionRepository recurringTransactionRepository) {
        this.recurringTransactionRepository = recurringTransactionRepository;
    }

    public List<RecurringTransaction> getRecurringTransactions(UUID userId) {
        return recurringTransactionRepository.findByUserId(userId);
    }
}

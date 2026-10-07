package org.example.finance.transactions.application;

import jakarta.transaction.Transactional;
import org.example.finance.transactions.domain.RecurringTransaction;
import org.example.finance.transactions.domain.RecurringTransactionRepository;
import org.example.finance.transactions.domain.Transaction;
import org.example.finance.transactions.domain.TransactionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class GenerateRecurringTransactionsService {
    private final RecurringTransactionRepository recurringTransactionRepository;
    private final TransactionRepository transactionRepository;

    public GenerateRecurringTransactionsService(RecurringTransactionRepository recurringTransactionRepository, TransactionRepository transactionRepository) {
        this.recurringTransactionRepository = recurringTransactionRepository;
        this.transactionRepository = transactionRepository;
    }


    public void generateDueTransactions(LocalDate today) {
        List<RecurringTransaction> dueTransactions = recurringTransactionRepository.findByActiveTrueAndNextExecutionDateLessThanEqual(today);

        for (RecurringTransaction recurring : dueTransactions) {
            while (recurring.isActive() && !recurring.getNextExecutionDate().isAfter(today)) {

                if (recurring.getEndDate() != null && recurring.getNextExecutionDate().isAfter(recurring.getEndDate())) {
                    recurring.deactivate();
                    break;
                }

                Transaction transaction = new Transaction(
                        recurring.getUserId(),
                        recurring.getAccountId(),
                        recurring.getCategoryId(),
                        recurring.getAmount(),
                        recurring.getNextExecutionDate().atStartOfDay(),
                        recurring.getNote(),
                        recurring.getType()
                );

                transactionRepository.save(transaction);

                recurring.moveToNextExecutionDate();

                if (recurring.getEndDate() != null && recurring.getNextExecutionDate().isAfter(recurring.getEndDate())) {
                    recurring.deactivate();
                }
            }
            recurringTransactionRepository.save(recurring);
        }
    }
}

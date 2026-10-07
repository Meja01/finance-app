package org.example.finance.transactions.infrastructure;

import org.example.finance.transactions.application.GenerateRecurringTransactionsService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class RecurringTransactionScheduler {

    private final GenerateRecurringTransactionsService generateService;

    public RecurringTransactionScheduler(GenerateRecurringTransactionsService generateService) {
        this.generateService = generateService;
    }

    @Scheduled(cron = "0 0 0 * * *")
    public void generateRecurringTransactions() {
        generateService.generateDueTransactions(LocalDate.now());
    }
}
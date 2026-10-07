package org.example.finance.transactions.domain;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RecurringTransactionRepository {
    Optional<RecurringTransaction> findById(UUID id);
    RecurringTransaction save(RecurringTransaction recurringTransaction);
    List<RecurringTransaction> findByUserId(UUID userId);
    void delete(RecurringTransaction recurringTransaction);
    List<RecurringTransaction> findByActiveTrueAndNextExecutionDateLessThanEqual(LocalDate date);
}

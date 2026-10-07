package org.example.finance.transactions.infrastructure;

import org.example.finance.transactions.domain.RecurringTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface SpringDataRecurringTransactionRepository extends JpaRepository <RecurringTransaction, UUID> {
    List<RecurringTransaction> findByUserId(UUID userId);
    List<RecurringTransaction> findByActiveTrueAndNextExecutionDateLessThanEqual(LocalDate date);
}

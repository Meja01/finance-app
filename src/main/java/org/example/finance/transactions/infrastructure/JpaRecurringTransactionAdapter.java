package org.example.finance.transactions.infrastructure;

import org.example.finance.transactions.domain.RecurringTransaction;
import org.example.finance.transactions.domain.RecurringTransactionRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class JpaRecurringTransactionAdapter implements RecurringTransactionRepository {

    final private SpringDataRecurringTransactionRepository repository;

    public JpaRecurringTransactionAdapter(SpringDataRecurringTransactionRepository repository) {
        this.repository = repository;
    }

    @Override
    public Optional<RecurringTransaction> findById(UUID id) {
        return repository.findById(id);
    }

    @Override
    public RecurringTransaction save(RecurringTransaction recurringTransaction) {
        return repository.save(recurringTransaction);
    }
    @Override
    public List<RecurringTransaction> findByUserId(UUID userId) {
        return  repository.findByUserId(userId);
    }

    @Override
    public void delete(RecurringTransaction recurringTransaction) {
        repository.delete(recurringTransaction);
    }

    @Override
    public List<RecurringTransaction> findByActiveTrueAndNextExecutionDateLessThanEqual(LocalDate date) {
        return repository.findByActiveTrueAndNextExecutionDateLessThanEqual(date);
    }
}

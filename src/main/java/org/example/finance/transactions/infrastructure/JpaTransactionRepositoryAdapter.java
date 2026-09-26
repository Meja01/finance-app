package org.example.finance.transactions.infrastructure;

import org.example.finance.transactions.domain.Category;
import org.example.finance.transactions.domain.Transaction;
import org.example.finance.transactions.domain.TransactionRepository;
import org.example.finance.transactions.domain.TransactionType;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class JpaTransactionRepositoryAdapter implements TransactionRepository {
    private final SpringDataTransactionRepository repository;

    public JpaTransactionRepositoryAdapter(SpringDataTransactionRepository repository) {
        this.repository = repository;
    }

    @Override
    public Transaction save(Transaction transaction) {
        return repository.save(transaction);
    }

    @Override
    public List<Transaction> findByUserId(UUID userId) {
        return repository.findByUserId(userId);
    }

    @Override
    public Optional<Transaction> findById(UUID id) {
        return repository.findById(id);
    }

    @Override
    public void delete(Transaction transaction) {
        repository.delete(transaction);
    }

    @Override
    public List<Transaction> findByCategoryId(UUID categoryId) {
        return repository.findByCategoryId(categoryId);
    }

    @Override
    public List<Transaction> findByUserIdAndAccountId(UUID userId, UUID accountId) {
        return repository.findByUserIdAndAccountId(userId, accountId);
    }

    @Override
    public List<Transaction> findByUserIdAndCategoryId(UUID userId, UUID categoryId) {
        return repository.findByUserIdAndCategoryId(userId, categoryId);
    }

    @Override
    public List<Transaction> findByUserIdAndTransactionType(UUID userId, TransactionType type) {
        return repository.findByUserIdAndTransactionType(userId, type);
    }

    @Override
    public List<Transaction> findByUserIdAndDateTimeBetween(UUID userId, LocalDateTime from, LocalDateTime to) {
        return  repository.findByUserIdAndDateTimeBetween(userId, from, to);
    }
}

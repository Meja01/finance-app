package org.example.finance.budgets.infrastructure;

import org.example.finance.budgets.domain.Budget;
import org.example.finance.budgets.domain.BudgetRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class JpaRepositoryBudgetAdapter implements BudgetRepository {
    private final SpringDataBudgetRepository repository;

    public JpaRepositoryBudgetAdapter(SpringDataBudgetRepository repository) {
        this.repository = repository;
    }

    @Override
    public boolean existsByUserIdAndCategoryIdAndYearAndMonth(UUID userId, UUID categoryId, int year, int month) {
        return repository.existsByUserIdAndCategoryIdAndYearAndMonth(userId, categoryId, year, month);
    }

    @Override
    public Budget save(Budget budget) {
        return repository.save(budget);
    }

    @Override
    public List<Budget> findByUserId(UUID userId) {
        return repository.findByUserId(userId);
    }

    @Override
    public List<Budget> findByUserIdAndCategoryId(UUID userId, UUID categoryId) {
        return repository.findByUserIdAndCategoryId(userId, categoryId);
    }

    @Override
    public List<Budget> findByUserIdAndYearAndMonth(UUID userId, int year, int month) {
        return repository.findByUserIdAndYearAndMonth(userId, year, month);
    }

    @Override
    public Optional<Budget> findById(UUID id) {
        return  repository.findById(id);
    }

    @Override
    public void delete(Budget budget) {
        repository.delete(budget);
    }
}

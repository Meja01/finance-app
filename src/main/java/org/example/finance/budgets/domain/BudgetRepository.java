package org.example.finance.budgets.domain;


import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BudgetRepository {
    boolean existsByUserIdAndCategoryIdAndYearAndMonth(UUID userId, UUID categoryId, int year, int month);
    Budget save(Budget budget);
    Optional<Budget> findById(UUID id);
    List<Budget> findByUserId(UUID userId);
    List<Budget> findByUserIdAndCategoryId(UUID userId, UUID categoryId);
    List<Budget> findByUserIdAndYearAndMonth(UUID userId, int year, int month);
    void delete(Budget budget);
}

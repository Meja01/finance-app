package org.example.finance.budgets.infrastructure;

import org.example.finance.budgets.domain.Budget;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SpringDataBudgetRepository extends JpaRepository<Budget, UUID> {
    boolean existsByUserIdAndCategoryIdAndYearAndMonth(UUID userId, UUID categoryId, int year, int month);
    List<Budget> findByUserId(UUID id);
    List<Budget> findByUserIdAndCategoryId(UUID userId, UUID categoryId);
    List<Budget> findByUserIdAndYearAndMonth(UUID userId, int year, int month);
}

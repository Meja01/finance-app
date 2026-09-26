package org.example.finance.budgets.application;

import org.example.finance.budgets.domain.Budget;
import org.example.finance.budgets.domain.BudgetRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class GetBudgetService {
    private final BudgetRepository budgetRepository;

    public GetBudgetService(BudgetRepository budgetRepository) {
        this.budgetRepository = budgetRepository;
    }

    public List<Budget> getBudgets(UUID userId) {
        return budgetRepository.findByUserId(userId);
    }

    public List<Budget> getBudgetsByYearAndMonth(UUID userId, int year, int month) {
        return budgetRepository.findByUserIdAndYearAndMonth(userId, year, month);
    }

    public List<Budget> getBudgetsByCategory(UUID userId, UUID categoryId) {
        return budgetRepository.findByUserIdAndCategoryId(userId,categoryId);
    }
}

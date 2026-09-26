package org.example.finance.budgets.application;

import org.example.finance.budgets.domain.Budget;
import org.example.finance.budgets.domain.BudgetRepository;
import org.example.finance.transactions.domain.Category;
import org.example.finance.transactions.domain.CategoryRepository;
import org.example.finance.transactions.domain.TransactionType;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class CreateBudgetService {
    private final BudgetRepository budgetRepository;
    private final CategoryRepository categoryRepository;

    public CreateBudgetService(BudgetRepository budgetRepository, CategoryRepository categoryRepository) {
        this.budgetRepository = budgetRepository;
        this.categoryRepository = categoryRepository;
    }

    public Budget createBudget(UUID userId, UUID categoryId, int year, int month, BigDecimal amount) {
        Category category = categoryRepository.findById(categoryId).orElseThrow(() ->
                new IllegalArgumentException("Category not found!")
        );
        if (!category.isGlobal() && !category.getUserId().equals(userId)) {
            throw new IllegalArgumentException(
                    "Category must either be global or belong to the user!"
            );
        }
        if (category.getType() != TransactionType.EXPENSE) {
            throw new IllegalArgumentException(
                    "Budget can only be created for expense categories!"
            );
        }
        if (month < 1 || month > 12) {
            throw new IllegalArgumentException("Month must be between 1 and 12!");
        }
        if (year < 1) {
            throw new IllegalArgumentException("Year must be positive!");
        }
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                    "Amount must be greater than zero!"
            );
        }
        if (budgetRepository.existsByUserIdAndCategoryIdAndYearAndMonth(
                userId,
                categoryId,
                year,
                month
        )) {
            throw new IllegalArgumentException(
                    "Budget already exists for this category and month!"
            );
        }

        Budget budget = new Budget(userId, categoryId, year, month, amount);

        return budgetRepository.save(budget);
    }
}

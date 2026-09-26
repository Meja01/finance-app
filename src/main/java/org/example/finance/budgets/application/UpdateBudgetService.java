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
public class UpdateBudgetService {
    private final BudgetRepository budgetRepository;
    private final CategoryRepository categoryRepository;

    public UpdateBudgetService(BudgetRepository budgetRepository, CategoryRepository categoryRepository) {
        this.budgetRepository = budgetRepository;
        this.categoryRepository = categoryRepository;
    }

    public Budget updateBudget(UUID id, UUID userId, BigDecimal amount) {
        Budget budget = budgetRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Budget not found!"));
        if (!budget.getUserId().equals(userId)) {
            throw new IllegalArgumentException(
                    "Budget does not belong to user!"
            );
        }
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                    "Amount must be greater than zero!"
            );
        }
        budget.updateAmount(amount);

        return budgetRepository.save(budget);
    }
}

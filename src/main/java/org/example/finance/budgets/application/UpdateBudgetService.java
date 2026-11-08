package org.example.finance.budgets.application;

import org.example.finance.budgets.domain.Budget;
import org.example.finance.budgets.domain.BudgetRepository;
import org.example.finance.common.exception.ForbiddenOperationException;
import org.example.finance.common.exception.ResourceNotFoundException;
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
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found!"));

        if (!budget.getUserId().equals(userId)) {
            throw new ForbiddenOperationException("Budget does not belong to user!");
        }

        budget.updateAmount(amount);
        return budgetRepository.save(budget);
    }
}

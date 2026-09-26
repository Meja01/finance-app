package org.example.finance.budgets.application;

import org.example.finance.budgets.domain.Budget;
import org.example.finance.budgets.domain.BudgetRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class DeleteBudgetService {
    private final BudgetRepository budgetRepository;

    public DeleteBudgetService(BudgetRepository budgetRepository) {
        this.budgetRepository = budgetRepository;
    }

    public void deleteBudget(UUID id, UUID userId) {
        Budget budget = budgetRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Budget not found!"));
        if (!budget.getUserId().equals(userId)) {
            throw new IllegalArgumentException(
                    "Budget does not belong to user!"
            );
        }

        budgetRepository.delete(budget);
    }
}

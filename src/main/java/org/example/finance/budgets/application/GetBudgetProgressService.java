package org.example.finance.budgets.application;

import org.example.finance.budgets.domain.Budget;
import org.example.finance.budgets.domain.BudgetRepository;
import org.example.finance.budgets.infrastructure.BudgetProgressResponse;
import org.example.finance.budgets.infrastructure.BudgetResponse;
import org.example.finance.transactions.domain.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class GetBudgetProgressService {
    private final BudgetRepository budgetRepository;
    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;

    public GetBudgetProgressService(BudgetRepository budgetRepository, TransactionRepository transactionRepository, CategoryRepository categoryRepository) {
        this.budgetRepository = budgetRepository;
        this.transactionRepository = transactionRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<BudgetProgressResponse> getBudgetProgress(UUID userId, int year, int month) {
        if (month < 1 || month > 12) {
            throw new IllegalArgumentException(
                    "Month must be between 1 and 12!"
            );
        }
        if (year < 1) {
            throw new IllegalArgumentException(
                    "Year must be positive!"
            );
        }

        LocalDateTime from = LocalDateTime.of(year, month, 1, 0, 0);
        LocalDateTime to = from.plusMonths(1).minusNanos(1);
        List<Budget> budgets = budgetRepository.findByUserIdAndYearAndMonth(userId, year, month);

        List<Transaction> transactions = transactionRepository.findByUserIdAndDateTimeBetween(userId, from, to);

        List<BudgetProgressResponse> result = new ArrayList<>();

        for (Budget budget : budgets) {
            BigDecimal spentAmount = BigDecimal.ZERO;
            for (Transaction transaction : transactions) {
                if (budget.getCategoryId().equals(transaction.getCategoryId())) {
                    spentAmount = spentAmount.add(transaction.getAmount());
                }
            }
            BigDecimal remainingAmount = budget.getAmount().subtract(spentAmount);
            BigDecimal percentageUsed = spentAmount.divide(budget.getAmount(), 2, RoundingMode.HALF_UP)
                            .multiply(BigDecimal.valueOf(100));
            Category category = categoryRepository.findById(budget.getCategoryId()).orElseThrow(() ->
                            new IllegalStateException("Category not found!"));
            result.add(new BudgetProgressResponse(
                            budget.getId(),
                            budget.getCategoryId(),
                            category.getName(),
                            budget.getAmount(),
                            spentAmount,
                            remainingAmount,
                            percentageUsed
                    )
            );
        }

        return result;
    }
}

package org.example.finance.transactions.application;

import org.example.finance.transactions.domain.*;
import org.example.finance.transactions.infrastructure.CategoryStatsResponse;
import org.example.finance.transactions.infrastructure.MonthlyStatsResponse;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class MonthlyStatsService {
    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;

    public MonthlyStatsService(TransactionRepository transactionRepository, CategoryRepository categoryRepository) {
        this.transactionRepository = transactionRepository;
        this.categoryRepository = categoryRepository;
    }

    public MonthlyStatsResponse getMonthlyStats(UUID userId, int year, int month) {
        if (month < 1 || month > 12) {
            throw new IllegalArgumentException("Month must be between 1 and 12!");
        }
        if (year < 1) {
            throw new IllegalArgumentException("Year must be positive!");
        }
        LocalDateTime from = LocalDateTime.of(year, month, 1, 0, 0);
        LocalDateTime to = from.plusMonths(1).minusNanos(1);

        List<Transaction> transactions = transactionRepository.findByUserIdAndDateTimeBetween(userId, from, to);

        BigDecimal income = BigDecimal.ZERO;
        BigDecimal expenses = BigDecimal.ZERO;

        for (Transaction transaction : transactions) {
            if (transaction.getTransactionType() == TransactionType.INCOME) {
                income = income.add(transaction.getAmount());
            } else if (transaction.getTransactionType() == TransactionType.EXPENSE) {
                expenses = expenses.add(transaction.getAmount());
            }
        }

        BigDecimal balance = income.subtract(expenses);

        return new MonthlyStatsResponse(income, expenses, balance);
    }

    public List<CategoryStatsResponse> getCategoryStats(UUID userId, int year, int month, TransactionType type) {
        if (month < 1 || month > 12) {
            throw new IllegalArgumentException("Month must be between 1 and 12!");
        }
        if (year < 1) {
            throw new IllegalArgumentException("Year must be positive!");
        }
        if (type == null) {
            throw new IllegalArgumentException("Transaction type must not be null!");
        }
        LocalDateTime from = LocalDateTime.of(year, month, 1, 0, 0);
        LocalDateTime to = from.plusMonths(1).minusNanos(1);

        List<Transaction> transactions = transactionRepository.findByUserIdAndDateTimeBetween(userId, from, to);

        Map<UUID, BigDecimal> totalsByCategory = new HashMap<>();

        for (Transaction transaction : transactions) {
            if (transaction.getTransactionType() == type) {
                totalsByCategory.merge(
                        transaction.getCategoryId(),
                        transaction.getAmount(),
                        BigDecimal::add
                );
            }
        }

        List<CategoryStatsResponse> categories = new ArrayList<>();

        for (Map.Entry<UUID, BigDecimal> entry : totalsByCategory.entrySet()) {
            Category category = categoryRepository.findById(entry.getKey()).orElseThrow(() ->
                    new IllegalStateException("Category not found!")
            );
            categories.add(
                    new CategoryStatsResponse(category.getId(), category.getName(), entry.getValue())
            );
        }

        return categories;
    }
}

package org.example.finance.transactions.application;

import org.example.finance.accounts.application.CreateAccountService;
import org.example.finance.accounts.domain.Account;
import org.example.finance.accounts.domain.AccountType;
import org.example.finance.accounts.infrastructure.SpringDataAccountRepository;
import org.example.finance.transactions.domain.Category;
import org.example.finance.transactions.domain.TransactionType;
import org.example.finance.transactions.infrastructure.*;
import org.example.finance.users.application.RegisterUserService;
import org.example.finance.users.domain.User;
import org.example.finance.users.infrastructure.SpringDataUserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest
public class StatsServiceIntegrationTest {
    @Autowired
    private CreateTransactionService createTransactionService;

    @Autowired
    private MonthlyStatsService monthlyStatsService;

    @Autowired
    private GetAccountBalanceService getAccountBalanceService;

    @Autowired
    private CreateAccountService createAccountService;

    @Autowired
    private CreateCategoryService createCategoryService;

    @Autowired
    private RegisterUserService registerUserService;

    @Autowired
    private SpringDataTransactionRepository springDataTransactionRepository;

    @Autowired
    private SpringDataAccountRepository springDataAccountRepository;

    @Autowired
    private SpringDataUserRepository springDataUserRepository;

    @BeforeEach
    void cleanup() {
        springDataTransactionRepository.deleteAll();
        springDataAccountRepository.deleteAll();
        springDataUserRepository.deleteAll();
    }

    @Test
    void monthlyStatsCalculateIncomeExpensesAndBalance() {
        User user = registerUserService.register(
                "TestUser",
                "testuser@example.com",
                "secret1234"
        );

        Account account = createAccountService.createAccount(
                user.getId(),
                "Main Account",
                AccountType.CARD,
                BigDecimal.ZERO
        );

        Category incomeCategory = createCategoryService.createCategory(
                user.getId(),
                "Test Salary",
                TransactionType.INCOME
        );

        Category expenseCategory = createCategoryService.createCategory(
                user.getId(),
                "Test Expenses",
                TransactionType.EXPENSE
        );

        createTransactionService.createTransaction(
                user.getId(),
                account.getId(),
                incomeCategory.getId(),
                new BigDecimal("3000.00"),
                LocalDateTime.of(2026, 10, 1, 10, 0),
                "Salary",
                TransactionType.INCOME
        );

        createTransactionService.createTransaction(
                user.getId(),
                account.getId(),
                expenseCategory.getId(),
                new BigDecimal("500.00"),
                LocalDateTime.of(2026, 10, 5, 10, 0),
                "Expense 1",
                TransactionType.EXPENSE
        );

        createTransactionService.createTransaction(
                user.getId(),
                account.getId(),
                expenseCategory.getId(),
                new BigDecimal("250.00"),
                LocalDateTime.of(2026, 10, 10, 10, 0),
                "Expense 2",
                TransactionType.EXPENSE
        );

        MonthlyStatsResponse stats =
                monthlyStatsService.getMonthlyStats(
                        user.getId(),
                        2026,
                        10
                );

        assertEquals(0, new BigDecimal("3000.00").compareTo(stats.income()));

        assertEquals(0, new BigDecimal("750.00").compareTo(stats.expenses()));

        assertEquals(0, new BigDecimal("2250.00").compareTo(stats.balance()));
    }

    @Test
    void monthlyStatsOnlyIncludeRequestedMonth() {
        User user = registerUserService.register(
                "TestUser",
                "testuser@example.com",
                "secret1234"
        );

        Account account = createAccountService.createAccount(
                user.getId(),
                "Main Account",
                AccountType.CARD,
                BigDecimal.ZERO
        );

        Category category = createCategoryService.createCategory(
                user.getId(),
                "Test Expenses",
                TransactionType.EXPENSE
        );

        createTransactionService.createTransaction(
                user.getId(),
                account.getId(),
                category.getId(),
                new BigDecimal("100.00"),
                LocalDateTime.of(2026, 10, 10, 12, 0),
                null,
                TransactionType.EXPENSE
        );

        // November - must NOT be included
        createTransactionService.createTransaction(
                user.getId(),
                account.getId(),
                category.getId(),
                new BigDecimal("999.00"),
                LocalDateTime.of(2026, 11, 10, 12, 0),
                null,
                TransactionType.EXPENSE
        );

        MonthlyStatsResponse stats =
                monthlyStatsService.getMonthlyStats(
                        user.getId(),
                        2026,
                        10
                );

        assertEquals(0, new BigDecimal("100.00").compareTo(stats.expenses()));
    }

    @Test
    void categoryStatsGroupExpensesByCategory() {
        User user = registerUserService.register(
                "TestUser",
                "testuser@example.com",
                "secret1234"
        );

        Account account = createAccountService.createAccount(
                user.getId(),
                "Main Account",
                AccountType.CARD,
                BigDecimal.ZERO
        );

        Category food = createCategoryService.createCategory(
                user.getId(),
                "Test Food",
                TransactionType.EXPENSE
        );

        Category transport = createCategoryService.createCategory(
                user.getId(),
                "Test Transport",
                TransactionType.EXPENSE
        );

        createTransactionService.createTransaction(
                user.getId(),
                account.getId(),
                food.getId(),
                new BigDecimal("40.00"),
                LocalDateTime.of(2026, 10, 2, 12, 0),
                null,
                TransactionType.EXPENSE
        );

        createTransactionService.createTransaction(
                user.getId(),
                account.getId(),
                food.getId(),
                new BigDecimal("60.00"),
                LocalDateTime.of(2026, 10, 3, 12, 0),
                null,
                TransactionType.EXPENSE
        );

        createTransactionService.createTransaction(
                user.getId(),
                account.getId(),
                transport.getId(),
                new BigDecimal("30.00"),
                LocalDateTime.of(2026, 10, 4, 12, 0),
                null,
                TransactionType.EXPENSE
        );

        List<CategoryStatsResponse> stats =
                monthlyStatsService.getCategoryStats(
                        user.getId(),
                        2026,
                        10,
                        TransactionType.EXPENSE
                );

        assertEquals(2, stats.size());

        CategoryStatsResponse foodStats = stats.stream()
                .filter(stat -> stat.categoryId().equals(food.getId()))
                .findFirst()
                .orElseThrow();

        assertEquals("Test Food", foodStats.categoryName());

        assertEquals(0, new BigDecimal("100.00").compareTo(foodStats.amount()));

        CategoryStatsResponse transportStats = stats.stream()
                .filter(stat -> stat.categoryId().equals(transport.getId()))
                .findFirst()
                .orElseThrow();

        assertEquals(0, new BigDecimal("30.00").compareTo(transportStats.amount()));
    }

    @Test
    void accountBalanceIncludesInitialBalanceIncomeAndExpenses() {
        User user = registerUserService.register(
                "TestUser",
                "testuser@example.com",
                "secret1234"
        );

        Account account = createAccountService.createAccount(
                user.getId(),
                "Main Account",
                AccountType.CARD,
                new BigDecimal("1000.00")
        );

        Category income = createCategoryService.createCategory(
                user.getId(),
                "Test Income",
                TransactionType.INCOME
        );

        Category expense = createCategoryService.createCategory(
                user.getId(),
                "Test Expense",
                TransactionType.EXPENSE
        );

        createTransactionService.createTransaction(
                user.getId(),
                account.getId(),
                income.getId(),
                new BigDecimal("500.00"),
                LocalDateTime.now(),
                null,
                TransactionType.INCOME
        );

        createTransactionService.createTransaction(
                user.getId(),
                account.getId(),
                expense.getId(),
                new BigDecimal("200.00"),
                LocalDateTime.now(),
                null,
                TransactionType.EXPENSE
        );

        AccountBalanceResponse response =
                getAccountBalanceService.getAccountBalance(
                        user.getId(),
                        account.getId()
                );

        assertEquals(account.getId(), response.accountId());
        assertEquals("Main Account", response.accountName());

        assertEquals(0, new BigDecimal("1300.00").compareTo(response.balance()));
    }

    @Test
    void userCannotGetAnotherUsersAccountBalance() {
        User owner = registerUserService.register(
                "Owner",
                "owner@example.com",
                "secret1234"
        );

        User otherUser = registerUserService.register(
                "Other",
                "other@example.com",
                "secret1234"
        );

        Account account = createAccountService.createAccount(
                owner.getId(),
                "Owner Account",
                AccountType.CARD,
                new BigDecimal("1000.00")
        );

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> getAccountBalanceService.getAccountBalance(
                        otherUser.getId(),
                        account.getId()
                )
        );

        assertEquals("Account does not belong to user!", exception.getMessage());
    }
}
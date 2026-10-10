package org.example.finance.budgets.application;

import org.example.finance.accounts.application.CreateAccountService;
import org.example.finance.accounts.domain.Account;
import org.example.finance.accounts.domain.AccountType;
import org.example.finance.accounts.infrastructure.SpringDataAccountRepository;
import org.example.finance.budgets.domain.Budget;
import org.example.finance.budgets.infrastructure.BudgetProgressResponse;
import org.example.finance.budgets.infrastructure.SpringDataBudgetRepository;
import org.example.finance.transactions.application.CreateCategoryService;
import org.example.finance.transactions.application.CreateTransactionService;
import org.example.finance.transactions.domain.Category;
import org.example.finance.transactions.domain.Transaction;
import org.example.finance.transactions.domain.TransactionType;
import org.example.finance.transactions.infrastructure.SpringDataTransactionRepository;
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
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class BudgetServiceIntegrationTest {

    @Autowired
    private CreateBudgetService createBudgetService;

    @Autowired
    private GetBudgetService getBudgetService;

    @Autowired
    private UpdateBudgetService updateBudgetService;

    @Autowired
    private DeleteBudgetService deleteBudgetService;

    @Autowired
    private GetBudgetProgressService getBudgetProgressService;

    @Autowired
    private RegisterUserService registerUserService;

    @Autowired
    private CreateAccountService createAccountService;

    @Autowired
    private CreateCategoryService createCategoryService;

    @Autowired
    private CreateTransactionService createTransactionService;

    @Autowired
    private SpringDataBudgetRepository springDataBudgetRepository;

    @Autowired
    private SpringDataTransactionRepository springDataTransactionRepository;

    @Autowired
    private SpringDataAccountRepository springDataAccountRepository;

    @Autowired
    private SpringDataUserRepository springDataUserRepository;

    @BeforeEach
    void cleanupBefore() {
        springDataTransactionRepository.deleteAll();
        springDataBudgetRepository.deleteAll();
        springDataAccountRepository.deleteAll();
        springDataUserRepository.deleteAll();
    }

    @Test
    void createBudgetForExpenseCategory() {
        User user = registerUserService.register(
                "TestUser",
                "testuser@example.com",
                "secret1234"
        );

        Category category = createCategoryService.createCategory(
                user.getId(),
                "Gym",
                TransactionType.EXPENSE
        );

        Budget budget = createBudgetService.createBudget(
                user.getId(),
                category.getId(),
                2026,
                10,
                new BigDecimal("200.00")
        );

        assertNotNull(budget.getId());
        assertEquals(user.getId(), budget.getUserId());
        assertEquals(category.getId(), budget.getCategoryId());
        assertEquals(2026, budget.getYear());
        assertEquals(10, budget.getMonth());

        assertEquals(0, new BigDecimal("200.00").compareTo(budget.getAmount()));

        assertTrue(springDataBudgetRepository.findById(budget.getId()).isPresent());
    }

    @Test
    void cannotCreateBudgetForIncomeCategory() {
        User user = registerUserService.register(
                "TestUser",
                "testuser@example.com",
                "secret1234"
        );

        Category category = createCategoryService.createCategory(
                user.getId(),
                "Freelance",
                TransactionType.INCOME
        );

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> createBudgetService.createBudget(
                        user.getId(),
                        category.getId(),
                        2026,
                        10,
                        new BigDecimal("500.00")
                )
        );

        assertEquals("Budget can only be created for expense categories!", exception.getMessage());

        assertEquals(0, springDataBudgetRepository.count());
    }

    @Test
    void cannotCreateBudgetWithAnotherUsersCategory() {
        User user1 = registerUserService.register(
                "User One",
                "user1@example.com",
                "secret1234"
        );

        User user2 = registerUserService.register(
                "User Two",
                "user2@example.com",
                "secret1234"
        );

        Category categoryForUser2 = createCategoryService.createCategory(
                user2.getId(),
                "Private Expense",
                TransactionType.EXPENSE
        );

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> createBudgetService.createBudget(
                        user1.getId(),
                        categoryForUser2.getId(),
                        2026,
                        10,
                        new BigDecimal("300.00")
                )
        );

        assertEquals("Category must either be global or belong to the user!", exception.getMessage());
    }

    @Test
    void cannotCreateDuplicateBudgetForSameCategoryAndMonth() {
        User user = registerUserService.register(
                "TestUser",
                "testuser@example.com",
                "secret1234"
        );

        Category category = createCategoryService.createCategory(
                user.getId(),
                "Gym",
                TransactionType.EXPENSE
        );

        createBudgetService.createBudget(
                user.getId(),
                category.getId(),
                2026,
                10,
                new BigDecimal("200.00")
        );

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> createBudgetService.createBudget(
                        user.getId(),
                        category.getId(),
                        2026,
                        10,
                        new BigDecimal("300.00")
                )
        );

        assertEquals("Budget already exists for this category and month!", exception.getMessage());

        assertEquals(1, springDataBudgetRepository.count());
    }

    @Test
    void sameCategoryCanHaveBudgetInDifferentMonths() {
        User user = registerUserService.register(
                "TestUser",
                "testuser@example.com",
                "secret1234"
        );

        Category category = createCategoryService.createCategory(
                user.getId(),
                "Gym",
                TransactionType.EXPENSE
        );

        Budget october = createBudgetService.createBudget(
                user.getId(),
                category.getId(),
                2026,
                10,
                new BigDecimal("200.00")
        );

        Budget november = createBudgetService.createBudget(
                user.getId(),
                category.getId(),
                2026,
                11,
                new BigDecimal("250.00")
        );

        assertNotNull(october.getId());
        assertNotNull(november.getId());

        assertEquals(2, springDataBudgetRepository.count());
    }

    @Test
    void ownerCanUpdateBudgetAmount() {
        User user = registerUserService.register(
                "TestUser",
                "testuser@example.com",
                "secret1234"
        );

        Category category = createCategoryService.createCategory(
                user.getId(),
                "Gym",
                TransactionType.EXPENSE
        );

        Budget budget = createBudgetService.createBudget(
                user.getId(),
                category.getId(),
                2026,
                10,
                new BigDecimal("200.00")
        );

        Budget updated = updateBudgetService.updateBudget(
                budget.getId(),
                user.getId(),
                new BigDecimal("350.00")
        );

        assertEquals(0, new BigDecimal("350.00").compareTo(updated.getAmount()));

        assertEquals(category.getId(), updated.getCategoryId());
        assertEquals(2026, updated.getYear());
        assertEquals(10, updated.getMonth());

        Budget persisted = springDataBudgetRepository.findById(budget.getId()).orElseThrow();

        assertEquals(0, new BigDecimal("350.00").compareTo(persisted.getAmount()));
    }

    @Test
    void userCannotUpdateAnotherUsersBudget() {
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

        Category category = createCategoryService.createCategory(
                owner.getId(),
                "Gym",
                TransactionType.EXPENSE
        );

        Budget budget = createBudgetService.createBudget(
                owner.getId(),
                category.getId(),
                2026,
                10,
                new BigDecimal("200.00")
        );

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> updateBudgetService.updateBudget(
                        budget.getId(),
                        otherUser.getId(),
                        new BigDecimal("999.00")
                )
        );

        assertEquals("Budget does not belong to user!", exception.getMessage());

        Budget unchanged = springDataBudgetRepository.findById(budget.getId()).orElseThrow();

        assertEquals(0, new BigDecimal("200.00").compareTo(unchanged.getAmount()));
    }

    @Test
    void ownerCanDeleteBudget() {
        User user = registerUserService.register(
                "TestUser",
                "testuser@example.com",
                "secret1234"
        );

        Category category = createCategoryService.createCategory(
                user.getId(),
                "Gym",
                TransactionType.EXPENSE
        );

        Budget budget = createBudgetService.createBudget(
                user.getId(),
                category.getId(),
                2026,
                10,
                new BigDecimal("200.00")
        );

        UUID budgetId = budget.getId();

        deleteBudgetService.deleteBudget(budgetId, user.getId());

        assertFalse(springDataBudgetRepository.findById(budgetId).isPresent());
    }

    @Test
    void userCannotDeleteAnotherUsersBudget() {
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

        Category category = createCategoryService.createCategory(
                owner.getId(),
                "Gym",
                TransactionType.EXPENSE
        );

        Budget budget = createBudgetService.createBudget(
                owner.getId(),
                category.getId(),
                2026,
                10,
                new BigDecimal("200.00")
        );

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> deleteBudgetService.deleteBudget(
                        budget.getId(),
                        otherUser.getId()
                )
        );

        assertEquals("Budget does not belong to user!", exception.getMessage());

        assertTrue(springDataBudgetRepository.findById(budget.getId()).isPresent());
    }

    @Test
    void budgetProgressCalculatesSpentRemainingAndPercentage() {
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
                "Gym",
                TransactionType.EXPENSE
        );

        createBudgetService.createBudget(
                user.getId(),
                category.getId(),
                2026,
                10,
                new BigDecimal("200.00")
        );

        createTransactionService.createTransaction(
                user.getId(),
                account.getId(),
                category.getId(),
                new BigDecimal("50.00"),
                LocalDateTime.of(2026, 10, 5, 12, 0),
                "Gym payment",
                TransactionType.EXPENSE
        );

        createTransactionService.createTransaction(
                user.getId(),
                account.getId(),
                category.getId(),
                new BigDecimal("25.00"),
                LocalDateTime.of(2026, 10, 10, 12, 0),
                "Another gym payment",
                TransactionType.EXPENSE
        );

        List<BudgetProgressResponse> progress =
                getBudgetProgressService.getBudgetProgress(
                        user.getId(),
                        2026,
                        10
                );

        assertEquals(1, progress.size());

        BudgetProgressResponse result = progress.getFirst();

        assertEquals(0, new BigDecimal("200.00").compareTo(result.budgetAmount()));

        assertEquals(0, new BigDecimal("75.00").compareTo(result.spentAmount()));

        assertEquals(0, new BigDecimal("125.00").compareTo(result.remainingAmount()));

        assertEquals(0, new BigDecimal("37.50").compareTo(result.percentageUsed()));
    }
}

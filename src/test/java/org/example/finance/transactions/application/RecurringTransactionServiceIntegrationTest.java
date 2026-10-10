package org.example.finance.transactions.application;
import org.example.finance.accounts.application.CreateAccountService;
import org.example.finance.accounts.domain.Account;
import org.example.finance.accounts.domain.AccountType;
import org.example.finance.accounts.infrastructure.SpringDataAccountRepository;
import org.example.finance.transactions.domain.*;
import org.example.finance.transactions.infrastructure.SpringDataRecurringTransactionRepository;
import org.example.finance.transactions.infrastructure.SpringDataTransactionRepository;
import org.example.finance.users.application.RegisterUserService;
import org.example.finance.users.domain.User;
import org.example.finance.users.infrastructure.SpringDataUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class RecurringTransactionServiceIntegrationTest {

    @Autowired
    private CreateRecurringTransactionService createRecurringTransactionService;

    @Autowired
    private UpdateRecurringTransactionService updateRecurringTransactionService;

    @Autowired
    private DeactivateRecurringTransactionService deactivateRecurringTransactionService;

    @Autowired
    private GenerateRecurringTransactionsService generateRecurringTransactionsService;

    @Autowired
    private CreateAccountService createAccountService;

    @Autowired
    private CreateCategoryService createCategoryService;

    @Autowired
    private RegisterUserService registerUserService;

    @Autowired
    private GetRecurringTransactionsService getRecurringTransactionsService;

    @Autowired
    private SpringDataRecurringTransactionRepository springDataRecurringTransactionRepository;

    @Autowired
    private SpringDataTransactionRepository springDataTransactionRepository;

    @Autowired
    private SpringDataAccountRepository springDataAccountRepository;

    @Autowired
    private SpringDataUserRepository springDataUserRepository;

    @BeforeEach
    void cleanup() {
        springDataTransactionRepository.deleteAll();
        springDataRecurringTransactionRepository.deleteAll();
        springDataAccountRepository.deleteAll();
        springDataUserRepository.deleteAll();
    }

    @Test
    void dueRecurringTransactionGeneratesNormalTransaction() {
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
                "Test Rent",
                TransactionType.EXPENSE
        );

        LocalDate startDate = LocalDate.of(2026, 10, 10);

        RecurringTransaction recurring =
                createRecurringTransactionService.createRecurringTransaction(
                        user.getId(),
                        account.getId(),
                        category.getId(),
                        new BigDecimal("1200.00"),
                        "Rent",
                        TransactionType.EXPENSE,
                        RecurringFrequency.MONTHLY,
                        startDate,
                        null
                );

        generateRecurringTransactionsService.generateDueTransactions(
                LocalDate.of(2026, 10, 10)
        );

        List<Transaction> transactions =
                springDataTransactionRepository.findAll();

        assertEquals(1, transactions.size());

        Transaction generated = transactions.getFirst();

        assertEquals(user.getId(), generated.getUserId());
        assertEquals(account.getId(), generated.getAccountId());
        assertEquals(category.getId(), generated.getCategoryId());
        assertEquals(TransactionType.EXPENSE, generated.getTransactionType());
        assertEquals("Rent", generated.getNote());

        assertEquals(0, new BigDecimal("1200.00").compareTo(generated.getAmount()));

        assertEquals(LocalDateTime.of(2026, 10, 10, 0, 0), generated.getDateTime());
    }

    @Test
    void nextExecutionDateMovesForwardAfterGeneration() {
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
                "Test Subscription",
                TransactionType.EXPENSE
        );

        RecurringTransaction recurring =
                createRecurringTransactionService.createRecurringTransaction(
                        user.getId(),
                        account.getId(),
                        category.getId(),
                        new BigDecimal("25.00"),
                        "Subscription",
                        TransactionType.EXPENSE,
                        RecurringFrequency.MONTHLY,
                        LocalDate.of(2026, 10, 1),
                        null
                );

        generateRecurringTransactionsService.generateDueTransactions(
                LocalDate.of(2026, 10, 1)
        );

        RecurringTransaction persisted =
                springDataRecurringTransactionRepository
                        .findById(recurring.getId())
                        .orElseThrow();

        assertEquals(LocalDate.of(2026, 11, 1), persisted.getNextExecutionDate());

        assertTrue(persisted.isActive());
    }

    @Test
    void missedRecurringTransactionsAreCaughtUp() {
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
                "Test Rent",
                TransactionType.EXPENSE
        );

        RecurringTransaction recurring =
                createRecurringTransactionService.createRecurringTransaction(
                        user.getId(),
                        account.getId(),
                        category.getId(),
                        new BigDecimal("1000.00"),
                        "Rent",
                        TransactionType.EXPENSE,
                        RecurringFrequency.MONTHLY,
                        LocalDate.of(2026, 8, 1),
                        null
                );

        generateRecurringTransactionsService.generateDueTransactions(
                LocalDate.of(2026, 10, 5)
        );

        List<Transaction> transactions =
                springDataTransactionRepository.findAll();

        assertEquals(3, transactions.size());

        assertTrue(
                transactions.stream().anyMatch(t ->
                        t.getDateTime().toLocalDate()
                                .equals(LocalDate.of(2026, 8, 1))
                )
        );

        assertTrue(
                transactions.stream().anyMatch(t ->
                        t.getDateTime().toLocalDate()
                                .equals(LocalDate.of(2026, 9, 1))
                )
        );

        assertTrue(
                transactions.stream().anyMatch(t ->
                        t.getDateTime().toLocalDate()
                                .equals(LocalDate.of(2026, 10, 1))
                )
        );

        RecurringTransaction persisted =
                springDataRecurringTransactionRepository
                        .findById(recurring.getId())
                        .orElseThrow();

        assertEquals(
                LocalDate.of(2026, 11, 1),
                persisted.getNextExecutionDate()
        );
    }

    @Test
    void recurringTransactionDeactivatesAfterEndDate() {
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
                "Test Subscription",
                TransactionType.EXPENSE
        );

        RecurringTransaction recurring =
                createRecurringTransactionService.createRecurringTransaction(
                        user.getId(),
                        account.getId(),
                        category.getId(),
                        new BigDecimal("50.00"),
                        "Subscription",
                        TransactionType.EXPENSE,
                        RecurringFrequency.MONTHLY,
                        LocalDate.of(2026, 10, 1),
                        LocalDate.of(2026, 10, 15)
                );

        generateRecurringTransactionsService.generateDueTransactions(
                LocalDate.of(2026, 10, 20)
        );

        List<Transaction> transactions =
                springDataTransactionRepository.findAll();

        assertEquals(1, transactions.size());

        RecurringTransaction persisted =
                springDataRecurringTransactionRepository
                        .findById(recurring.getId())
                        .orElseThrow();

        assertFalse(persisted.isActive());

        assertEquals(
                LocalDate.of(2026, 11, 1),
                persisted.getNextExecutionDate()
        );
    }

    @Test
    void inactiveRecurringTransactionDoesNotGenerateTransaction() {
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
                "Test Expense",
                TransactionType.EXPENSE
        );

        RecurringTransaction recurring =
                createRecurringTransactionService.createRecurringTransaction(
                        user.getId(),
                        account.getId(),
                        category.getId(),
                        new BigDecimal("30.00"),
                        "Test",
                        TransactionType.EXPENSE,
                        RecurringFrequency.MONTHLY,
                        LocalDate.of(2026, 10, 1),
                        null
                );

        deactivateRecurringTransactionService.deactivateRecurringTransaction(
                recurring.getId(),
                user.getId()
        );

        generateRecurringTransactionsService.generateDueTransactions(
                LocalDate.of(2026, 10, 10)
        );

        assertEquals(
                0,
                springDataTransactionRepository.count()
        );
    }

    @Test
    void userCannotDeactivateAnotherUsersRecurringTransaction() {
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
                BigDecimal.ZERO
        );

        Category category = createCategoryService.createCategory(
                owner.getId(),
                "Owner Expense",
                TransactionType.EXPENSE
        );

        RecurringTransaction recurring =
                createRecurringTransactionService.createRecurringTransaction(
                        owner.getId(),
                        account.getId(),
                        category.getId(),
                        new BigDecimal("50.00"),
                        "Test",
                        TransactionType.EXPENSE,
                        RecurringFrequency.MONTHLY,
                        LocalDate.of(2026, 10, 1),
                        null
                );

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> deactivateRecurringTransactionService
                        .deactivateRecurringTransaction(
                                recurring.getId(),
                                otherUser.getId()
                        )
        );

        assertEquals(
                "Recurring Transaction does not belong to user!",
                exception.getMessage()
        );

        RecurringTransaction persisted =
                springDataRecurringTransactionRepository
                        .findById(recurring.getId())
                        .orElseThrow();

        assertTrue(persisted.isActive());
    }

    @Test
    void ownerCanUpdateRecurringTransaction() {
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
                "Test Expense",
                TransactionType.EXPENSE
        );

        RecurringTransaction recurring =
                createRecurringTransactionService.createRecurringTransaction(
                        user.getId(),
                        account.getId(),
                        category.getId(),
                        new BigDecimal("50.00"),
                        "Old note",
                        TransactionType.EXPENSE,
                        RecurringFrequency.MONTHLY,
                        LocalDate.of(2026, 10, 1),
                        null
                );

        RecurringTransaction updated =
                updateRecurringTransactionService.updateRecurringTransaction(
                        recurring.getId(),
                        user.getId(),
                        account.getId(),
                        category.getId(),
                        new BigDecimal("75.00"),
                        RecurringFrequency.WEEKLY,
                        "Updated note",
                        LocalDate.of(2027, 1, 1),
                        TransactionType.EXPENSE
                );

        assertEquals("Updated note", updated.getNote());
        assertEquals(RecurringFrequency.WEEKLY, updated.getFrequency());

        assertEquals(0, new BigDecimal("75.00").compareTo(updated.getAmount()));

        assertEquals(LocalDate.of(2027, 1, 1), updated.getEndDate());

        RecurringTransaction persisted =
                springDataRecurringTransactionRepository
                        .findById(recurring.getId())
                        .orElseThrow();

        assertEquals("Updated note", persisted.getNote());
        assertEquals(RecurringFrequency.WEEKLY, persisted.getFrequency());

        assertEquals(0, new BigDecimal("75.00").compareTo(persisted.getAmount()));
    }

    @Test
    void getRecurringTransactionsReturnsOnlyUsersTransactions() {
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

        Account account1 = createAccountService.createAccount(
                user1.getId(),
                "User 1 Account",
                AccountType.CARD,
                BigDecimal.ZERO
        );

        Account account2 = createAccountService.createAccount(
                user2.getId(),
                "User 2 Account",
                AccountType.CARD,
                BigDecimal.ZERO
        );

        Category category1 = createCategoryService.createCategory(
                user1.getId(),
                "User1 Expense",
                TransactionType.EXPENSE
        );

        Category category2 = createCategoryService.createCategory(
                user2.getId(),
                "User2 Expense",
                TransactionType.EXPENSE
        );

        createRecurringTransactionService.createRecurringTransaction(
                user1.getId(),
                account1.getId(),
                category1.getId(),
                new BigDecimal("50.00"),
                "User 1 recurring",
                TransactionType.EXPENSE,
                RecurringFrequency.MONTHLY,
                LocalDate.of(2026, 10, 1),
                null
        );

        createRecurringTransactionService.createRecurringTransaction(
                user2.getId(),
                account2.getId(),
                category2.getId(),
                new BigDecimal("80.00"),
                "User 2 recurring",
                TransactionType.EXPENSE,
                RecurringFrequency.MONTHLY,
                LocalDate.of(2026, 10, 1),
                null
        );

        List<RecurringTransaction> recurringTransactions =
                getRecurringTransactionsService
                        .getRecurringTransactions(user1.getId());

        assertEquals(1, recurringTransactions.size());

        RecurringTransaction result = recurringTransactions.getFirst();

        assertEquals(user1.getId(), result.getUserId());
        assertEquals("User 1 recurring", result.getNote());
    }
}
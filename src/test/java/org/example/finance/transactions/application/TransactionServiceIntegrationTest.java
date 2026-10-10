package org.example.finance.transactions.application;

import org.example.finance.accounts.application.CreateAccountService;
import org.example.finance.accounts.domain.Account;
import org.example.finance.accounts.domain.AccountType;
import org.example.finance.accounts.infrastructure.SpringDataAccountRepository;
import org.example.finance.transactions.domain.Category;
import org.example.finance.transactions.domain.Transaction;
import org.example.finance.transactions.domain.TransactionType;
import org.example.finance.transactions.infrastructure.SpringDataCategoryRepository;
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
class TransactionServiceIntegrationTest {

    @Autowired
    private CreateTransactionService createTransactionService;

    @Autowired
    private GetTransactionService getTransactionService;

    @Autowired
    private UpdateTransactionService updateTransactionService;

    @Autowired
    private DeleteTransactionService deleteTransactionService;

    @Autowired
    private CreateAccountService createAccountService;

    @Autowired
    private CreateCategoryService createCategoryService;

    @Autowired
    private RegisterUserService registerUserService;

    @Autowired
    private SpringDataTransactionRepository springDataTransactionRepository;

    @Autowired
    private SpringDataCategoryRepository springDataCategoryRepository;

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
    void createTransaction() {
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

        Category category = createCategoryService.createCategory(
                user.getId(),
                "Groceries",
                TransactionType.EXPENSE
        );

        LocalDateTime dateTime =
                LocalDateTime.of(2026, 10, 9, 18, 0);

        Transaction transaction =
                createTransactionService.createTransaction(
                        user.getId(),
                        account.getId(),
                        category.getId(),
                        new BigDecimal("42.50"),
                        dateTime,
                        "Weekly groceries",
                        TransactionType.EXPENSE
                );

        assertNotNull(transaction);
        assertNotNull(transaction.getId());

        assertEquals(user.getId(), transaction.getUserId());
        assertEquals(account.getId(), transaction.getAccountId());
        assertEquals(category.getId(), transaction.getCategoryId());
        assertEquals(TransactionType.EXPENSE, transaction.getTransactionType());
        assertEquals("Weekly groceries", transaction.getNote());
        assertEquals(dateTime, transaction.getDateTime());

        assertEquals(0, new BigDecimal("42.50").compareTo(transaction.getAmount()));

        assertTrue(springDataTransactionRepository.findById(transaction.getId()).isPresent());
    }

    @Test
    void getTransactionsReturnsOnlyUsersTransactions() {
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
                "User1 Food",
                TransactionType.EXPENSE
        );

        Category category2 = createCategoryService.createCategory(
                user2.getId(),
                "User2 Food",
                TransactionType.EXPENSE
        );

        createTransactionService.createTransaction(
                user1.getId(),
                account1.getId(),
                category1.getId(),
                new BigDecimal("20.00"),
                LocalDateTime.now(),
                "User 1 transaction",
                TransactionType.EXPENSE
        );

        createTransactionService.createTransaction(
                user2.getId(),
                account2.getId(),
                category2.getId(),
                new BigDecimal("30.00"),
                LocalDateTime.now(),
                "User 2 transaction",
                TransactionType.EXPENSE
        );

        List<Transaction> transactions = getTransactionService.getTransactions(user1.getId());

        assertEquals(1, transactions.size());

        assertEquals(user1.getId(), transactions.getFirst().getUserId());
    }

    @Test
    void cannotCreateTransactionForAnotherUsersAccount() {
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

        Account ownersAccount = createAccountService.createAccount(
                owner.getId(),
                "Owner Account",
                AccountType.CARD,
                BigDecimal.ZERO
        );

        Category otherUsersCategory =
                createCategoryService.createCategory(
                        otherUser.getId(),
                        "Custom Category",
                        TransactionType.EXPENSE
                );

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> createTransactionService.createTransaction(
                        otherUser.getId(),
                        ownersAccount.getId(),
                        otherUsersCategory.getId(),
                        new BigDecimal("50.00"),
                        LocalDateTime.now(),
                        "Should fail",
                        TransactionType.EXPENSE
                )
        );

        assertEquals("Account does not belong to user!", exception.getMessage());

        assertEquals(0, springDataTransactionRepository.count());
    }

    @Test
    void cannotCreateTransactionWithAnotherUsersCategory() {
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

        Account user1Account = createAccountService.createAccount(
                user1.getId(),
                "Main Account",
                AccountType.CARD,
                BigDecimal.ZERO
        );

        Category user2Category =
                createCategoryService.createCategory(
                        user2.getId(),
                        "Private Category",
                        TransactionType.EXPENSE
                );

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> createTransactionService.createTransaction(
                        user1.getId(),
                        user1Account.getId(),
                        user2Category.getId(),
                        new BigDecimal("25.00"),
                        LocalDateTime.now(),
                        null,
                        TransactionType.EXPENSE
                )
        );

        assertEquals("Category must either be global or belong to the user!", exception.getMessage());
    }

    @Test
    void transactionTypeMustMatchCategoryType() {
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

        Category expenseCategory =
                createCategoryService.createCategory(
                        user.getId(),
                        "Test Expense Category",
                        TransactionType.EXPENSE
                );

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> createTransactionService.createTransaction(
                        user.getId(),
                        account.getId(),
                        expenseCategory.getId(),
                        new BigDecimal("100.00"),
                        LocalDateTime.now(),
                        "Wrong type",
                        TransactionType.INCOME
                )
        );

        assertEquals("Transaction type and category type must match!", exception.getMessage());
    }

    @Test
    void transactionAmountMustBeGreaterThanZero() {
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

        Category category =
                createCategoryService.createCategory(
                        user.getId(),
                        "Custom Category",
                        TransactionType.EXPENSE
                );

        assertThrows(
                IllegalArgumentException.class,
                () -> createTransactionService.createTransaction(
                        user.getId(),
                        account.getId(),
                        category.getId(),
                        BigDecimal.ZERO,
                        LocalDateTime.now(),
                        null,
                        TransactionType.EXPENSE
                )
        );

        assertEquals(0, springDataTransactionRepository.count());
    }

    @Test
    void ownerCanUpdateTransaction() {
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

        Category oldCategory = createCategoryService.createCategory(
                user.getId(),
                "Old Expense",
                TransactionType.EXPENSE
        );

        Category newCategory = createCategoryService.createCategory(
                user.getId(),
                "New Expense",
                TransactionType.EXPENSE
        );

        Transaction transaction = createTransactionService.createTransaction(
                user.getId(),
                account.getId(),
                oldCategory.getId(),
                new BigDecimal("20.00"),
                LocalDateTime.of(2026, 10, 1, 10, 0),
                "Old note",
                TransactionType.EXPENSE
        );

        LocalDateTime newDate =
                LocalDateTime.of(2026, 10, 5, 18, 30);

        Transaction updatedTransaction =
                updateTransactionService.updateTransaction(
                        transaction.getId(),
                        user.getId(),
                        account.getId(),
                        newCategory.getId(),
                        new BigDecimal("55.50"),
                        newDate,
                        "Updated note",
                        TransactionType.EXPENSE
                );

        assertEquals(newCategory.getId(), updatedTransaction.getCategoryId());
        assertEquals("Updated note", updatedTransaction.getNote());
        assertEquals(newDate, updatedTransaction.getDateTime());

        assertEquals(0, new BigDecimal("55.50").compareTo(updatedTransaction.getAmount()));

        Transaction persisted =
                springDataTransactionRepository
                        .findById(transaction.getId())
                        .orElseThrow();

        assertEquals(newCategory.getId(), persisted.getCategoryId());
        assertEquals("Updated note", persisted.getNote());
    }

    @Test
    void userCannotUpdateAnotherUsersTransaction() {
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

        Account ownerAccount = createAccountService.createAccount(
                owner.getId(),
                "Owner Account",
                AccountType.CARD,
                BigDecimal.ZERO
        );

        Category ownerCategory = createCategoryService.createCategory(
                owner.getId(),
                "Owner Expense",
                TransactionType.EXPENSE
        );

        Transaction transaction = createTransactionService.createTransaction(
                owner.getId(),
                ownerAccount.getId(),
                ownerCategory.getId(),
                new BigDecimal("30.00"),
                LocalDateTime.now(),
                "Original",
                TransactionType.EXPENSE
        );

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> updateTransactionService.updateTransaction(
                        transaction.getId(),
                        otherUser.getId(),
                        ownerAccount.getId(),
                        ownerCategory.getId(),
                        new BigDecimal("999.00"),
                        LocalDateTime.now(),
                        "Should not work",
                        TransactionType.EXPENSE
                )
        );

        assertEquals("Transaction does not belong to user!", exception.getMessage());

        Transaction unchanged =
                springDataTransactionRepository
                        .findById(transaction.getId())
                        .orElseThrow();

        assertEquals("Original", unchanged.getNote());

        assertEquals(0, new BigDecimal("30.00").compareTo(unchanged.getAmount()));
    }

    @Test
    void updateTransactionFailsWhenCategoryTypeDoesNotMatch() {
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

        Category expenseCategory = createCategoryService.createCategory(
                user.getId(),
                "Expense Category",
                TransactionType.EXPENSE
        );

        Transaction transaction = createTransactionService.createTransaction(
                user.getId(),
                account.getId(),
                expenseCategory.getId(),
                new BigDecimal("25.00"),
                LocalDateTime.now(),
                "Original",
                TransactionType.EXPENSE
        );

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> updateTransactionService.updateTransaction(
                        transaction.getId(),
                        user.getId(),
                        account.getId(),
                        expenseCategory.getId(),
                        new BigDecimal("25.00"),
                        LocalDateTime.now(),
                        "Changed",
                        TransactionType.INCOME
                )
        );

        assertEquals("Transaction type and category type must match!", exception.getMessage());
    }

    @Test
    void ownerCanDeleteTransaction() {
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

        Category category = springDataCategoryRepository
                .findByNameAndTypeAndGlobalTrue("Food", TransactionType.EXPENSE).orElseThrow();

        Transaction transaction = createTransactionService.createTransaction(
                user.getId(),
                account.getId(),
                category.getId(),
                new BigDecimal("40.00"),
                LocalDateTime.now(),
                null,
                TransactionType.EXPENSE
        );

        UUID transactionId = transaction.getId();

        deleteTransactionService.deleteTransaction(transactionId, user.getId());

        assertFalse(springDataTransactionRepository.findById(transactionId).isPresent());
    }

    @Test
    void userCannotDeleteAnotherUsersTransaction() {
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

        Transaction transaction = createTransactionService.createTransaction(
                owner.getId(),
                account.getId(),
                category.getId(),
                new BigDecimal("40.00"),
                LocalDateTime.now(),
                null,
                TransactionType.EXPENSE
        );

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> deleteTransactionService.deleteTransaction(
                        transaction.getId(),
                        otherUser.getId()
                )
        );

        assertEquals("Transaction does not belong to user!", exception.getMessage());

        assertTrue(springDataTransactionRepository.findById(transaction.getId()).isPresent());
    }
}
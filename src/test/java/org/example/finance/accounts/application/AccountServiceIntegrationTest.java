package org.example.finance.accounts.application;

import org.example.finance.accounts.domain.Account;
import org.example.finance.accounts.domain.AccountType;
import org.example.finance.accounts.infrastructure.SpringDataAccountRepository;
import org.example.finance.users.domain.User;
import org.example.finance.users.application.RegisterUserService;
import org.example.finance.users.infrastructure.SpringDataUserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AccountServiceIntegrationTest {

    @Autowired
    private CreateAccountService createAccountService;

    @Autowired
    private GetAccountService getAccountsService;

    @Autowired
    private UpdateAccountService updateAccountService;

    @Autowired
    private DeleteAccountService deleteAccountService;

    @Autowired
    private RegisterUserService registerUserService;

    @Autowired
    private SpringDataAccountRepository springDataAccountRepository;

    @Autowired
    private SpringDataUserRepository springDataUserRepository;

    @BeforeEach
    void cleanup() {
        springDataAccountRepository.deleteAll();
        springDataUserRepository.deleteAll();
    }

    @Test
    void createAccount() {
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

        assertNotNull(account);
        assertNotNull(account.getId());

        assertEquals(user.getId(), account.getUserId());
        assertEquals("Main Account", account.getName());
        assertEquals(AccountType.CARD, account.getType());
        assertEquals(0, new BigDecimal("1000.00").compareTo(account.getInitialBalance()));

        assertTrue(springDataAccountRepository.findById(account.getId()).isPresent());
    }

    @Test
    void getAccountsReturnsOnlyAccountsBelongingToUser() {
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

        createAccountService.createAccount(
                user1.getId(),
                "User 1 Main Account",
                AccountType.CARD,
                new BigDecimal("1000.00")
        );

        createAccountService.createAccount(
                user1.getId(),
                "User 1 Cash",
                AccountType.CASH,
                new BigDecimal("100.00")
        );

        createAccountService.createAccount(
                user2.getId(),
                "User 2 Account",
                AccountType.CARD,
                new BigDecimal("500.00")
        );

        List<Account> accounts =
                getAccountsService.getAccounts(user1.getId());

        assertEquals(2, accounts.size());

        assertTrue(accounts.stream().allMatch(account ->
                                account.getUserId().equals(user1.getId())));
    }

    @Test
    void ownerCanUpdateAccount() {
        User user = registerUserService.register(
                "TestUser",
                "testuser@example.com",
                "secret1234"
        );

        Account account = createAccountService.createAccount(
                user.getId(),
                "Old Name",
                AccountType.CARD,
                new BigDecimal("1000.00")
        );

        Account updatedAccount = updateAccountService.updateAccount(
                user.getId(),
                account.getId(),
                "New Name",
                AccountType.CASH,
                new BigDecimal("1500.00")
        );

        assertEquals("New Name", updatedAccount.getName());
        assertEquals(AccountType.CASH, updatedAccount.getType());

        assertEquals(
                0,
                new BigDecimal("1500.00")
                        .compareTo(updatedAccount.getInitialBalance())
        );

        Account persistedAccount =
                springDataAccountRepository
                        .findById(account.getId())
                        .orElseThrow();

        assertEquals("New Name", persistedAccount.getName());
    }

    @Test
    void userCannotUpdateAnotherUsersAccount() {
        User owner = registerUserService.register(
                "Owner",
                "owner@example.com",
                "secret1234"
        );

        User otherUser = registerUserService.register(
                "Other User",
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
                () -> updateAccountService.updateAccount(
                        otherUser.getId(),
                        account.getId(),
                        "Hacked Account",
                        AccountType.CASH,
                        new BigDecimal("9999.00")
                )
        );

        assertEquals(
                "Account does not belong to user!",
                exception.getMessage()
        );

        Account unchangedAccount =
                springDataAccountRepository
                        .findById(account.getId())
                        .orElseThrow();

        assertEquals("Owner Account", unchangedAccount.getName());
        assertEquals(AccountType.CARD, unchangedAccount.getType());
    }

    @Test
    void ownerCanDeleteAccount() {
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

        UUID accountId = account.getId();

        deleteAccountService.deleteAccount(
                user.getId(),
                accountId
        );

        assertFalse(
                springDataAccountRepository
                        .findById(accountId)
                        .isPresent()
        );
    }

    @Test
    void userCannotDeleteAnotherUsersAccount() {
        User owner = registerUserService.register(
                "Owner",
                "owner@example.com",
                "secret1234"
        );

        User otherUser = registerUserService.register(
                "Other User",
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
                () -> deleteAccountService.deleteAccount(
                        otherUser.getId(),
                        account.getId()
                )
        );

        assertEquals(
                "Account does not belong to user!",
                exception.getMessage()
        );

        assertTrue(
                springDataAccountRepository
                        .findById(account.getId())
                        .isPresent()
        );
    }
}
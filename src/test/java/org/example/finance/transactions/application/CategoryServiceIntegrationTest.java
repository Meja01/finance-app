package org.example.finance.transactions.application;

import org.example.finance.accounts.application.CreateAccountService;
import org.example.finance.accounts.infrastructure.SpringDataAccountRepository;
import org.example.finance.transactions.domain.Category;
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

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class CategoryServiceIntegrationTest {
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
    void cannotCreateCustomCategoryThatAlreadyExistsAsGlobal() {
        User user = registerUserService.register(
                "TestUser",
                "testuser@example.com",
                "secret1234"
        );

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> createCategoryService.createCategory(
                        user.getId(),
                        "Food",
                        TransactionType.EXPENSE
                )
        );

        assertEquals("A global category with this name and type already exists!", exception.getMessage());
    }

    @Test
    void cannotCreateDuplicateCustomCategoryForSameUser() {
        User user = registerUserService.register(
                "TestUser",
                "testuser@example.com",
                "secret1234"
        );

        createCategoryService.createCategory(
                user.getId(),
                "Gym",
                TransactionType.EXPENSE
        );

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> createCategoryService.createCategory(
                        user.getId(),
                        "Gym",
                        TransactionType.EXPENSE
                )
        );

        assertEquals("You already have a category with this name and type!", exception.getMessage());
    }

    @Test
    void differentUsersCanCreateSameCustomCategory() {
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

        Category category1 = createCategoryService.createCategory(
                user1.getId(),
                "Gym",
                TransactionType.EXPENSE
        );

        Category category2 = createCategoryService.createCategory(
                user2.getId(),
                "Gym",
                TransactionType.EXPENSE
        );

        assertNotNull(category1);
        assertNotNull(category2);

        assertNotEquals(category1.getId(), category2.getId());
    }
}

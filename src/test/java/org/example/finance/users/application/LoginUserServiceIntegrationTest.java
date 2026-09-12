package org.example.finance.users.application;

import org.example.finance.users.domain.User;
import org.example.finance.users.infrastructure.SpringDataUserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class LoginUserServiceIntegrationTest {
    @Autowired
    private LoginUserService loginUserService;
    @Autowired
    private RegisterUserService registerUserService;

    @Autowired
    private SpringDataUserRepository springDataUserRepository;

    @AfterEach
    void cleanup() {
        springDataUserRepository.deleteAll();
    }

    @Test
    void testLoginUser() {
        User user = registerUserService.register(
                "TestUser",
                "testuser@example.com",
                "secret1234"
        );

        assertNotNull(user);
        assertEquals("testuser@example.com", user.getEmail());

        User user1 = loginUserService.login(
                "testuser@example.com",
                "secret1234"
        );

        assertNotNull(user1);
        assertEquals("testuser@example.com", user1.getEmail());
        assertEquals("TestUser", user1.getName());
    }

    @Test
    void testLoginUserInvalidCredentials() {
        User user = registerUserService.register(
                "TestUser",
                "testuser@example.com",
                "secret1234"
        );

        assertNotNull(user);
        assertEquals("testuser@example.com", user.getEmail());

        IllegalArgumentException exceptionIncorrectEmail = assertThrows(
                IllegalArgumentException.class,
                () -> loginUserService.login(
                        "testuser1@example.com",
                        "secret123"
                )
        );

        assertEquals("Invalid Credentials!", exceptionIncorrectEmail.getMessage());

        IllegalArgumentException exceptionIncorrectPassword = assertThrows(
                IllegalArgumentException.class,
                () -> loginUserService.login(
                        "testuser@example.com",
                        "secret1423"
                )
        );

        assertEquals("Invalid Credentials!", exceptionIncorrectPassword.getMessage());
    }
}

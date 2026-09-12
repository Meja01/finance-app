package org.example.finance.users.application;
import org.example.finance.users.domain.User;


import org.example.finance.users.infrastructure.SpringDataUserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.AfterEach;

import static org.junit.jupiter.api.Assertions.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class RegisterUserServiceIntegrationTest {

    @Autowired
    private RegisterUserService registerUserService;

    @Autowired
    private SpringDataUserRepository springDataUserRepository;

    @AfterEach
    void cleanup() {
        springDataUserRepository.deleteAll();
    }

    @Test
    void testRegisterUser() {
        User user = registerUserService.register(
                "Milan",
                "milan@example.com",
                "secret123"
        );

        assertNotNull(user);
        assertEquals("milan@example.com", user.getEmail());
    }

    @Test
    void testRegisterUserInvalidCredentials() {
        IllegalArgumentException exceptionEmptyName = assertThrows(
                IllegalArgumentException.class,
                () -> registerUserService.register(
                        "",
                        "test@example.com",
                        "secret123"
                )
        );

        assertEquals("Name must not be empty!", exceptionEmptyName.getMessage());

        IllegalArgumentException exceptionBlankName = assertThrows(
                IllegalArgumentException.class,
                () -> registerUserService.register(
                        " ",
                        "test@example.com",
                        "secret123"
                )
        );

        assertEquals("Name must not be empty!", exceptionBlankName.getMessage());

        IllegalArgumentException exceptionInvalidEmail = assertThrows(
                IllegalArgumentException.class,
                () -> registerUserService.register(
                        "TestUser",
                        "example.org",
                        "secret123"
                )
        );

        assertEquals("Email is invalid!", exceptionInvalidEmail.getMessage());

        IllegalArgumentException exceptionInvalidPassword = assertThrows(
                IllegalArgumentException.class,
                () -> registerUserService.register(
                        "TestUser",
                        "test@example.com",
                        " "
                )
        );

        assertEquals("Password must be at least 8 characters long!", exceptionInvalidPassword.getMessage());
    }

    @Test
    void testRegisterUserEmailAlreadyInUse() {
        User user1 = registerUserService.register(
                "Milan",
                "simon@example.com",
                "secret123"
        );

        assertNotNull(user1);
        assertEquals("simon@example.com", user1.getEmail());

        EmailAlreadyInUseException exception = assertThrows(
                EmailAlreadyInUseException.class,
                () -> registerUserService.register(
                        "Milan",
                        "simon@example.com",
                        "secret123"
                )
        );

        assertEquals("Email already in use: simon@example.com", exception.getMessage());
    }
}

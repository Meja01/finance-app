package org.example.finance.users.application;
import org.example.finance.common.exception.EmailAlreadyInUseException;
import org.example.finance.users.domain.User;


import org.example.finance.users.infrastructure.SpringDataUserRepository;
import org.junit.jupiter.api.BeforeEach;
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

    @BeforeEach
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

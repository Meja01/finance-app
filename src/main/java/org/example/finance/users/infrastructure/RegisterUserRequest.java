package org.example.finance.users.infrastructure;

public record RegisterUserRequest(
        String name,
        String email,
        String password
) {}

package org.example.finance.users.infrastructure;

import java.time.LocalDateTime;
import java.util.UUID;

public record RegisterUserResponse(
        UUID id,
        String name,
        String email,
        LocalDateTime createdAt
) {
}

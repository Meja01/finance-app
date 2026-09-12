package org.example.finance.users.infrastructure;

import java.util.UUID;

public record LoginUserResponse(UUID id, String name, String email, String AccessToken ) {
}

package org.example.finance.accounts.domain;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AccountRepository {
    Account save(Account account);
    List<Account> findByUserId(UUID userId);
    Optional<Account> findById(UUID id);
    void delete(Account account);
}

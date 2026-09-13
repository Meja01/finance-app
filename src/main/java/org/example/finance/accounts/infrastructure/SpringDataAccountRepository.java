package org.example.finance.accounts.infrastructure;

import org.example.finance.accounts.domain.Account;
import org.example.finance.users.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SpringDataAccountRepository extends JpaRepository<Account, UUID> {
    List<Account> findByUserId(UUID userId);
    Optional<Account> findById(UUID id);
}

package org.example.finance.accounts.application;

import org.example.finance.accounts.domain.Account;
import org.example.finance.accounts.domain.AccountRepository;
import org.example.finance.accounts.domain.AccountType;
import org.example.finance.users.application.EmailAlreadyInUseException;
import org.example.finance.users.domain.User;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class CreateAccountService {
    private final AccountRepository accountRepository;

    public CreateAccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public Account createAccount(UUID userId, String name, AccountType type, BigDecimal initialBalance) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Account Name must not be empty!");
        }

        if (type == null) {
            throw new IllegalArgumentException("Account type must not be empty!");
        }

        if (initialBalance == null) {
            throw new IllegalArgumentException("Initial balance must not be null!");
        }

        Account account = new Account(userId, name, type, initialBalance);

        return accountRepository.save(account);
    }
}

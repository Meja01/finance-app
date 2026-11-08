package org.example.finance.accounts.application;

import org.example.finance.accounts.domain.Account;
import org.example.finance.accounts.domain.AccountRepository;
import org.example.finance.accounts.domain.AccountType;
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
        Account account = new Account(userId, name, type, initialBalance);
        return accountRepository.save(account);
    }
}

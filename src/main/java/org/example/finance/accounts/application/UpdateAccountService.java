package org.example.finance.accounts.application;

import org.example.finance.accounts.domain.Account;
import org.example.finance.accounts.domain.AccountRepository;
import org.example.finance.accounts.domain.AccountType;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class UpdateAccountService {
    private final AccountRepository accountRepository;

    public UpdateAccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public Account updateAccount(UUID userId, UUID accountId, String name, AccountType type, BigDecimal initialBalance) {
        Account account = accountRepository.findById(accountId).orElseThrow(() -> new IllegalArgumentException("Account not found!"));

        if (!account.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Account does not belong to user!");
        }

        account.update(name, type, initialBalance);
        return accountRepository.save(account);
    }
}

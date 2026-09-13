package org.example.finance.accounts.application;

import org.example.finance.accounts.domain.Account;
import org.example.finance.accounts.domain.AccountRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class DeleteAccountService {
    private final AccountRepository accountRepository;

    public DeleteAccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public void deleteAccount(UUID userId, UUID accountId) {
        Account account = accountRepository.findById(accountId).orElseThrow(() -> new IllegalArgumentException("Account not found!"));

        if (!account.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Account does not belong to user!");
        }
        accountRepository.delete(account);
    }
}

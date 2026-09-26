package org.example.finance.transactions.application;

import org.example.finance.accounts.domain.Account;
import org.example.finance.accounts.domain.AccountRepository;
import org.example.finance.transactions.domain.Transaction;
import org.example.finance.transactions.domain.TransactionRepository;
import org.example.finance.transactions.domain.TransactionType;
import org.example.finance.transactions.infrastructure.AccountBalanceResponse;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class GetAccountBalanceService {
    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;

    public GetAccountBalanceService(TransactionRepository transactionRepository, AccountRepository accountRepository) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
    }

    public AccountBalanceResponse getAccountBalance(UUID userId, UUID accountId) {
        Account account = accountRepository.findById(accountId).orElseThrow(() ->
                new IllegalArgumentException("Account not found!")
        );

        if (!account.getUserId().equals(userId)) {
            throw new IllegalArgumentException(
                    "Account does not belong to user!"
            );
        }
        List<Transaction> transactions = transactionRepository.findByUserIdAndAccountId(userId, accountId);

        BigDecimal income = BigDecimal.ZERO;
        BigDecimal expenses = BigDecimal.ZERO;

        for(Transaction transaction : transactions) {
            if (transaction.getTransactionType() == TransactionType.INCOME) {
                income = income.add(transaction.getAmount());
            } else if (transaction.getTransactionType() == TransactionType.EXPENSE) {
                expenses = expenses.add(transaction.getAmount());
            }
        }
        BigDecimal balance = account.getInitialBalance().add(income).subtract(expenses);
        return new AccountBalanceResponse(account.getId(), account.getName(), balance);
    }

    public List<AccountBalanceResponse> getAccountsBalance(UUID userId) {
        List<Account> accounts = accountRepository.findByUserId(userId);
        return accounts.stream().map(account -> getAccountBalance(userId, account.getId())).toList();
    }
}

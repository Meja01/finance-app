package org.example.finance.accounts.infrastructure;

import org.example.finance.accounts.domain.Account;
import org.example.finance.accounts.domain.AccountRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class JpaAccountRepositoryAdapter implements AccountRepository {
    private final SpringDataAccountRepository repository;

    public JpaAccountRepositoryAdapter(SpringDataAccountRepository repository) {
        this.repository = repository;
    }

    @Override
    public Account save(Account account) {
        return repository.save(account);
    }
    @Override
    public void delete(Account account) {
        repository.delete(account);
    }
    @Override
    public List<Account> findByUserId(UUID userId) {
        return repository.findByUserId(userId);
    }
    @Override
    public Optional<Account> findById(UUID id) {
        return  repository.findById(id);
    }
}

package org.example.finance.users.infrastructure;

import org.example.finance.users.domain.User;
import org.example.finance.users.domain.UserRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository // Create and manage an instance of this class as a Spring Bean
public class JpaUserRepositoryAdapter implements UserRepository{

    private final SpringDataUserRepository repository;

    public JpaUserRepositoryAdapter(SpringDataUserRepository repository) {
        this.repository = repository;
    }

    @Override
    public boolean existsByEmail(String email) {
        return  repository.existsByEmail(email);
    }

    @Override
    public User save(User user) {
        return repository.save(user);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return repository.findByEmail(email);
    }

    @Override
    public Optional<User> findById(UUID userId) {
        return repository.findById(userId);
    }
}

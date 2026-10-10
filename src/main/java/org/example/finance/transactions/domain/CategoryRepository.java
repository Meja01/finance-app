package org.example.finance.transactions.domain;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CategoryRepository {
    Category save(Category category);
    Optional<Category> findById(UUID id);
    List<Category> findByGlobalTrue();
    List<Category> findByUserId(UUID userId);
    boolean existsByNameAndTypeAndGlobalTrue(
            String name,
            TransactionType type
    );
    Optional<Category> findByNameAndTypeAndGlobalTrue(
            String name,
            TransactionType type
    );
    void delete(Category category);
    boolean existsByUserIdAndNameAndType(
            UUID userId,
            String name,
            TransactionType type
    );
}

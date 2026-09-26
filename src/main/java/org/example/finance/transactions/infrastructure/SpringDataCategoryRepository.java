package org.example.finance.transactions.infrastructure;

import org.example.finance.transactions.domain.Category;
import org.example.finance.transactions.domain.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SpringDataCategoryRepository extends JpaRepository<Category, UUID> {
    List<Category> findByGlobalTrue();
    List<Category> findByUserId(UUID userId);
    boolean existsByNameAndTypeAndGlobalTrue(String name, TransactionType type);
    Optional<Category> findByNameAndTypeAndGlobalTrue(
            String name,
            TransactionType type
    );
}

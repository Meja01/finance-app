package org.example.finance.transactions.infrastructure;

import org.example.finance.transactions.domain.Category;
import org.example.finance.transactions.domain.CategoryRepository;
import org.example.finance.transactions.domain.TransactionType;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class JpaCategoryRepositoryAdapter implements CategoryRepository {
    private final SpringDataCategoryRepository categoryRepository;

    public JpaCategoryRepositoryAdapter(SpringDataCategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public Category save(Category category) {
        return categoryRepository.save(category);
    }

    @Override
    public Optional<Category> findById(UUID id) {
        return categoryRepository.findById(id);
    }

    @Override
    public List<Category> findByGlobalTrue() {
        return categoryRepository.findByGlobalTrue();
    }

    @Override
    public List<Category> findByUserId(UUID userId) {
        return categoryRepository.findByUserId(userId);
    }

    @Override
    public boolean existsByNameAndTypeAndGlobalTrue(String name, TransactionType type) {
        return categoryRepository.existsByNameAndTypeAndGlobalTrue(name, type);
    }

    @Override
    public void delete(Category category) {
        categoryRepository.delete(category);
    }

    @Override
    public boolean existsByUserIdAndNameAndType(UUID userId, String name, TransactionType type) {
        return categoryRepository.existsByUserIdAndNameAndType(userId,name,type);
    }

    @Override
    public Optional<Category> findByNameAndTypeAndGlobalTrue(String name, TransactionType type) {
        return categoryRepository.findByNameAndTypeAndGlobalTrue(name, type);
    }
}

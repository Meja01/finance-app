package org.example.finance.transactions.application;

import org.example.finance.transactions.domain.Category;
import org.example.finance.transactions.domain.CategoryRepository;
import org.example.finance.transactions.domain.TransactionType;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CreateCategoryService {
    private final CategoryRepository repository;

    public CreateCategoryService(CategoryRepository repository) {
        this.repository = repository;
    }

    public Category createCategory(UUID userId, String name, TransactionType type) {
        if (repository.existsByNameAndTypeAndGlobalTrue(name, type)) {
            throw new IllegalArgumentException("A global category with this name and type already exists!");
        }
        if (repository.existsByUserIdAndNameAndType(userId, name, type)) {
            throw new IllegalArgumentException("You already have a category with this name and type!");
        }
        Category category = new Category(name, type, userId, false);
        return repository.save(category);
    }
}

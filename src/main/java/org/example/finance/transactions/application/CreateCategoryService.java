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
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Name must not be empty!");
        }
        if (type == null) {
            throw new IllegalArgumentException("type must not be null!");
        }
        Category category = new Category(name, type, userId, false);
        return repository.save(category);
    }
}

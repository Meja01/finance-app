package org.example.finance.transactions.application;

import org.example.finance.transactions.domain.Category;
import org.example.finance.transactions.domain.CategoryRepository;
import org.example.finance.transactions.domain.TransactionType;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UpdateCategoryService {
    private final CategoryRepository categoryRepository;

    public UpdateCategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public Category updateCategory(UUID id, UUID userId, String name) {
        Category category = categoryRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Category not found!"));
        if (category.isGlobal()) {
            throw new IllegalArgumentException(
                    "Global Category can't be changed!"
            );
        }
        if (!category.getUserId().equals(userId)) {
            throw new IllegalArgumentException(
                    "Category does not belong to user!"
            );
        }

        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Name must not be empty!");
        }
        category.update(name);
        return categoryRepository.save(category);
    }
}

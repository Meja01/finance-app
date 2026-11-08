package org.example.finance.transactions.application;

import org.example.finance.common.exception.ForbiddenOperationException;
import org.example.finance.common.exception.ResourceNotFoundException;
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
        Category category = categoryRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category not found!"));
        if (category.isGlobal()) {
            throw new ForbiddenOperationException("Global Category can't be changed!");
        }
        if (!category.getUserId().equals(userId)) {
            throw new ForbiddenOperationException(
                    "Category does not belong to user!"
            );
        }
        category.update(name);
        return categoryRepository.save(category);
    }
}

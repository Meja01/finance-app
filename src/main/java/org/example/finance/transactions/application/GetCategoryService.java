package org.example.finance.transactions.application;

import org.example.finance.transactions.domain.Category;
import org.example.finance.transactions.domain.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class GetCategoryService {
    private final CategoryRepository categoryRepository;

    public GetCategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getCategories(UUID userId) {
        List<Category> categories = new ArrayList<>();
        categories.addAll(categoryRepository.findByGlobalTrue());
        categories.addAll(categoryRepository.findByUserId(userId));
        return categories;
    }
}

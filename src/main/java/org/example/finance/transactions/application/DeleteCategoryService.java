package org.example.finance.transactions.application;

import org.example.finance.common.exception.ForbiddenOperationException;
import org.example.finance.common.exception.ResourceNotFoundException;
import org.example.finance.transactions.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DeleteCategoryService {
    private final CategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;

    public DeleteCategoryService(CategoryRepository categoryRepository, TransactionRepository transactionRepository) {
        this.categoryRepository = categoryRepository;
        this.transactionRepository = transactionRepository;
    }

    public void deleteCategory(UUID id, UUID userId) {
        Category category = categoryRepository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Category not found!")
        );

        if (category.isGlobal()) {
            throw new ForbiddenOperationException(
                    "Global Category can't be deleted!"
            );
        }

        if (!category.getUserId().equals(userId)) {
            throw new ForbiddenOperationException(
                    "Category does not belong to user!"
            );
        }
        List<Transaction> transactions = transactionRepository.findByCategoryId(category.getId());
        Category globalCategoryOther = categoryRepository.findByNameAndTypeAndGlobalTrue(
                        "Other",
                        category.getType())
                .orElseThrow(() -> new ResourceNotFoundException("Global Other category not found!"));

        for (Transaction transaction : transactions) {
            transaction.changeCategory(globalCategoryOther.getId());
            transactionRepository.save(transaction);
        }

        categoryRepository.delete(category);
    }
}

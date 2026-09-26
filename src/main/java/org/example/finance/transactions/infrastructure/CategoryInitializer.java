package org.example.finance.transactions.infrastructure;

import org.example.finance.transactions.domain.Category;
import org.example.finance.transactions.domain.CategoryRepository;
import org.example.finance.transactions.domain.TransactionType;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class CategoryInitializer implements CommandLineRunner {
    private final CategoryRepository categoryRepository;

    public CategoryInitializer(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public void run(String... args) {
        if (!categoryRepository.existsByNameAndTypeAndGlobalTrue("Salary", TransactionType.INCOME)) {
            categoryRepository.save(
                    new Category("Salary", TransactionType.INCOME, null, true)
            );
        }
        if (!categoryRepository.existsByNameAndTypeAndGlobalTrue("Bonus", TransactionType.INCOME)) {
            categoryRepository.save(
                    new Category("Bonus", TransactionType.INCOME, null, true)
            );
        }
        if (!categoryRepository.existsByNameAndTypeAndGlobalTrue("Other", TransactionType.INCOME)) {
            categoryRepository.save(
                    new Category("Other", TransactionType.INCOME, null, true)
            );
        }
        if (!categoryRepository.existsByNameAndTypeAndGlobalTrue("Food", TransactionType.EXPENSE)) {
            categoryRepository.save(
                    new Category("Food", TransactionType.EXPENSE, null, true)
            );
        }
        if (!categoryRepository.existsByNameAndTypeAndGlobalTrue("Social Life", TransactionType.EXPENSE)) {
            categoryRepository.save(
                    new Category("Social Life", TransactionType.EXPENSE, null, true)
            );
        }
        if (!categoryRepository.existsByNameAndTypeAndGlobalTrue("Transport", TransactionType.EXPENSE)) {
            categoryRepository.save(
                    new Category("Transport", TransactionType.EXPENSE, null, true)
            );
        }
        if (!categoryRepository.existsByNameAndTypeAndGlobalTrue("Household", TransactionType.EXPENSE)) {
            categoryRepository.save(
                    new Category("Household", TransactionType.EXPENSE, null, true)
            );
        }
        if (!categoryRepository.existsByNameAndTypeAndGlobalTrue("Gift", TransactionType.EXPENSE)) {
            categoryRepository.save(
                    new Category("Gift", TransactionType.EXPENSE, null, true)
            );
        }
        if (!categoryRepository.existsByNameAndTypeAndGlobalTrue("Other", TransactionType.EXPENSE)) {
            categoryRepository.save(
                    new Category("Other", TransactionType.EXPENSE, null, true)
            );
        }
        if (!categoryRepository.existsByNameAndTypeAndGlobalTrue("Education", TransactionType.EXPENSE)) {
            categoryRepository.save(
                    new Category("Education", TransactionType.EXPENSE, null, true)
            );
        }
        if (!categoryRepository.existsByNameAndTypeAndGlobalTrue("Health", TransactionType.EXPENSE)) {
            categoryRepository.save(
                    new Category("Health", TransactionType.EXPENSE, null, true)
            );
        }
        if (!categoryRepository.existsByNameAndTypeAndGlobalTrue("Apparel", TransactionType.EXPENSE)) {
            categoryRepository.save(
                    new Category("Apparel", TransactionType.EXPENSE, null, true)
            );
        }
    }
}

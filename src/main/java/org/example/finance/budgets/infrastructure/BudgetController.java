package org.example.finance.budgets.infrastructure;

import org.example.finance.budgets.application.*;
import org.example.finance.budgets.domain.Budget;
import org.example.finance.budgets.domain.BudgetRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.function.EntityResponse;
import org.springframework.web.servlet.function.ServerResponse;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/budgets")
public class BudgetController {
    private final CreateBudgetService createBudgetService;
    private final GetBudgetService getBudgetService;
    private final UpdateBudgetService updateBudgetService;
    private final DeleteBudgetService deleteBudgetService;
    private final GetBudgetProgressService getBudgetProgressService;

    public BudgetController(CreateBudgetService createBudgetService, GetBudgetService getBudgetService, UpdateBudgetService updateBudgetService, DeleteBudgetService deleteBudgetService, GetBudgetProgressService getBudgetProgressService) {
        this.createBudgetService = createBudgetService;
        this.getBudgetService = getBudgetService;
        this.updateBudgetService = updateBudgetService;
        this.deleteBudgetService = deleteBudgetService;
        this.getBudgetProgressService = getBudgetProgressService;
    }

    @PostMapping
    public BudgetResponse createBudget(@RequestBody CreateBudgetRequest budgetRequest, Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();

        Budget budget = createBudgetService.createBudget(
                userId,
                budgetRequest.categoryId(),
                budgetRequest.year(),
                budgetRequest.month(),
                budgetRequest.amount());
        return new BudgetResponse(budget.getId(), budget.getCategoryId(), budget.getYear(), budget.getMonth(), budget.getAmount(), budget.getCreatedAt());
    }

    @GetMapping
    public List<BudgetResponse> getBudgets(@RequestParam (required = false) Integer year,
                                           @RequestParam (required = false) Integer month,
                                           @RequestParam ( required = false) UUID categoryId,
                                           Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();
        if ((year == null) != (month == null)) {
            throw new IllegalArgumentException(
                    "Year and month must be provided together!"
            );
        }

        if (month != null && (month < 1 || month > 12)) {
            throw new IllegalArgumentException(
                    "Month must be between 1 and 12!"
            );
        }

        if (year != null && year < 1) {
            throw new IllegalArgumentException(
                    "Year must be positive!"
            );
        }

        List<Budget> budgets;


        if (year != null) {
            budgets = getBudgetService
                    .getBudgetsByYearAndMonth(userId, year, month);
        } else if (categoryId != null) {
            budgets = getBudgetService
                    .getBudgetsByCategory(userId, categoryId);
        } else {
            budgets = getBudgetService.getBudgets(userId);
        }

        return budgets.stream().map(budget -> new BudgetResponse(
                budget.getId(),
                budget.getCategoryId(),
                budget.getYear(),
                budget.getMonth(),
                budget.getAmount(),
                budget.getCreatedAt()
        )).toList();
    }

    @PutMapping("/{budgetId}")
    public BudgetResponse updateBudget(@PathVariable UUID budgetId, @RequestBody UpdateBudgetRequest budgetRequest, Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();
        Budget budget = updateBudgetService.updateBudget(budgetId, userId, budgetRequest.amount());

        return new BudgetResponse(budget.getId(),
                budget.getCategoryId(),
                budget.getYear(),
                budget.getMonth(),
                budget.getAmount(),
                budget.getCreatedAt());
    }
    @DeleteMapping("/{budgetId}")
    public ResponseEntity<Void> deleteBudget(@PathVariable UUID budgetId, Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();
        deleteBudgetService.deleteBudget(budgetId, userId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/progress")
    public List<BudgetProgressResponse> getBudgetProgress(@RequestParam int year,
                                                          @RequestParam int month,
                                                          Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();
        return getBudgetProgressService.getBudgetProgress(userId, year, month);
    }

}

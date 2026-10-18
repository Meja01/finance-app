package org.example.finance.transactions.infrastructure;

import org.example.finance.transactions.application.CreateCategoryService;
import org.example.finance.transactions.application.DeleteCategoryService;
import org.example.finance.transactions.application.GetCategoryService;
import org.example.finance.transactions.application.UpdateCategoryService;
import org.example.finance.transactions.domain.Category;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.function.EntityResponse;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/categories")
public class CategoryController {
    private final GetCategoryService getCategoryService;
    private final CreateCategoryService createCategoryService;
    private final UpdateCategoryService updateCategoryService;
    private final DeleteCategoryService deleteCategoryService;

    public CategoryController(GetCategoryService getCategoryService, CreateCategoryService createCategoryService, UpdateCategoryService updateCategoryService, DeleteCategoryService deleteCategoryService) {
        this.getCategoryService = getCategoryService;
        this.createCategoryService = createCategoryService;
        this.updateCategoryService = updateCategoryService;
        this.deleteCategoryService = deleteCategoryService;
    }

    @GetMapping
    public List<CategoryResponse> getCategories(Authentication authentication) {
        return getCategoryService.getCategories((UUID) authentication.getPrincipal()).stream().map(category ->
            new CategoryResponse(category.getId() ,category.getName(),category.getType(),category.getUserId(), category.isGlobal())).toList();
    }

    @PostMapping
    public CategoryResponse createCategory(@RequestBody CreateCategoryRequest request, Authentication authentication) {
        Category category = createCategoryService.createCategory((UUID) authentication.getPrincipal(), request.name(), request.type());

        return new CategoryResponse(category.getId(), category.getName(), category.getType() ,category.getUserId() ,category.isGlobal());
    }

    @PutMapping("/{categoryId}")
    public CategoryResponse updateCategory(@PathVariable UUID categoryId, @RequestBody UpdateCategoryRequest request, Authentication authentication) {
        Category category = updateCategoryService.updateCategory(categoryId, (UUID) authentication.getPrincipal(), request.name());

        return new CategoryResponse(category.getId(), category.getName(), category.getType() ,category.getUserId() ,category.isGlobal());
    }

    @DeleteMapping("/{categoryId}")
    public ResponseEntity<Void> deleteCategory(@PathVariable UUID categoryId, Authentication authentication) {
        deleteCategoryService.deleteCategory(categoryId, (UUID) authentication.getPrincipal());

        return ResponseEntity.noContent().build();
    }
}

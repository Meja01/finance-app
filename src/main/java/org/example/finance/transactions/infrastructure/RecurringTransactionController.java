package org.example.finance.transactions.infrastructure;


import org.example.finance.transactions.application.CreateRecurringTransactionService;
import org.example.finance.transactions.application.DeactivateRecurringTransactionService;
import org.example.finance.transactions.application.GetRecurringTransactionsService;
import org.example.finance.transactions.application.UpdateRecurringTransactionService;
import org.example.finance.transactions.domain.RecurringTransaction;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/recurring-transactions")
public class RecurringTransactionController {
    private final CreateRecurringTransactionService createRecurringTransactionService;
    private final GetRecurringTransactionsService getRecurringTransactionsService;
    private final UpdateRecurringTransactionService updateRecurringTransactionService;
    private final DeactivateRecurringTransactionService deactivateRecurringTransactionService;

    public RecurringTransactionController(CreateRecurringTransactionService createRecurringTransactionService, GetRecurringTransactionsService getRecurringTransactionsService, UpdateRecurringTransactionService updateRecurringTransactionService, DeactivateRecurringTransactionService deactivateRecurringTransactionService) {
        this.createRecurringTransactionService = createRecurringTransactionService;
        this.getRecurringTransactionsService = getRecurringTransactionsService;
        this.updateRecurringTransactionService = updateRecurringTransactionService;
        this.deactivateRecurringTransactionService = deactivateRecurringTransactionService;
    }

    @PostMapping
    public RecurringTransactionResponse createRecurringTransaction(@RequestBody CreateRecurringTransactionRequest request, Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();

        RecurringTransaction recurringTransaction = createRecurringTransactionService.createRecurringTransaction(
                userId, request.accountId(), request.categoryId(), request.amount(), request.note(), request.type(),
                request.frequency(), request.startDate(), request.endDate());

        return new RecurringTransactionResponse(
                recurringTransaction.getId(),
                recurringTransaction.getAccountId(),
                recurringTransaction.getCategoryId(),
                recurringTransaction.getAmount(),
                recurringTransaction.getNote(),
                recurringTransaction.getType(),
                recurringTransaction.getFrequency(),
                recurringTransaction.getStartDate(),
                recurringTransaction.getEndDate(),
                recurringTransaction.getNextExecutionDate(),
                recurringTransaction.isActive(),
                recurringTransaction.getCreatedAt()
        );
    }

    @GetMapping
    public List<RecurringTransactionResponse> getRecurringTransactions(Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();
        List<RecurringTransaction> recurringTransactions = getRecurringTransactionsService.getRecurringTransactions(userId);
        return recurringTransactions.stream().map(recurringTransaction ->
                new RecurringTransactionResponse(recurringTransaction.getId(),
                        recurringTransaction.getAccountId(),
                        recurringTransaction.getCategoryId(),
                        recurringTransaction.getAmount(),
                        recurringTransaction.getNote(),
                        recurringTransaction.getType(),
                        recurringTransaction.getFrequency(),
                        recurringTransaction.getStartDate(),
                        recurringTransaction.getEndDate(),
                        recurringTransaction.getNextExecutionDate(),
                        recurringTransaction.isActive(),
                        recurringTransaction.getCreatedAt())).toList();
    }

    @PutMapping("/{recurringTransactionId}")
    public RecurringTransactionResponse updateRecurringTransaction(@PathVariable UUID recurringTransactionId, @RequestBody UpdateRecurringTransactionRequest request, Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();
        RecurringTransaction recurringTransaction = updateRecurringTransactionService.updateRecurringTransaction(
                recurringTransactionId, userId, request.accountId(), request.categoryId(), request.amount(), request.frequency(),
                request.note(), request.endDate(), request.type());

        return new RecurringTransactionResponse(
                recurringTransaction.getId(),
                recurringTransaction.getAccountId(),
                recurringTransaction.getCategoryId(),
                recurringTransaction.getAmount(),
                recurringTransaction.getNote(),
                recurringTransaction.getType(),
                recurringTransaction.getFrequency(),
                recurringTransaction.getStartDate(),
                recurringTransaction.getEndDate(),
                recurringTransaction.getNextExecutionDate(),
                recurringTransaction.isActive(),
                recurringTransaction.getCreatedAt()
        );
    }

    @DeleteMapping("/{recurringTransactionId}")
    public ResponseEntity<Void> deleteRecurringTransaction(@PathVariable UUID recurringTransactionId, Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();
        deactivateRecurringTransactionService.deactivateRecurringTransaction(recurringTransactionId, userId);
        return ResponseEntity.noContent().build();
    }
}

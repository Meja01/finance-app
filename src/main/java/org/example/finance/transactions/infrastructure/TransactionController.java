package org.example.finance.transactions.infrastructure;

import org.example.finance.accounts.application.UpdateAccountService;
import org.example.finance.transactions.application.CreateTransactionService;
import org.example.finance.transactions.application.DeleteTransactionService;
import org.example.finance.transactions.application.GetTransactionService;
import org.example.finance.transactions.application.UpdateTransactionService;
import org.example.finance.transactions.domain.Transaction;
import org.example.finance.transactions.domain.TransactionRepository;
import org.example.finance.transactions.domain.TransactionType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.swing.text.html.parser.Entity;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/transactions")
public class TransactionController {
    private final CreateTransactionService createTransactionService;
    private final GetTransactionService getTransactionService;
    private final UpdateTransactionService updateTransactionService;
    private final DeleteTransactionService deleteTransactionService;

    public TransactionController(CreateTransactionService createTransactionService, GetTransactionService getTransactionService, UpdateTransactionService updateTransactionService, DeleteTransactionService deleteTransactionService) {
        this.createTransactionService = createTransactionService;
        this.getTransactionService = getTransactionService;
        this.updateTransactionService = updateTransactionService;
        this.deleteTransactionService = deleteTransactionService;
    }

    @PostMapping
    public TransactionResponse createTransaction(@RequestBody TransactionRequest request, Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();
        Transaction transaction = createTransactionService.createTransaction(
                userId, request.accountId(), request.categoryId(), request.amount(), request.dateTime(), request.note(), request.type());

        return new TransactionResponse(
                transaction.getId(),
                transaction.getAccountId(),
                transaction.getCategoryId(),
                transaction.getAmount(),
                transaction.getDateTime(),
                transaction.getNote(),
                transaction.getTransactionType(),
                transaction.getCreatedAt()
        );
    }

    @GetMapping
    public List<TransactionResponse> getTransactions(
            @RequestParam(required = false) UUID accountId,
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) LocalDateTime from,
            @RequestParam(required = false) LocalDateTime to,
            Authentication authentication) {

        UUID userId = (UUID) authentication.getPrincipal();
        List<Transaction> transactions;

        if(accountId != null) {
            transactions = getTransactionService.getTransactionsByAccount(userId, accountId);
        } else if (categoryId != null) {
            transactions = getTransactionService.getTransactionsByCategory(userId, categoryId);
        } else if (type != null) {
            transactions = getTransactionService.getTransactionsByTransactionType(userId, type);
        } else if (from != null && to != null) {
            if (from.isAfter(to)) {
                throw new IllegalArgumentException(
                        "'from' must be before 'to'"
                );
            }
            transactions = getTransactionService.getTransactionsByDateTimeBetween(userId, from, to);
        } else {
            transactions = getTransactionService.getTransactions(userId);
        }
        return transactions.stream()
                .map(transaction -> new TransactionResponse(
                        transaction.getId(),
                        transaction.getAccountId(),
                        transaction.getCategoryId(),
                        transaction.getAmount(),
                        transaction.getDateTime(),
                        transaction.getNote(),
                        transaction.getTransactionType(),
                        transaction.getCreatedAt()
                )).toList();
    }

    @GetMapping("/{transactionId}")
    public TransactionResponse getTransaction(@PathVariable UUID transactionId, Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();
        Transaction transaction = getTransactionService.getTransaction(userId, transactionId);

        return new TransactionResponse(
                transaction.getId(),
                transaction.getAccountId(),
                transaction.getCategoryId(),
                transaction.getAmount(),
                transaction.getDateTime(),
                transaction.getNote(),
                transaction.getTransactionType(),
                transaction.getCreatedAt()
        );
    }

    @PutMapping("/{transactionId}")
    public TransactionResponse updateTransaction(@PathVariable UUID transactionId, @RequestBody TransactionRequest request, Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();
        Transaction transaction = updateTransactionService.updateTransaction(
                transactionId,
                userId,
                request.accountId(),
                request.categoryId(),
                request.amount(),
                request.dateTime(),
                request.note(),
                request.type());

        return new TransactionResponse(
                transaction.getId(),
                transaction.getAccountId(),
                transaction.getCategoryId(),
                transaction.getAmount(),
                transaction.getDateTime(),
                transaction.getNote(),
                transaction.getTransactionType(),
                transaction.getCreatedAt()
        );
    }

    @DeleteMapping("/{transactionId}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable UUID transactionId, Authentication authentication) {
        deleteTransactionService.deleteTransaction(transactionId, (UUID) authentication.getPrincipal());
        return ResponseEntity.noContent().build();
    }

}

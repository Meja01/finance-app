package org.example.finance.transactions.domain;

import jakarta.persistence.*;
import net.bytebuddy.asm.Advice;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    private UUID id;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private UUID accountId;

    @Column(nullable = false)
    private UUID categoryId;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private LocalDateTime dateTime;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private String note;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType transactionType;

    protected Transaction() {
    }

    public Transaction(
            UUID userId,
            UUID accountId,
            UUID categoryId,
            BigDecimal amount,
            LocalDateTime dateTime,
            String note,
            TransactionType transactionType
    ) {
        this.id = UUID.randomUUID();
        this.userId = userId;
        this.accountId = accountId;
        this.categoryId = categoryId;
        this.amount = amount;
        this.dateTime = dateTime != null ? dateTime : LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
        this.note = note;
        this.transactionType = transactionType;
    }

    public UUID getId() {
        return id;
    }

    public UUID getUserId() {
        return userId;
    }

    public UUID getAccountId() {
        return accountId;
    }

    public UUID getCategoryId() {
        return categoryId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getNote() {
        return note;
    }

    public TransactionType getTransactionType() {
        return transactionType;
    }

    public void update(
            BigDecimal amount,
            LocalDateTime dateTime,
            String note,
            TransactionType transactionType,
            UUID categoryId
    ) {
        this.amount = amount;
        this.dateTime = dateTime;
        this.note = note;
        this.transactionType = transactionType;
        this.categoryId = categoryId;
    }
}

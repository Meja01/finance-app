package org.example.finance.transactions.domain;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "recurring_transactions")
public class RecurringTransaction {

    @Id
    private UUID id;

    private UUID userId;
    private UUID accountId;
    private UUID categoryId;

    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private TransactionType type;

    private String note;

    @Enumerated(EnumType.STRING)
    private RecurringFrequency frequency;

    private LocalDate startDate;

    private LocalDate endDate; // nullable

    private LocalDate nextExecutionDate;

    private boolean active;

    private LocalDateTime createdAt;

    protected RecurringTransaction() {
    }

    public RecurringTransaction(
            UUID userId,
            UUID accountId,
            UUID categoryId,
            BigDecimal amount,
            TransactionType type,
            String note,
            RecurringFrequency frequency,
            LocalDate startDate,
            LocalDate endDate
    ) {
        this.id = UUID.randomUUID();
        this.userId = userId;
        this.accountId = accountId;
        this.categoryId = categoryId;
        this.amount = amount;
        this.type = type;
        this.note = note;
        this.frequency = frequency;
        this.startDate = startDate;
        this.endDate = endDate;
        this.nextExecutionDate = startDate;
        this.active = true;
        this.createdAt = LocalDateTime.now();
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

    public TransactionType getType() {
        return type;
    }

    public String getNote() {
        return note;
    }

    public RecurringFrequency getFrequency() {
        return frequency;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public LocalDate getNextExecutionDate() {
        return nextExecutionDate;
    }

    public boolean isActive() {
        return active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void update(
            UUID accountId,
            UUID categoryId,
            BigDecimal amount,
            TransactionType type,
            String note,
            RecurringFrequency frequency,
            LocalDate endDate
    ) {
        this.accountId = accountId;
        this.categoryId = categoryId;
        this.amount = amount;
        this.type = type;
        this.note = note;
        this.frequency = frequency;
        this.endDate = endDate;
    }

    public void deactivate() {
        this.active = false;
    }

    public void activate() {
        this.active = true;
    }

    public void moveToNextExecutionDate() {
        switch (frequency) {
            case WEEKLY ->
                    nextExecutionDate = nextExecutionDate.plusWeeks(1);

            case MONTHLY ->
                    nextExecutionDate = nextExecutionDate.plusMonths(1);

            case YEARLY ->
                    nextExecutionDate = nextExecutionDate.plusYears(1);
        }
    }


}

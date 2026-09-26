package org.example.finance.transactions.domain;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "categories")
public class Category {

    @Id
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;

    @Column
    private UUID userId;

    @Column(nullable = false)
    private boolean global;

    protected Category() {
    }

    public Category(
            String name,
            TransactionType type,
            UUID userId,
            boolean global
    ) {
        this.id = UUID.randomUUID();
        this.name = name;
        this.type = type;
        this.userId = userId;
        this.global = global;
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public TransactionType getType() {
        return type;
    }

    public UUID getUserId() {
        return userId;
    }

    public boolean isGlobal() {
        return global;
    }

    public void update(String name) {
        this.name = name;
    }
}

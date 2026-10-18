import type {Account} from "../../types/Account.ts";
import type {Category} from "../../types/Category.ts";
import {useEffect, useState} from "react";
import type {RecurringTransaction} from "../../types/RecurringTransaction.ts";
import RecurringTransactionItem from "./RecurringTransactionItem.tsx";
import CreateRecurringTransactionForm from "./CreateRecurringTransactionForm.tsx";
import EditRecurringTransactionForm from "./EditRecurringTransactionForm.tsx";


type RecurringTransactionSectionProps = {
    accessToken: string,
    accounts: Account[],
    accountsLoaded: boolean
    categories: Category[]
    categoriesLoaded: boolean
}

function RecurringTransactionSection({accessToken, accounts, categories, accountsLoaded, categoriesLoaded}: RecurringTransactionSectionProps) {
    const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([])
    const [showCreateRecurringTransaction, setShowCreateRecurringTransaction] = useState(false)
    const [editingRecurringTransaction, setEditingRecurringTransaction] = useState<RecurringTransaction | null>(null)

    useEffect(() => {
        if (!accessToken) {
            return
        }
        fetch("http://localhost:8080/recurring-transactions", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load recurring transactions: ${response.status}`)
                }
                return response.json()
            })
            .then(data => {
                console.log(data)
                setRecurringTransactions(data)
            })
            .catch(error => {
                console.error("Failed to load recurring-transactions:", error)
            })
    }, [accessToken])


    async function handleCreateRecurringTransaction(
        accountId: string,
        categoryId: string,
        amount: number,
        note: string | null,
        type: "INCOME" | "EXPENSE",
        frequency: "WEEKLY" | "MONTHLY" | "YEARLY",
        startDate: string,
        endDate: string | null
    ) {
        const response = await fetch(
            "http://localhost:8080/recurring-transactions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    accountId,
                    categoryId,
                    amount,
                    note,
                    type,
                    frequency,
                    startDate,
                    endDate
                })
            }
        )

        if (!response.ok) {
            const errorMessage = await response.text()
            console.error(
                "Failed to create recurring transaction:",
                errorMessage
            )
            return
        }

        const createdRecurringTransaction = await response.json()

        setRecurringTransactions([...recurringTransactions, createdRecurringTransaction])
        setShowCreateRecurringTransaction(false)
    }

    async function handleUpdateRecurringTransaction(
        recurringTransactionId: string,
        accountId: string,
        categoryId: string,
        amount: number,
        note: string | null,
        type: "INCOME" | "EXPENSE",
        frequency: "WEEKLY" | "MONTHLY" | "YEARLY",
        endDate: string | null
    ) {
        const response = await fetch(
            `http://localhost:8080/recurring-transactions/${recurringTransactionId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    accountId,
                    categoryId,
                    amount,
                    note,
                    type,
                    frequency,
                    endDate
                })
            }
        )

        if (!response.ok) {
            const errorMessage = await response.text()
            console.error(
                "Failed to update recurring transaction:",
                errorMessage
            )
            return
        }

        const updatedRecurringTransaction = await response.json()
        setRecurringTransactions(recurringTransactions.map(recurringTransaction => recurringTransaction.id === recurringTransactionId ? updatedRecurringTransaction : recurringTransaction))

    }

    function handleEditRecurringTransaction(recurringTransaction: RecurringTransaction) {
        setEditingRecurringTransaction(recurringTransaction)
        setShowCreateRecurringTransaction(false)
    }

    async function handleDeactivateRecurringTransaction(recurringTransactionId: string) {
        const response = await fetch(
            `http://localhost:8080/recurring-transactions/${recurringTransactionId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        if (!response.ok) {
            const errorMessage = await response.text()
            console.error("Failed to deactivate recurring transaction:", errorMessage)
            return
        }

        setRecurringTransactions(
            recurringTransactions.map(recurringTransaction =>
                recurringTransaction.id === recurringTransactionId
                    ? {
                        ...recurringTransaction,
                        active: false
                    }
                    : recurringTransaction
            )
        )
    }

    if (!accountsLoaded || !categoriesLoaded) {
        return (
            <section>
                <h2>Recurring Transactions</h2>
                <p>Loading...</p>
            </section>
        )
    }

    return (
        <section>
            <h2>Recurring Transactions</h2>

            <div>
                <button
                    onClick={() => {
                        setShowCreateRecurringTransaction(true)
                        setEditingRecurringTransaction(null)
                    }}
                >
                    Create recurring transaction
                </button>
            </div>

            <div>
                {showCreateRecurringTransaction && (
                    <CreateRecurringTransactionForm
                        accounts={accounts}
                        categories={categories}
                        onCreate={handleCreateRecurringTransaction}
                        onCancel={() => setShowCreateRecurringTransaction(false)}
                    />
                )}

                {editingRecurringTransaction && (
                    <EditRecurringTransactionForm
                        recurringTransaction={editingRecurringTransaction}
                        accounts={accounts}
                        categories={categories}
                        onUpdate={handleUpdateRecurringTransaction}
                        onCancel={() => setEditingRecurringTransaction(null)}
                    />
                )}
            </div>

            <div>
                {recurringTransactions.map(recurringTransaction => {
                    const account = accounts.find(
                        account => account.id === recurringTransaction.accountId)
                    if (!account) {
                        throw new Error(`Account not found for recurring transaction ${recurringTransaction.id}`)
                    }
                    const category = categories.find(
                        category => category.id === recurringTransaction.categoryId)
                    if (!category) {
                        throw new Error(
                            `Category not found for recurring transaction ${recurringTransaction.id}`
                        )
                    }
                    return (
                        <RecurringTransactionItem
                            key={recurringTransaction.id}
                            recurringTransaction={recurringTransaction}
                            accountName={account.name}
                            categoryName={category.name}
                            onEdit={handleEditRecurringTransaction}
                            onDeactivate={handleDeactivateRecurringTransaction}
                        />
                    )
                })}
            </div>
        </section>

    )
}

export default RecurringTransactionSection
import type {Account} from "../../types/Account.ts";
import type {Category} from "../../types/Category.ts";
import {useEffect, useState} from "react";
import type {RecurringTransaction} from "../../types/RecurringTransaction.ts";
import RecurringTransactionItem from "./RecurringTransactionItem.tsx";
import CreateRecurringTransactionForm from "./CreateRecurringTransactionForm.tsx";
import EditRecurringTransactionForm from "./EditRecurringTransactionForm.tsx";
import {useTranslation} from "react-i18next";
import {getCategoryDisplayName} from "../utils/getCategoryDisplayName.ts";


type RecurringTransactionSectionProps = {
    accessToken: string,
    accounts: Account[],
    accountsLoaded: boolean
    categories: Category[]
    categoriesLoaded: boolean,
    categoriesError: string | null,
    accountsError: string | null
}

function RecurringTransactionSection({accessToken, accounts, categories, accountsLoaded, categoriesLoaded, categoriesError, accountsError}: RecurringTransactionSectionProps) {
    const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([])
    const [showCreateRecurringTransaction, setShowCreateRecurringTransaction] = useState(false)
    const [editingRecurringTransaction, setEditingRecurringTransaction] = useState<RecurringTransaction | null>(null)
    const { t } = useTranslation()
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string | null>(null)
    const [actionError, setActionError] = useState<string | null>(null)

    useEffect(() => {
        if (!accessToken) {
            return
        }

        async function loadRecurringTransactions() {
            setIsLoading(true)
            setLoadError(null)

            try {
                const response = await fetch(
                    "http://localhost:8080/recurring-transactions",
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }
                )

                if (!response.ok) {
                    setLoadError(t("recurring.loadError"))
                    return
                }

                const data = await response.json()
                setRecurringTransactions(data)

            } catch (error) {
                console.error(
                    "Failed to load recurring transactions:",
                    error
                )
                setLoadError(t("recurring.loadError"))

            } finally {
                setIsLoading(false)
            }
        }

        void loadRecurringTransactions()

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
    ): Promise<boolean> {
        setActionError(null)

        try {
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
                setActionError(t("recurring.actionError"))
                return false
            }

            const createdRecurringTransaction = await response.json()
            setRecurringTransactions([...recurringTransactions, createdRecurringTransaction])
            setShowCreateRecurringTransaction(false)
            return true

        } catch (error) {
            console.error("Failed to create recurring transaction:", error)
            setActionError(t("recurring.actionError"))
            return false
        }
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
    ): Promise<boolean> {
        setActionError(null)

        try {
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
                setActionError(t("recurring.actionError"))
                return false
            }

            const updatedRecurringTransaction = await response.json()
            setRecurringTransactions(
                recurringTransactions.map(recurringTransaction =>
                    recurringTransaction.id === recurringTransactionId
                        ? updatedRecurringTransaction
                        : recurringTransaction
                )
            )
            return true

        } catch (error) {
            console.error("Failed to update recurring transaction:", error)
            setActionError(t("recurring.actionError"))
            return false
        }
    }

    function handleEditRecurringTransaction(recurringTransaction: RecurringTransaction) {
        setEditingRecurringTransaction(recurringTransaction)
        setShowCreateRecurringTransaction(false)
    }

    async function handleDeactivateRecurringTransaction(
        recurringTransactionId: string
    ) {
        setActionError(null)

        try {
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
                setActionError(t("recurring.actionError"))
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

        } catch (error) {
            console.error("Failed to deactivate recurring transaction:", error)
            setActionError(t("recurring.actionError"))
        }
    }

    if (!accountsLoaded || !categoriesLoaded) {
        return (
            <section>
                <h2>{t("recurring.title")}</h2>
                <p>{t("common.loading")}</p>
            </section>
        )
    }

    if (categoriesError) {
        return (
            <section>
                <h2>{t("recurring.title")}</h2>
                <p>{categoriesError}</p>
            </section>
        )
    }

    if (accountsError) {
        return (
            <section>
                <h2>{t("recurring.title")}</h2>
                <p>{accountsError}</p>
            </section>
        )
    }

    if (isLoading) {
        return (
            <section>
                <h2>{t("recurring.title")}</h2>
                <p>{t("common.loading")}</p>
            </section>
        )
    }

    if (loadError) {
        return (
            <section>
                <h2>{t("recurring.title")}</h2>
                <p>{loadError}</p>
            </section>
        )
    }

    return (
        <section>
            <h2>{t("recurring.title")}</h2>

            <div>
                <button
                    onClick={() => {
                        setShowCreateRecurringTransaction(true)
                        setEditingRecurringTransaction(null)
                    }}
                >
                    {t("recurring.create")}
                </button>
            </div>

            {actionError && (
                <p>{actionError}</p>
            )}

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
                {recurringTransactions.length === 0 ? (
                    <p>{t("recurring.empty")}</p>
                ) : (
                    recurringTransactions.map(recurringTransaction => {
                        const account = accounts.find(
                            account => account.id === recurringTransaction.accountId
                        )

                        if (!account) {
                            throw new Error(
                                `Account not found for recurring transaction ${recurringTransaction.id}`
                            )
                        }

                        const category = categories.find(
                            category => category.id === recurringTransaction.categoryId
                        )

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
                                categoryName={getCategoryDisplayName(category, t)}
                                onEdit={handleEditRecurringTransaction}
                                onDeactivate={handleDeactivateRecurringTransaction}
                            />
                        )
                    })
                )}
            </div>
        </section>
    )
}

export default RecurringTransactionSection
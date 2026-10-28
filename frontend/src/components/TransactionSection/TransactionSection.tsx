import type {Account} from "../../types/Account.ts";
import {useEffect, useState} from "react";
import type {Transaction} from "../../types/Transaction.ts";
import TransactionItem from "./TransactionItem.tsx";
import type {Category} from "../../types/Category.ts";
import CreateTransactionForm from "./CreateTransactionForm.tsx";
import EditTransactionForm from "./EditTransactionForm.tsx";
import {useTranslation} from "react-i18next";
import {getCategoryDisplayName} from "../utils/getCategoryDisplayName.ts";
import {useAuth} from "../../auth/useAuth.ts";
import {API_URL} from "../../config/api.ts";

type TransactionSectionProps = {
    accounts: Account[],
    accountsLoaded: boolean
    categories: Category[],
    categoriesLoaded: boolean,
    categoriesError: string | null,
    accountsError: string | null
}

function TransactionSection({accounts, accountsLoaded, categories, categoriesLoaded, categoriesError, accountsError} : TransactionSectionProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [showCreateTransaction, setShowCreateTransaction] = useState(false)
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
    const [filterAccountId, setFilterAccountId] = useState("")
    const [filterCategoryId, setFilterCategoryId] = useState("")
    const [filterType, setFilterType] = useState<"" | "INCOME" | "EXPENSE">("")
    const [from, setFrom] = useState("")
    const [to, setTo] = useState("")
    const { t } = useTranslation()
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string | null>(null)
    const [actionError, setActionError] = useState<string | null>(null)
    const { accessToken, apiFetch } = useAuth()

    useEffect(() => {
        if (!accessToken) {
            return
        }

        async function loadTransactions() {
            setIsLoading(true)
            setLoadError(null)

            let url = `${API_URL}/transactions`

            if (filterAccountId) {
                url += `?accountId=${filterAccountId}`
            } else if (filterCategoryId) {
                url += `?categoryId=${filterCategoryId}`
            } else if (filterType) {
                url += `?type=${filterType}`
            } else if (from && to) {
                url += `?from=${from}&to=${to}`
            }

            try {
                const response = await apiFetch(url)

                if (!response.ok) {
                    setLoadError(t("transactions.loadError"))
                    return
                }

                const data = await response.json()
                setTransactions(data)

            } catch (error) {
                console.error(error)
                setLoadError(t("transactions.loadError"))

            } finally {
                setIsLoading(false)
            }
        }

        void loadTransactions()

    }, [accessToken, filterAccountId, filterCategoryId, filterType, from, to])

    async function handleCreateTransaction(
        accountId: string,
        categoryId: string,
        amount: number,
        dateTime: string,
        note: string | null,
        transactionType: "INCOME" | "EXPENSE"
    ): Promise<boolean> {
        setActionError(null)
        try {
            const response = await apiFetch(`${API_URL}/transactions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    accountId,
                    categoryId,
                    amount,
                    dateTime,
                    note,
                    type: transactionType
                })
            })

            if (!response.ok) {
                setActionError(t("transactions.actionError"))
                return false
            }

            const createdTransaction = await response.json()
            setTransactions([...transactions, createdTransaction])
            setShowCreateTransaction(false)
            return true
        }
        catch (error) {
            console.error(error)
            setActionError(t("transactions.actionError"))
            return false
        }
    }

    async function handleDeleteTransaction(transactionId: string) {
        setActionError(null)
        try {
            const response = await apiFetch(
                `${API_URL}/transactions/${transactionId}`,
                {
                    method: "DELETE",
                }
            )
            if (!response.ok) {
                setActionError(t("transactions.actionError"))
                return
            }
            setTransactions(transactions.filter(
                transaction => transaction.id !== transactionId)
            )
        } catch (error) {
            console.error(error)
            setActionError(t("transactions.actionError"))
        }
    }

    async function handleUpdateTransaction(
        transactionId: string,
        accountId: string,
        categoryId: string,
        amount: number,
        dateTime: string,
        note: string | null,
        transactionType: "INCOME" | "EXPENSE"): Promise<boolean> {
        setActionError(null)

        try {
            const response = await apiFetch(`${API_URL}/transactions/${transactionId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    transactionId,
                    accountId,
                    categoryId,
                    amount,
                    dateTime,
                    note,
                    type: transactionType
                })
            })

            if (!response.ok) {
                setActionError(t("transactions.actionError"))
                return false
            }

            const updatedTransaction = await response.json()
            setTransactions(transactions.map(transaction => transaction.id === transactionId ? updatedTransaction : transaction))
            return true
        }
        catch (error) {
            console.error(error)
            setActionError(t("transactions.actionError"))
            return false
        }
    }

    function handleEditTransaction(transaction: Transaction) {
        setEditingTransaction(transaction)
        setShowCreateTransaction(false)
    }

    const actionsDisabled = showCreateTransaction || editingTransaction !== null

    if (!accountsLoaded || !categoriesLoaded) {
        return (
            <section>
                <h2>{t("transactions.title")}</h2>
                <p>{t("common.loading")}</p>
            </section>
        )
    }

    if (accountsError) {
        return (
            <section>
                <h2>{t("transactions.title")}</h2>
                <p>{accountsError}</p>
            </section>
        )
    }

    if (categoriesError) {
        return (
            <section>
                <h2>{t("transactions.title")}</h2>
                <p>{categoriesError}</p>
            </section>
        )
    }

    if (isLoading) {
        return (
            <section>
                <h2>{t("transactions.title")}</h2>
                <p>{t("common.loading")}</p>
            </section>
        )
    }

    if (loadError) {
        return (
            <section>
                <h2>{t("transactions.title")}</h2>
                <p className="error-message">
                    {loadError}
                </p>
            </section>
        )
    }

    return (
        <section>
            <div className="page-header">
                <h2>{t("transactions.title")}</h2>

                {!showCreateTransaction && !editingTransaction && (
                    <button
                        className="button button-primary"
                        onClick={() => {
                            setShowCreateTransaction(true)
                            setEditingTransaction(null)
                        }}
                    >
                        {t("transactions.create")}
                    </button>
                )}
            </div>

            <div className="card transaction-filters">
                <h3>{t("transactions.filters")}</h3>

                <div className="transaction-filter-controls">

                    <div className="form-group">
                        <label htmlFor="transaction-accounts">
                            {t("transactions.account")}
                        </label>

                        <select
                            id="transaction-accounts"
                            className="form-control"
                            value={filterAccountId}
                            onChange={event => {
                                setFilterAccountId(event.target.value)
                                setFilterCategoryId("")
                                setFilterType("")
                                setFrom("")
                                setTo("")
                            }}
                        >
                            <option value="">{t("transactions.allAccounts")}</option>

                            {accounts.map(account => (
                                <option key={account.id} value={account.id}>
                                    {account.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="transaction-categories">
                            {t("transactions.category")}
                        </label>

                        <select
                            id="transaction-categories"
                            className="form-control"
                            value={filterCategoryId}
                            onChange={event => {
                                setFilterCategoryId(event.target.value)
                                setFilterAccountId("")
                                setFilterType("")
                                setFrom("")
                                setTo("")
                            }}
                        >
                            <option value="">{t("transactions.allCategories")}</option>

                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {getCategoryDisplayName(category, t)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="transaction-type">
                            {t("transactions.type")}
                        </label>

                        <select
                            id="transaction-type"
                            className="form-control"
                            value={filterType}
                            onChange={event => {
                                setFilterType(
                                    event.target.value as "" | "INCOME" | "EXPENSE"
                                )

                                setFilterAccountId("")
                                setFilterCategoryId("")
                                setFrom("")
                                setTo("")
                            }}
                        >
                            <option value="">{t("transactions.allTypes")}</option>
                            <option value="INCOME">{t("common.income")}</option>
                            <option value="EXPENSE">{t("common.expense")}</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="transaction-from">
                            {t("transactions.from")}
                        </label>

                        <input
                            id="transaction-from"
                            className="form-control"
                            type="datetime-local"
                            value={from}
                            onChange={event => {
                                setFrom(event.target.value)

                                setFilterAccountId("")
                                setFilterCategoryId("")
                                setFilterType("")
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="transaction-to">
                            {t("transactions.to")}
                        </label>

                        <input
                            id="transaction-to"
                            className="form-control"
                            type="datetime-local"
                            value={to}
                            onChange={event => {
                                setTo(event.target.value)

                                setFilterAccountId("")
                                setFilterCategoryId("")
                                setFilterType("")
                            }}
                        />
                    </div>

                    <div className="filter-actions">
                        <button
                            type="button"
                            className="button button-secondary"
                            onClick={() => {
                                setFilterAccountId("")
                                setFilterCategoryId("")
                                setFilterType("")
                                setFrom("")
                                setTo("")
                            }}
                        >
                            {t("transactions.clearFilters")}
                        </button>
                    </div>
                </div>
            </div>

            {actionError && (
                <p className="error-message">
                    {actionError}
                </p>
            )}

            {showCreateTransaction && (
                <div className="card form-card">
                    <CreateTransactionForm
                        onCreate={handleCreateTransaction}
                        categories={categories}
                        accounts={accounts}
                        onCancel={() => setShowCreateTransaction(false)}
                    />
                </div>
            )}

            {editingTransaction && (
                <div className="card form-card">
                    <EditTransactionForm
                        transaction={editingTransaction}
                        onUpdate={handleUpdateTransaction}
                        categories={categories}
                        accounts={accounts}
                        onCancel={() => setEditingTransaction(null)}
                    />
                </div>
            )}

            <div className="transaction-list-section">
                <h3>{t("transactions.list")}</h3>

                <div className="transaction-list">
                    {transactions.length === 0 ? (
                        <p>{t("transactions.empty")}</p>
                    ) : (
                        transactions.map(transaction => {
                            const account = accounts.find(
                                account => account.id === transaction.accountId
                            )

                            if (!account) {
                                throw new Error(
                                    `Account not found for transaction ${transaction.id}`
                                )
                            }

                            const category = categories.find(
                                category => category.id === transaction.categoryId
                            )

                            if (!category) {
                                throw new Error(
                                    `Category not found for transaction ${transaction.id}`
                                )
                            }

                            return (
                                <TransactionItem
                                    key={transaction.id}
                                    transaction={transaction}
                                    accountName={account.name}
                                    categoryName={getCategoryDisplayName(category, t)}
                                    onDelete={handleDeleteTransaction}
                                    onEdit={handleEditTransaction}
                                    actionsDisabled={actionsDisabled}
                                />
                            )
                        })
                    )}
                </div>
            </div>
        </section>
    )
}

export default TransactionSection
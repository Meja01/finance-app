import type {Account} from "../../types/Account.ts";
import {useEffect, useState} from "react";
import type {Transaction} from "../../types/Transaction.ts";
import TransactionItem from "./TransactionItem.tsx";
import type {Category} from "../../types/Category.ts";
import CreateTransactionForm from "./CreateTransactionForm.tsx";
import EditTransactionForm from "./EditTransactionForm.tsx";
import CreateCategoryForm from "./Categories/CreateCategoryForm.tsx";
import CategoryItem from "./Categories/CategoryItem.tsx";
import EditCategoryForm from "./Categories/EditCategoryForm.tsx";
import {useTranslation} from "react-i18next";
import {getCategoryDisplayName} from "../utils/getCategoryDisplayName.ts";

type TransactionSectionProps = {
    accessToken: string,
    accounts: Account[],
    accountsLoaded: boolean
    categories: Category[],
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>
    categoriesLoaded: boolean
}

function TransactionSection({accessToken, accounts, accountsLoaded, categories, setCategories, categoriesLoaded} : TransactionSectionProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [showCreateTransaction, setShowCreateTransaction] = useState(false)
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
    const [showCreateCategory, setShowCreateCategory] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [filterAccountId, setFilterAccountId] = useState("")
    const [filterCategoryId, setFilterCategoryId] = useState("")
    const [filterType, setFilterType] = useState<"" | "INCOME" | "EXPENSE">("")
    const [from, setFrom] = useState("")
    const [to, setTo] = useState("")
    const { t } = useTranslation()

    useEffect(() => {
        if (!accessToken) {
            return
        }

        let url = "http://localhost:8080/transactions"

        if (filterAccountId) {
            url += `?accountId=${filterAccountId}`
        } else if (filterCategoryId) {
            url += `?categoryId=${filterCategoryId}`
        } else if (filterType) {
            url += `?type=${filterType}`
        } else if (from && to) {
            url += `?from=${from}&to=${to}`
        }

        fetch(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(
                        `Failed to load transactions: ${response.status}`
                    )
                }
                return response.json()
            })
            .then(data => {
                setTransactions(data)
            })
            .catch(error => {
                console.error("Failed to load transactions:", error)
            })

    }, [accessToken, filterAccountId, filterCategoryId, filterType, from, to])

    async function handleCreateTransaction(
        accountId: string,
        categoryId: string,
        amount: number,
        dateTime: string,
        note: string | null,
        transactionType: "INCOME" | "EXPENSE"
    ) {
        const response = await fetch("http://localhost:8080/transactions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
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
            const errorMessage = await response.text()
            console.error("Backend error:", errorMessage)
            return
        }

        const createdTransaction = await response.json()
        console.log("transaction data:", createdTransaction)
        setTransactions([...transactions, createdTransaction])
        setShowCreateTransaction(false)
    }

    async function handleDeleteTransaction(
        transactionId: string
    ) {
        await fetch(
            `http://localhost:8080/transactions/${transactionId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )
        setTransactions(transactions.filter(transaction => transaction.id !== transactionId))
    }

    async function handleUpdateTransaction(
        transactionId: string,
        accountId: string,
        categoryId: string,
        amount: number,
        dateTime: string,
        note: string | null,
        transactionType: "INCOME" | "EXPENSE") {

        const response = await fetch(`http://localhost:8080/transactions/${transactionId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
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

        const updatedTransaction = await response.json()

        setTransactions(transactions.map(transaction => transaction.id === transactionId ? updatedTransaction : transaction))

    }

    function handleEditTransaction(transaction: Transaction) {
        setEditingTransaction(transaction)
        setShowCreateTransaction(false)
    }

    if (!accountsLoaded || !categoriesLoaded) {
        return (
            <section>
                <h2>Transactions</h2>
                <p>Loading...</p>
            </section>
        )
    }

    async function handleCreateCategory(name: string, type: "INCOME" | "EXPENSE") {
        const response = await fetch("http://localhost:8080/categories", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                name,
                type
            })
        })
        if (!response.ok) {
            const errorMessage = await response.text()
            console.error("Failed to create category:", errorMessage)
            return
        }
        const createdCategory = await response.json()
        setCategories([...categories, createdCategory])
        setShowCreateCategory(false)
    }

    async function handleUpdateCategory(categoryId: string, name: string) {

        const response = await fetch(`http://localhost:8080/categories/${categoryId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                name
            })
        })
        if (!response.ok) {
            const errorMessage = await response.text()
            console.error("Failed to update category:", errorMessage)
            return
        }
        const updatedCategory = await response.json()
        setCategories(categories.map(category => category.id === categoryId ? updatedCategory : category))

    }

    async function handleDeleteCategory(categoryId: string) {
        const response = await fetch(
            `http://localhost:8080/categories/${categoryId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        if (!response.ok) {
            const errorMessage = await response.text()
            console.error("Failed to delete category:", errorMessage)
            return
        }

        setCategories(categories.filter(category => category.id !== categoryId))
    }

    function handleEditCategory(category: Category) {
        setEditingCategory(category)
    }

    const actionsDisabled = showCreateTransaction || editingTransaction !== null

    return (
        <section>
            <h2>{t("transactions.title")}</h2>

            <div>
                <h3>{t("transactions.filters")}</h3>

                <select
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

                <select
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

                <select
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

                <input
                    type="datetime-local"
                    value={from}
                    onChange={event => {
                        setFrom(event.target.value)

                        setFilterAccountId("")
                        setFilterCategoryId("")
                        setFilterType("")
                    }}
                />

                <input
                    type="datetime-local"
                    value={to}
                    onChange={event => {
                        setTo(event.target.value)

                        setFilterAccountId("")
                        setFilterCategoryId("")
                        setFilterType("")
                    }}
                />

                <button
                    type="button"
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

            <div>
                <h3>{t("transactions.actions")}</h3>

                <button
                    onClick={() => {
                        setShowCreateTransaction(true)
                        setEditingTransaction(null)
                    }}
                >
                    {t("transactions.create")}
                </button>
            </div>

            <div>
                {showCreateTransaction && (
                    <CreateTransactionForm
                        onCreate={handleCreateTransaction}
                        categories={categories}
                        accounts={accounts}
                        onCancel={() => setShowCreateTransaction(false)}
                    />
                )}

                {editingTransaction && (
                    <EditTransactionForm
                        transaction={editingTransaction}
                        onUpdate={handleUpdateTransaction}
                        categories={categories}
                        accounts={accounts}
                        onCancel={() => setEditingTransaction(null)}
                    />
                )}
            </div>

            <div>
                <h3>{t("transactions.list")}</h3>

                {transactions.map(transaction => {
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
                })}
            </div>

            <div>
                <h3>{t("transactions.categories.title")}</h3>

                <div>
                    <button
                        onClick={() => setShowCreateCategory(true)}
                    >
                        {t("transactions.categories.create")}
                    </button>
                </div>

                <div>
                    {showCreateCategory && (
                        <CreateCategoryForm
                            onCreate={handleCreateCategory}
                            onCancel={() => setShowCreateCategory(false)}
                        />
                    )}

                    {editingCategory && (
                        <EditCategoryForm
                            category={editingCategory}
                            onUpdate={handleUpdateCategory}
                            onCancel={() => setEditingCategory(null)}
                        />
                    )}
                </div>

                <div>
                    {categories.map(category => (
                        <CategoryItem
                            key={category.id}
                            category={category}
                            onEdit={handleEditCategory}
                            onDelete={handleDeleteCategory}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default TransactionSection
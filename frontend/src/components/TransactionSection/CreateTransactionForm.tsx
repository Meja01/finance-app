import type {Category} from "../../types/Category.ts";
import type {Account} from "../../types/Account.ts";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {getCategoryDisplayName} from "../utils/getCategoryDisplayName.ts";

type CreateTransactionFormProps = {
    categories: Category[],
    accounts: Account[],
    onCreate: (
        accountId: string,
        categoryId: string,
        amount: number,
        dateTime: string,
        note: string | null,
        transactionType: "INCOME" | "EXPENSE"
    ) => Promise<void>
    onCancel: () => void
}

function CreateTransactionForm({categories, accounts, onCreate, onCancel} : CreateTransactionFormProps) {
    const [accountId, setAccountId] = useState("")
    const [categoryId, setCategoryId] = useState("")
    const [transactionType, setTransactionType] = useState<"INCOME" | "EXPENSE">("EXPENSE")
    const [note, setNote] = useState("")
    const [dateTime, setDateTime] = useState("")
    const [amount, setAmount] = useState("")
    const { t } = useTranslation()

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        await onCreate(
            accountId,
            categoryId,
            Number(amount),
            dateTime,
            note,
            transactionType
        )

        setAccountId("")
        setCategoryId("")
        setTransactionType("EXPENSE")
        setNote("")
        setDateTime("")
        setAmount("")
    }
    return (
        <form onSubmit={handleSubmit}>
            <select
                value={accountId}
                onChange={event => setAccountId(event.target.value)}
                required
            >
                <option value="">{t("transactions.selectAccount")}</option>

                {accounts.map(account => (
                    <option
                        key={account.id}
                        value={account.id}
                    >
                        {account.name}
                    </option>
                ))}
            </select>

            <select
                value={categoryId}
                onChange={event => setCategoryId(event.target.value)}
                required
            >
                <option value="">{t("transactions.selectCategory")}</option>

                {categories
                    .filter(category => category.type === transactionType)
                    .map(category => (
                        <option
                            key={category.id}
                            value={category.id}
                        >
                            {getCategoryDisplayName(category, t)}
                        </option>
                    ))}
            </select>

            <input
                type="datetime-local"
                value={dateTime}
                onChange={event => setDateTime(event.target.value)}
                required
            />

            <select
                value={transactionType}
                onChange={event => {
                    setTransactionType(
                        event.target.value as "INCOME" | "EXPENSE"
                    )
                    setCategoryId("")
                }}
            >
                <option value="INCOME">{t("common.income")}</option>
                <option value="EXPENSE">{t("common.expense")}</option>
            </select>

            <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder={t("transactions.amount")}
                value={amount}
                onChange={event => setAmount(event.target.value)}
                required
            />

            <input
                type="text"
                placeholder={t("transactions.note")}
                value={note}
                onChange={event => setNote(event.target.value)}
            />

            <button type="submit">{t("transactions.create")}</button>

            <button
                type="button"
                onClick={onCancel}
            >
                {t("common.cancel")}
            </button>
        </form>
    )
}

export default CreateTransactionForm
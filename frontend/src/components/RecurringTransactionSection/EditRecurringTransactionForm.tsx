import { useState } from "react"
import type { Account } from "../../types/Account"
import type { Category } from "../../types/Category"
import type {RecurringTransaction} from "../../types/RecurringTransaction.ts";
import {useTranslation} from "react-i18next";
import {getCategoryDisplayName} from "../utils/getCategoryDisplayName.ts";

type EditRecurringTransactionFormProps = {
    recurringTransaction: RecurringTransaction,
    accounts: Account[]
    categories: Category[]
    onUpdate: (
        recurringTransactionId: string,
        accountId: string,
        categoryId: string,
        amount: number,
        note: string | null,
        type: "INCOME" | "EXPENSE",
        frequency: "WEEKLY" | "MONTHLY" | "YEARLY",
        endDate: string | null
    ) => Promise<void>
    onCancel: () => void
}

function EditRecurringTransactionForm({recurringTransaction, accounts, categories, onUpdate, onCancel} : EditRecurringTransactionFormProps) {
    const [accountId, setAccountId] = useState(recurringTransaction.accountId)
    const [categoryId, setCategoryId] = useState(recurringTransaction.categoryId)
    const [amount, setAmount] = useState(recurringTransaction.amount.toString())
    const [type, setType] = useState<"INCOME" | "EXPENSE">(recurringTransaction.type)
    const [note, setNote] = useState(recurringTransaction.note ?? "")
    const [frequency, setFrequency] = useState<"WEEKLY" | "MONTHLY" | "YEARLY">(recurringTransaction.frequency)
    const [endDate, setEndDate] = useState(recurringTransaction.endDate ?? "")
    const { t } = useTranslation()

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault()

        await onUpdate(
            recurringTransaction.id,
            accountId,
            categoryId,
            Number(amount),
            note === "" ? null : note,
            type,
            frequency,
            endDate === "" ? null : endDate
        )

        onCancel()
    }

    return (
        <form onSubmit={handleSubmit}>
            <select
                value={accountId}
                onChange={event => setAccountId(event.target.value)}
                required
            >
                <option value="">{t("recurring.selectAccount")}</option>

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
                value={type}
                onChange={event => {
                    setType(
                        event.target.value as "INCOME" | "EXPENSE"
                    )

                    setCategoryId("")
                }}
            >
                <option value="INCOME">{t("common.income")}</option>
                <option value="EXPENSE">{t("common.expense")}</option>
            </select>

            <select
                value={categoryId}
                onChange={event => setCategoryId(event.target.value)}
                required
            >
                <option value="">{t("recurring.selectCategory")}</option>

                {categories
                    .filter(category => category.type === type)
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
                type="number"
                step="0.01"
                min="0.01"
                placeholder={t("recurring.amount")}
                value={amount}
                onChange={event => setAmount(event.target.value)}
                required
            />

            <input
                type="text"
                placeholder={t("recurring.note")}
                value={note}
                onChange={event => setNote(event.target.value)}
            />

            <select
                value={frequency}
                onChange={event =>
                    setFrequency(
                        event.target.value as
                            | "WEEKLY"
                            | "MONTHLY"
                            | "YEARLY"
                    )
                }
            >
                <option value="WEEKLY">{t("recurring.weekly")}</option>
                <option value="MONTHLY">{t("recurring.monthly")}</option>
                <option value="YEARLY">{t("recurring.yearly")}</option>
            </select>

            <label>
                {t("recurring.endDate")}
                <input
                    type="date"
                    value={endDate}
                    onChange={event => setEndDate(event.target.value)}
                />
            </label>

            <button type="submit">
                {t("recurring.update")}
            </button>

            <button
                type="button"
                onClick={onCancel}
            >
                {t("common.cancel")}
            </button>
        </form>
    )

}

export default EditRecurringTransactionForm
import { useState } from "react"
import type { Account } from "../../types/Account"
import type { Category } from "../../types/Category"
import {useTranslation} from "react-i18next";
import {getCategoryDisplayName} from "../utils/getCategoryDisplayName.ts";

type CreateRecurringTransactionFormProps = {
    accounts: Account[]
    categories: Category[]
    onCreate: (
        accountId: string,
        categoryId: string,
        amount: number,
        note: string | null,
        type: "INCOME" | "EXPENSE",
        frequency: "WEEKLY" | "MONTHLY" | "YEARLY",
        startDate: string,
        endDate: string | null
    ) => Promise<boolean>
    onCancel: () => void
}

function CreateRecurringTransactionForm({accounts, categories, onCreate, onCancel}: CreateRecurringTransactionFormProps) {
    const [accountId, setAccountId] = useState("")
    const [categoryId, setCategoryId] = useState("")
    const [amount, setAmount] = useState("")
    const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE")
    const [note, setNote] = useState("")
    const [frequency, setFrequency] = useState<"WEEKLY" | "MONTHLY" | "YEARLY">("MONTHLY")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const { t } = useTranslation()

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault()

        const success = await onCreate(
            accountId,
            categoryId,
            Number(amount),
            note === "" ? null : note,
            type,
            frequency,
            startDate,
            endDate === "" ? null : endDate
        )

        if (success) {
            setAccountId("")
            setCategoryId("")
            setAmount("")
            setType("EXPENSE")
            setNote("")
            setFrequency("MONTHLY")
            setStartDate("")
            setEndDate("")
        }
    }

    return (
        <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="recurring-account">
                    {t("recurring.account")}
                </label>

                <select
                    id="recurring-account"
                    className="form-control"
                    value={accountId}
                    onChange={event => setAccountId(event.target.value)}
                    required
                >
                    <option value="">
                        {t("recurring.selectAccount")}
                    </option>

                    {accounts.map(account => (
                        <option
                            key={account.id}
                            value={account.id}
                        >
                            {account.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="recurring-type">
                    {t("recurring.type")}
                </label>

                <select
                    id="recurring-type"
                    className="form-control"
                    value={type}
                    onChange={event => {
                        setType(
                            event.target.value as "INCOME" | "EXPENSE"
                        )

                        setCategoryId("")
                    }}
                >
                    <option value="INCOME">
                        {t("common.income")}
                    </option>

                    <option value="EXPENSE">
                        {t("common.expense")}
                    </option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="recurring-category">
                    {t("recurring.category")}
                </label>

                <select
                    id="recurring-category"
                    className="form-control"
                    value={categoryId}
                    onChange={event => setCategoryId(event.target.value)}
                    required
                >
                    <option value="">
                        {t("recurring.selectCategory")}
                    </option>

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
            </div>

            <div className="form-group">
                <label htmlFor="recurring-amount">
                    {t("recurring.amount")}
                </label>

                <input
                    id="recurring-amount"
                    className="form-control"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={amount}
                    onChange={event => setAmount(event.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="recurring-note">
                    {t("recurring.note")}
                </label>

                <input
                    id="recurring-note"
                    className="form-control"
                    type="text"
                    value={note}
                    onChange={event => setNote(event.target.value)}
                />
            </div>

            <div className="form-group">
                <label htmlFor="recurring-frequency">
                    {t("recurring.frequency")}
                </label>

                <select
                    id="recurring-frequency"
                    className="form-control"
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
                    <option value="WEEKLY">
                        {t("recurring.weekly")}
                    </option>

                    <option value="MONTHLY">
                        {t("recurring.monthly")}
                    </option>

                    <option value="YEARLY">
                        {t("recurring.yearly")}
                    </option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="recurring-start-date">
                    {t("recurring.startDate")}
                </label>

                <input
                    id="recurring-start-date"
                    className="form-control"
                    type="date"
                    value={startDate}
                    onChange={event => setStartDate(event.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="recurring-end-date">
                    {t("recurring.endDate")}
                </label>

                <input
                    id="recurring-end-date"
                    className="form-control"
                    type="date"
                    value={endDate}
                    onChange={event => setEndDate(event.target.value)}
                />
            </div>

            <div className="form-actions">
                <button
                    type="submit"
                    className="button button-primary"
                >
                    {t("recurring.create")}
                </button>

                <button
                    type="button"
                    className="button button-secondary"
                    onClick={onCancel}
                >
                    {t("common.cancel")}
                </button>
            </div>
        </form>
    )
}

export default CreateRecurringTransactionForm
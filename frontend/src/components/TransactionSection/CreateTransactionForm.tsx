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
    ) => Promise<boolean>
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

        const success = await onCreate(
            accountId,
            categoryId,
            Number(amount),
            dateTime,
            note,
            transactionType
        )

        if (success) {
            setAccountId("")
            setCategoryId("")
            setTransactionType("EXPENSE")
            setNote("")
            setDateTime("")
            setAmount("")
        }
    }
    return (
        <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="transaction-account">
                    {t("transactions.account")}
                </label>

                <select
                    id="transaction-account"
                    className="form-control"
                    value={accountId}
                    onChange={event => setAccountId(event.target.value)}
                    required
                >
                    <option value="">
                        {t("transactions.selectAccount")}
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
                <label htmlFor="transaction-type">
                    {t("transactions.type")}
                </label>

                <select
                    id="transaction-type"
                    className="form-control"
                    value={transactionType}
                    onChange={event => {
                        setTransactionType(
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
                <label htmlFor="transaction-category">
                    {t("transactions.category")}
                </label>

                <select
                    id="transaction-category"
                    className="form-control"
                    value={categoryId}
                    onChange={event => setCategoryId(event.target.value)}
                    required
                >
                    <option value="">
                        {t("transactions.selectCategory")}
                    </option>

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
            </div>

            <div className="form-group">
                <label htmlFor="transaction-date">
                    {t("transactions.date")}
                </label>

                <input
                    id="transaction-date"
                    className="form-control"
                    type="datetime-local"
                    value={dateTime}
                    onChange={event => setDateTime(event.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="transaction-amount">
                    {t("transactions.amount")}
                </label>

                <input
                    id="transaction-amount"
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
                <label htmlFor="transaction-note">
                    {t("transactions.note")}
                </label>

                <input
                    id="transaction-note"
                    className="form-control"
                    type="text"
                    value={note}
                    onChange={event => setNote(event.target.value)}
                />
            </div>

            <div className="form-actions">
                <button
                    type="submit"
                    className="button button-primary"
                >
                    {t("transactions.create")}
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

export default CreateTransactionForm
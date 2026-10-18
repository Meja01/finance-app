import { useState } from "react"
import type { Account } from "../../types/Account"
import type { Category } from "../../types/Category"
import type {RecurringTransaction} from "../../types/RecurringTransaction.ts";

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
                <option value="">Select account</option>

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
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
            </select>

            <select
                value={categoryId}
                onChange={event => setCategoryId(event.target.value)}
                required
            >
                <option value="">Select category</option>

                {categories
                    .filter(category => category.type === type)
                    .map(category => (
                        <option
                            key={category.id}
                            value={category.id}
                        >
                            {category.name}
                        </option>
                    ))}
            </select>

            <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="Amount"
                value={amount}
                onChange={event => setAmount(event.target.value)}
                required
            />

            <input
                type="text"
                placeholder="Note"
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
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
            </select>

            <label>
                End date
                <input
                    type="date"
                    value={endDate}
                    onChange={event => setEndDate(event.target.value)}
                />
            </label>

            <button type="submit">
                Update recurring transaction
            </button>

            <button
                type="button"
                onClick={onCancel}
            >
                Cancel
            </button>
        </form>
    )

}

export default EditRecurringTransactionForm
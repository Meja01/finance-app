import { useState } from "react"
import type { Account } from "../../types/Account"
import type { Category } from "../../types/Category"

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
    ) => Promise<void>
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

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault()

        await onCreate(
            accountId,
            categoryId,
            Number(amount),
            note === "" ? null : note,
            type,
            frequency,
            startDate,
            endDate === "" ? null : endDate
        )

        setAccountId("")
        setCategoryId("")
        setAmount("")
        setType("EXPENSE")
        setNote("")
        setFrequency("MONTHLY")
        setStartDate("")
        setEndDate("")
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
                Start date
                <input
                    type="date"
                    value={startDate}
                    onChange={event => setStartDate(event.target.value)}
                    required
                />
            </label>

            <label>
                End date
                <input
                    type="date"
                    value={endDate}
                    onChange={event => setEndDate(event.target.value)}
                />
            </label>

            <button type="submit">
                Create recurring transaction
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

export default CreateRecurringTransactionForm
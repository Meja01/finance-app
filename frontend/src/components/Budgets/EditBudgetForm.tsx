import type {Budget} from "../../types/Budget.ts";
import {useState} from "react";

export type EditBudgetFormProps = {
    budget: Budget,
    onUpdate: (budgetId: string, amount: number) => Promise<void>
    onCancel: () => void
}

function EditBudgetForm({budget, onUpdate, onCancel} : EditBudgetFormProps) {
    const [amount, setAmount] = useState(budget.amount.toString())

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        await onUpdate(
            budget.id,
            Number(amount)
        )

        onCancel()
    }

    return <form onSubmit={handleSubmit}>
        <input
            type="number"
            step="0.01"
            min="0.01"
            placeholder="Amount"
            value={amount}
            onChange={event => setAmount(event.target.value)}
            required
        />
        <button type="submit">
            Edit budget
        </button>
        <button
            type="button"
            onClick={onCancel}
        >
            Cancel
        </button>

    </form>
}

export default EditBudgetForm
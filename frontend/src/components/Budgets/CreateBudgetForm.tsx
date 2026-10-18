import {useState} from "react";
import type {Category} from "../../types/Category.ts";

export type CreateBudgetFormProps = {
    categories: Category[],
    onCreate: (
        categoryId: string,
        year: number,
        month: number,
        amount: number
    ) => Promise<void>,
    onCancel: () => void
}

function CreateBudgetForm({categories, onCreate, onCancel}:CreateBudgetFormProps)  {
    const [categoryId, setCategoryId] = useState("")
    const [year, setYear] = useState("")
    const [month, setMonth] = useState("")
    const [amount, setAmount] = useState("")


    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        await onCreate(
            categoryId,
            Number(year),
            Number(month),
            Number(amount)
        )

        setCategoryId("")
        setYear("")
        setMonth("")
        setAmount("")
    }
    return (
        <form onSubmit={handleSubmit}>
            <select
                value={categoryId}
                onChange={event => setCategoryId(event.target.value)}
                required
            >
                <option value="">Select category</option>

                {categories
                    .filter(category => category.type === "EXPENSE")
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
                placeholder="Year"
                value={year}
                onChange={event => setYear(event.target.value)}
                min="2000"
                required
            />
            <input
                type="number"
                placeholder="Month"
                value={month}
                onChange={event => setMonth(event.target.value)}
                min="1"
                max="12"
                required
            />
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
                Create budget
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

export default CreateBudgetForm
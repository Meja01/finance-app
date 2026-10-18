import type {Budget} from "../../types/Budget.ts";

export type BudgetItemProps = {
    budget: Budget,
    categoryName: string,
    onDelete: (budgetId: string) => void
    onEdit: (budget: Budget) => void
}

function BudgetItem({budget, categoryName, onDelete, onEdit} : BudgetItemProps) {

    return (
        <div>
            <p>Category: {categoryName}</p>
            <p>Amount: {budget.amount}</p>
            <p>Year: {budget.year}</p>
            <p>Month: {budget.month}</p>
            <p>Date: {budget.createdAt}</p>
            <button onClick={() => onEdit(budget)}>
                Edit
            </button>
            <button onClick={() => onDelete(budget.id)}>
                Delete
            </button>
        </div>
    )
}

export default BudgetItem
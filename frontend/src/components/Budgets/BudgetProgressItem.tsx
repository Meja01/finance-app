import type { BudgetProgress } from "../../types/BudgetProgress"

type BudgetProgressItemProps = {
    progress: BudgetProgress
}

function BudgetProgressItem({progress}: BudgetProgressItemProps) {
    return (
        <div>
            <p>Category: {progress.categoryName}</p>
            <p>Budget: {progress.budgetAmount}</p>
            <p>Spent: {progress.spentAmount}</p>
            <p>Remaining: {progress.remainingAmount}</p>
            <p>Used: {progress.percentageUsed}%</p>
        </div>
    )
}

export default BudgetProgressItem
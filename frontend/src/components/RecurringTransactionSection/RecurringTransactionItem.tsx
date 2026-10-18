import type { RecurringTransaction } from "../../types/RecurringTransaction"

export type RecurringTransactionItemProps = {
    recurringTransaction: RecurringTransaction
    accountName: string
    categoryName: string
    onEdit: (recurringTransaction: RecurringTransaction) => void
    onDeactivate: (recurringTransactionId: string) => void
}

function RecurringTransactionItem({recurringTransaction, accountName, categoryName, onEdit, onDeactivate}: RecurringTransactionItemProps) {
    return (
        <div>
            <p>Account: {accountName}</p>
            <p>Category: {categoryName}</p>
            <p>Type: {recurringTransaction.type}</p>
            <p>Amount: {recurringTransaction.amount}</p>
            <p>Frequency: {recurringTransaction.frequency}</p>
            <p>Start date: {recurringTransaction.startDate}</p>
            <p>
                End date: {recurringTransaction.endDate ?? "No end date"}
            </p>
            <p>
                Next execution: {recurringTransaction.nextExecutionDate}
            </p>
            <p>
                Status: {recurringTransaction.active ? "Active" : "Inactive"}
            </p>
            <p>
                Note: {recurringTransaction.note ?? "-"}
            </p>
            <button onClick={() => onEdit(recurringTransaction)}>
                Edit
            </button>

            {recurringTransaction.active && (
                <button onClick={() => onDeactivate(recurringTransaction.id)}>
                    Deactivate
                </button>
            )}
        </div>
    )
}

export default RecurringTransactionItem
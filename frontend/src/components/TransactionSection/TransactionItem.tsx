import type {Transaction} from "../../types/Transaction.ts";


type TransactionItemProps = {
    transaction: Transaction
    accountName: string
    categoryName: string
    onDelete: (transactionId: string) => void
    onEdit: (transaction: Transaction) => void
    actionsDisabled: boolean
}

function TransactionItem({transaction, accountName, categoryName, onDelete, onEdit, actionsDisabled} : TransactionItemProps) {
    return ( <div>
            <p>Type: {transaction.transactionType}</p>
            <p>Amount: {transaction.amount}</p>
            <p>Account: {accountName}</p>
            <p>Category: {categoryName}</p>
            <p>Date: {transaction.dateTime}</p>
            <p>Note: {transaction.note ?? "-"}</p>
            {!actionsDisabled && (
                <>
                    <button onClick={() => onEdit(transaction)}>
                        Edit
                    </button>

                    <button onClick={() => onDelete(transaction.id)}>
                        Delete
                    </button>
                </>
            )}
        </div>
    )
}

export default TransactionItem
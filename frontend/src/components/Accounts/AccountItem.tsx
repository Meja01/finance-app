import type { Account } from "../../types/Account"

type AccountItemProps = {
    account: Account
    onDelete: (accountId: string) => void
    onEdit: (account: Account) => void
    isEditing: boolean
}

function AccountItem({account, onDelete, onEdit, isEditing}: AccountItemProps) {
    return (
        <div>
            <h3>{account.name}</h3>
            <p>Type: {account.type}</p>
            <p>Initial Balance: {account.initialBalance}</p>
            {!isEditing && (
                <>
                    <button onClick={() => onEdit(account)}>
                        Edit
                    </button>

                    <button onClick={() => onDelete(account.id)}>
                        Delete
                    </button>
                </>
            )}
        </div>
    )
}

export default AccountItem
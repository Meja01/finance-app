import {useState} from "react";
import type {Account} from "../../types/Account.ts";
import CreateAccountForm from "./CreateAccountForm"
import EditAccountForm from "./EditAccountForm"
import AccountItem from "./AccountItem.tsx"

type AccountSectionProps = {
    accessToken: string,
    accounts: Account[],
    setAccounts: React.Dispatch<React.SetStateAction<Account[]>>
}

function AccountSection ({ accessToken, accounts, setAccounts } : AccountSectionProps) {
    const [editingAccount, setEditingAccount] = useState<Account | null>(null)
    const [showCreateAccount, setShowCreateAccount] = useState(false)

    async function handleCreateAccount(
        name: string,
        type: "CARD" | "CASH",
        initialBalance: number
    ) {
        const response = await fetch("http://localhost:8080/accounts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                name,
                type,
                initialBalance
            })
        })

        const createdAccount = await response.json()
        console.log("account data:", createdAccount)
        setAccounts([...accounts, createdAccount])
        setShowCreateAccount(false)
    }

    async function handleDeleteAccount(
        accountId: string
    ) {
        await fetch(
            `http://localhost:8080/accounts/${accountId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )
        setAccounts(accounts.filter(account => account.id !== accountId))
    }

    function handleEditAccount(account: Account) {
        setEditingAccount(account)
        setShowCreateAccount(false)
    }

    async function handleUpdateAccount(
        accountId: string,
        name: string,
        type: "CARD" | "CASH",
        initialBalance: number) {

        const response = await fetch(`http://localhost:8080/accounts/${accountId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                accountId,
                name,
                type,
                initialBalance
            })
        })

        const updatedAccount = await response.json()

        setAccounts(accounts.map(account => account.id === accountId ? updatedAccount : account))

    }

    return (
    <section>
        <button
            onClick={() => {
                setShowCreateAccount(true)
                setEditingAccount(null)
            }}
        >
            Create account
        </button>

        {showCreateAccount && (
            <CreateAccountForm
                onCreate={handleCreateAccount}
                onCancel={() => setShowCreateAccount(false)}
            />
        )}
        {editingAccount && (
            <EditAccountForm
                account={editingAccount}
                onUpdate={handleUpdateAccount}
                onCancel={() => setEditingAccount(null)}
            />
        )}
        <h2>Accounts</h2>
        {accounts.map(account => (
            <AccountItem
                key={account.id}
                account={account}
                onDelete={handleDeleteAccount}
                onEdit={handleEditAccount}
                isEditing={editingAccount?.id === account.id}
            />
        ))}
    </section>
    )
}

export default AccountSection
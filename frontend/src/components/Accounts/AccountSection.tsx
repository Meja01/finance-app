import {useState} from "react";
import type {Account} from "../../types/Account.ts";
import CreateAccountForm from "./CreateAccountForm"
import EditAccountForm from "./EditAccountForm"
import AccountItem from "./AccountItem.tsx"
import {useTranslation} from "react-i18next";

type AccountSectionProps = {
    accessToken: string,
    accounts: Account[],
    setAccounts: React.Dispatch<React.SetStateAction<Account[]>>,
    accountsLoaded: boolean
    accountsError: string | null
}

function AccountSection ({ accessToken, accounts, setAccounts, accountsLoaded, accountsError } : AccountSectionProps) {
    const [editingAccount, setEditingAccount] = useState<Account | null>(null)
    const [showCreateAccount, setShowCreateAccount] = useState(false)
    const { t } = useTranslation()
    const [actionError, setActionError] = useState<string | null>(null)

    async function handleCreateAccount (
        name: string,
        type: "CARD" | "CASH",
        initialBalance: number
    ) : Promise<boolean> {
        setActionError(null)

        try {
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

            if (!response.ok) {
                setActionError(t("accounts.actionError"))
                return false
            }

            const createdAccount = await response.json()

            setAccounts([...accounts, createdAccount])
            setShowCreateAccount(false)
            return true

        } catch (error) {
            console.error(error)
            setActionError(t("accounts.actionError"))
            return false
        }
    }

    async function handleDeleteAccount(
        accountId: string
    ) {
        setActionError(null)
        try {
            const response = await fetch(
                `http://localhost:8080/accounts/${accountId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            )

            if (!response.ok) {
                setActionError(t("accounts.actionError"))
                return
            }
            setAccounts(accounts.filter(account => account.id !== accountId))
        } catch (error) {
            console.error(error)
            setActionError(t("accounts.actionError"))
        }
    }

    function handleEditAccount(account: Account) {
        setActionError(null)
        setEditingAccount(account)
        setShowCreateAccount(false)
    }

    async function handleUpdateAccount(
        accountId: string,
        name: string,
        type: "CARD" | "CASH",
        initialBalance: number): Promise<boolean> {
        setActionError(null)
        try {
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
            if (!response.ok) {
                setActionError(t("accounts.actionError"))
                return false
            }
            const updatedAccount = await response.json()

            setAccounts(accounts.map(account => account.id === accountId ? updatedAccount : account))
            return true
        } catch (error) {
            console.error(error)
            setActionError(t("accounts.actionError"))
            return false
        }

    }

    if (!accountsLoaded) {
        return (
            <section>
                <h2>{t("accounts.title")}</h2>
                <p>{t("common.loading")}</p>
            </section>
        )
    }

    if (accountsError) {
        return (
            <section>
                <h2>{t("accounts.title")}</h2>
                <p>{accountsError}</p>
            </section>
        )
    }

    return (
    <section>
        <h2>{t("accounts.title")}</h2>
        <div>
            <button
                onClick={() => {
                    setActionError(null)
                    setShowCreateAccount(true)
                    setEditingAccount(null)
                }}
            >
                {t("accounts.create")}

            </button>
        </div>

        {actionError && (
            <p>{actionError}</p>
        )}

        <div>
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
        </div>

        <div>
            {accounts.length === 0 ? (
                <p>{t("accounts.empty")}</p>
            ) : (
                accounts.map(account => (
                    <AccountItem
                        key={account.id}
                        account={account}
                        onDelete={handleDeleteAccount}
                        onEdit={handleEditAccount}
                        isEditing={editingAccount?.id === account.id}
                    />
                ))
            )}
        </div>
    </section>
    )
}

export default AccountSection
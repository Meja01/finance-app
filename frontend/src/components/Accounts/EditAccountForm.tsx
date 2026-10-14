import type {Account} from "../../types/Account.ts";
import {useState} from "react";

type EditAccountFormProps = {
    account: Account
    onUpdate: (
        accountId: string,
        name: string,
        type: "CARD" | "CASH",
        initialBalance: number
    ) => Promise<void>
    onCancel: () => void
}

function EditAccountForm({ account, onUpdate, onCancel }: EditAccountFormProps) {
    const [name, setName] = useState(account.name)
    const [type, setType] = useState<"CARD" | "CASH">(account.type)
    const [initialBalance, setInitialBalance] = useState(account.initialBalance.toString())

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        await onUpdate(
            account.id,
            name,
            type,
            Number(initialBalance)
        )

        onCancel()
    }
    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Account name"
                value={name}
                onChange={event => setName(event.target.value)}
            />

            <select
                value={type}
                onChange={event =>
                    setType(event.target.value as "CARD" | "CASH")
                }
            >
                <option value="CARD">Card</option>
                <option value="CASH">Cash</option>
            </select>

            <input
                type="number"
                placeholder="Initial balance"
                value={initialBalance}
                onChange={event => setInitialBalance(event.target.value)}
            />

            <button type="submit">
                Update account
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

export default EditAccountForm

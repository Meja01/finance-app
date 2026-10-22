import type {Account} from "../../types/Account.ts";
import {useState} from "react";
import {useTranslation} from "react-i18next";

type EditAccountFormProps = {
    account: Account
    onUpdate: (
        accountId: string,
        name: string,
        type: "CARD" | "CASH",
        initialBalance: number
    ) => Promise<boolean>
    onCancel: () => void
}

function EditAccountForm({ account, onUpdate, onCancel }: EditAccountFormProps) {
    const [name, setName] = useState(account.name)
    const [type, setType] = useState<"CARD" | "CASH">(account.type)
    const [initialBalance, setInitialBalance] = useState(account.initialBalance.toString())
    const { t } = useTranslation()

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const success = await onUpdate(
            account.id,
            name,
            type,
            Number(initialBalance)
        )

        if (success) {
            onCancel()
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder={t("accounts.name")}
                value={name}
                onChange={event => setName(event.target.value)}
            />

            <select
                value={type}
                onChange={event =>
                    setType(event.target.value as "CARD" | "CASH")
                }
            >
                <option value="CARD">{t("accounts.card")}</option>
                <option value="CASH">{t("accounts.cash")}</option>
            </select>

            <input
                type="number"
                placeholder={t("accounts.initialBalance")}
                value={initialBalance}
                onChange={event => setInitialBalance(event.target.value)}
            />

            <button type="submit">
                {t("accounts.update")}
            </button>
            <button
                type="button"
                onClick={onCancel}
            >
                {t("common.cancel")}
            </button>
        </form>
    )
}

export default EditAccountForm

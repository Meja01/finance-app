import {useState} from "react";
import {useTranslation} from "react-i18next";

type CreateAccountFormProps = {
    onCreate: (
        name: string,
        type: "CARD" | "CASH",
        initialBalance: number
    ) => Promise<void>
    onCancel: () => void
}

function CreateAccountForm({ onCreate, onCancel }: CreateAccountFormProps) {
    const [name, setName] = useState("")
    const [type, setType] = useState<"CARD" | "CASH">("CARD")
    const [initialBalance, setInitialBalance] = useState("")
    const { t } = useTranslation()

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        await onCreate(
            name,
            type,
            Number(initialBalance)
        )

        setName("")
        setType("CARD")
        setInitialBalance("")
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
                {t("accounts.create")}
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

export default CreateAccountForm
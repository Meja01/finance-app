import {useState} from "react";
import {useTranslation} from "react-i18next";

type CreateAccountFormProps = {
    onCreate: (
        name: string,
        type: "CARD" | "CASH",
        initialBalance: number
    ) => Promise<boolean>
    onCancel: () => void
}

function CreateAccountForm({ onCreate, onCancel }: CreateAccountFormProps) {
    const [name, setName] = useState("")
    const [type, setType] = useState<"CARD" | "CASH">("CARD")
    const [initialBalance, setInitialBalance] = useState("")
    const { t } = useTranslation()

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const success = await onCreate(
            name,
            type,
            Number(initialBalance)
        )

        if (success) {
            setName("")
            setType("CARD")
            setInitialBalance("")
        }
    }

    return (
        <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="account-name">
                    {t("accounts.name")}
                </label>

                <input
                    id="account-name"
                    className="form-control"
                    value={name}
                    onChange={event => setName(event.target.value)}
                />
            </div>

            <div className="form-group">
                <label htmlFor="account-type">
                    {t("accounts.type")}
                </label>

                <select
                    id="account-type"
                    className="form-control"
                    value={type}
                    onChange={event =>
                        setType(event.target.value as "CARD" | "CASH")
                    }
                >
                    <option value="CARD">{t("accounts.card")}</option>
                    <option value="CASH">{t("accounts.cash")}</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="initial-balance">
                    {t("accounts.initialBalance")}
                </label>

                <input
                    id="initial-balance"
                    className="form-control"
                    type="number"
                    value={initialBalance}
                    onChange={event => setInitialBalance(event.target.value)}
                />
            </div>

            <div className="form-actions">
                <button
                    type="submit"
                    className="button button-primary"
                >
                    {t("accounts.create")}
                </button>

                <button
                    type="button"
                    className="button button-secondary"
                    onClick={onCancel}
                >
                    {t("common.cancel")}
                </button>
            </div>
        </form>
    )
}

export default CreateAccountForm
import {useState} from "react";
import {useTranslation} from "react-i18next";

type CreateCategoryFormProps = {
    onCreate: (
        name: string,
        type: "EXPENSE" | "INCOME"
    ) => Promise<boolean>
    onCancel: () => void
}
function CreateCategoryForm({onCreate, onCancel} : CreateCategoryFormProps) {
    const [name, setName] = useState("")
    const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE")
    const { t } = useTranslation()

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const success = await onCreate(
            name,
            type
        )

        if (success) {
            setName("")
            setType("EXPENSE")
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder={t("transactions.categories.name")}
                value={name}
                onChange={event => setName(event.target.value)}
                required
            />

            <select
                value={type}
                onChange={event => {
                    setType(event.target.value as "INCOME" | "EXPENSE")
                }}
            >
                <option value="INCOME">{t("common.income")}</option>
                <option value="EXPENSE">{t("common.expense")}</option>
            </select>

            <button type="submit">{t("transactions.categories.create")}</button>

            <button
                type="button"
                onClick={onCancel}
            >
                {t("common.cancel")}
            </button>
        </form>
    )
}

export default CreateCategoryForm
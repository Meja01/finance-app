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
        <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="category-name">
                    {t("transactions.categories.name")}
                </label>

                <input
                    id="category-name"
                    className="form-control"
                    type="text"
                    value={name}
                    onChange={event => setName(event.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="category-type">
                    {t("transactions.type")}
                </label>

                <select
                    id="category-type"
                    className="form-control"
                    value={type}
                    onChange={event =>
                        setType(event.target.value as "INCOME" | "EXPENSE")
                    }
                >
                    <option value="INCOME">{t("common.income")}</option>
                    <option value="EXPENSE">{t("common.expense")}</option>
                </select>
            </div>

            <div className="form-actions">
                <button
                    type="submit"
                    className="button button-primary"
                >
                    {t("transactions.categories.create")}
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

export default CreateCategoryForm
import {useState} from "react";
import type {Category} from "../../../types/Category.ts";
import {useTranslation} from "react-i18next";

type EditCategoryFormProps = {
    category: Category
    onUpdate: (
        categoryId: string,
        name: string,
    ) => Promise<void>
    onCancel: () => void
}
function EditCategoryForm({category, onUpdate, onCancel} : EditCategoryFormProps) {
    const [name, setName] = useState(category.name)
    const { t } = useTranslation()

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        await onUpdate(
            category.id,
            name
        )
        onCancel()
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

            <button type="submit">{t("transactions.categories.edit")}</button>

            <button
                type="button"
                onClick={onCancel}
            >
                {t("common.cancel")}
            </button>
        </form>
    )
}

export default EditCategoryForm
import {useState} from "react";
import type {Category} from "../../types/Category.ts";
import {useTranslation} from "react-i18next";

type EditCategoryFormProps = {
    category: Category
    onUpdate: (
        categoryId: string,
        name: string,
    ) => Promise<boolean>
    onCancel: () => void
}
function EditCategoryForm({category, onUpdate, onCancel} : EditCategoryFormProps) {
    const [name, setName] = useState(category.name)
    const { t } = useTranslation()

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const success = await onUpdate(
            category.id,
            name
        )
        if (success) {
            onCancel()
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

            <div className="form-actions">
                <button
                    type="submit"
                    className="button button-primary"
                >
                    {t("transactions.categories.update")}
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

export default EditCategoryForm
import {useState} from "react";
import type {Category} from "../../../types/Category.ts";

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
                placeholder="Name"
                value={name}
                onChange={event => setName(event.target.value)}
                required
            />

            <button type="submit">
                Edit category
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

export default EditCategoryForm
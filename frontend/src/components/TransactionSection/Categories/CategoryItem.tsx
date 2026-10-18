import type {Category} from "../../../types/Category.ts";


type CategoryItemProps = {
    category: Category
    onEdit: (category: Category) => void
    onDelete: (categoryId: string) => void
}

function CategoryItem({category, onEdit, onDelete} : CategoryItemProps) {

    return (
        <div>
        <p>Name: {category.name}</p>
        <p>Type: {category.type}</p>
        {!category.global && (
            <>
                <button onClick={() => onEdit(category)}>
                    Edit
                </button>

                <button onClick={() => onDelete(category.id)}>
                    Delete
                </button>
            </>
        )}
    </div>
    )
}

export default CategoryItem
import type {Category} from "../../types/Category.ts";
import {useTranslation} from "react-i18next";
import {getCategoryDisplayName} from "../utils/getCategoryDisplayName.ts";


type CategoryItemProps = {
    category: Category
    onEdit: (category: Category) => void
    onDelete: (categoryId: string) => void
}

function CategoryItem({category, onEdit, onDelete} : CategoryItemProps) {
    const { t } = useTranslation()

    return (
        <div className="card category-item">
            <div>
                <h4>
                    {getCategoryDisplayName(category, t)}
                </h4>

                <span
                    className={
                        category.type === "INCOME"
                            ? "category-type income"
                            : "category-type expense"
                    }
                >
                {category.type === "INCOME"
                    ? t("common.income")
                    : t("common.expense")}
                </span>

                {category.global && (
                    <span className="category-global">
                      {t("categories.globalLabel")}
                    </span>
                )}
            </div>

            {!category.global && (
                <div className="category-actions">
                    <button
                        className="button button-secondary"
                        onClick={() => onEdit(category)}
                    >
                        {t("common.edit")}
                    </button>

                    <button
                        className="button button-danger"
                        onClick={() => onDelete(category.id)}
                    >
                        {t("common.delete")}
                    </button>
                </div>
            )}
        </div>
    )
}

export default CategoryItem
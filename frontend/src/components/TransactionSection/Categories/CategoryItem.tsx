import type {Category} from "../../../types/Category.ts";
import {useTranslation} from "react-i18next";
import {getCategoryDisplayName} from "../../utils/getCategoryDisplayName.ts";


type CategoryItemProps = {
    category: Category
    onEdit: (category: Category) => void
    onDelete: (categoryId: string) => void
}

function CategoryItem({category, onEdit, onDelete} : CategoryItemProps) {
    const { t } = useTranslation()

    return (
        <div>
            <p>{t("transactions.categories.name")}:{" "}{getCategoryDisplayName(category, t)}</p>
            <p>
                {t("transactions.type")}:{" "}
                {category.type === "INCOME" ? t("common.income") : t("common.expense")}
            </p>
            {!category.global && (
                <>
                    <button onClick={() => onEdit(category)}>{t("common.edit")}</button>
                    <button onClick={() => onDelete(category.id)}>{t("common.delete")}</button>
                </>
            )}
        </div>
    )
}

export default CategoryItem
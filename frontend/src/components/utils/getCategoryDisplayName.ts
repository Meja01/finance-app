import type { TFunction } from "i18next"
import type {Category} from "../../types/Category.ts";

export function getCategoryDisplayName(
    category: Category,
    t: TFunction
) {
    if (!category.global) {
        return category.name
    }

    const key = category.name
        .toLowerCase()
        .replaceAll(" ", "_")

    return t(`categories.global.${key}`, {
        defaultValue: category.name
    })
}
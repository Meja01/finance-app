import type { CategoryStats } from "../../types/CategoryStats"
import {useTranslation} from "react-i18next";
import {formatCurrency} from "../utils/formatCurrency.ts";

type CategoryStatsItemProps = {
    categoryStats: CategoryStats
}

function CategoryStatsItem({categoryStats}: CategoryStatsItemProps) {
    const { i18n } = useTranslation()
    return (
        <div className="card category-stat-item">
            <span className="category-stat-name">
              {categoryStats.categoryName}
            </span>

            <strong className="category-stat-amount">
                {formatCurrency(
                    categoryStats.amount,
                    i18n.language
                )}
            </strong>
        </div>
    )
}

export default CategoryStatsItem
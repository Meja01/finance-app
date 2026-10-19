import type { CategoryStats } from "../../types/CategoryStats"
import {useTranslation} from "react-i18next";

type CategoryStatsItemProps = {
    categoryStats: CategoryStats
}

function CategoryStatsItem({categoryStats}: CategoryStatsItemProps) {
    const { t } = useTranslation()
    return (
        <div>
            <p>{t("statistics.category")}: {categoryStats.categoryName}</p>
            <p>{t("statistics.amount")}: {categoryStats.amount}</p>
        </div>
    )
}

export default CategoryStatsItem
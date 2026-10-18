import type { CategoryStats } from "../../types/CategoryStats"

type CategoryStatsItemProps = {
    categoryStats: CategoryStats
}

function CategoryStatsItem({categoryStats}: CategoryStatsItemProps) {
    return (
        <div>
            <p>Category: {categoryStats.categoryName}</p>
            <p>Amount: {categoryStats.amount}</p>
        </div>
    )
}

export default CategoryStatsItem
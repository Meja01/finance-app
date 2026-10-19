import type { BudgetProgress } from "../../types/BudgetProgress"
import {useTranslation} from "react-i18next";

type BudgetProgressItemProps = {
    progress: BudgetProgress
}

function BudgetProgressItem({progress}: BudgetProgressItemProps) {
    const { t } = useTranslation()
    return (
        <div>
            <p>{t("budgets.category")}: {progress.categoryName}</p>
            <p>{t("budgets.progressBudget")}: {progress.budgetAmount}</p>
            <p>{t("budgets.spent")}: {progress.spentAmount}</p>
            <p>{t("budgets.remaining")}: {progress.remainingAmount}</p>
            <p>{t("budgets.used")}: {progress.percentageUsed}%</p>
        </div>
    )
}

export default BudgetProgressItem
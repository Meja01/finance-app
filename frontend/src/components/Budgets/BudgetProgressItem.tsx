import type { BudgetProgress } from "../../types/BudgetProgress"
import {useTranslation} from "react-i18next";
import {formatCurrency} from "../utils/formatCurrency.ts";

type BudgetProgressItemProps = {
    progress: BudgetProgress
}

function BudgetProgressItem({progress}: BudgetProgressItemProps) {
    const { t, i18n } = useTranslation()
    const progressWidth = Math.min(progress.percentageUsed, 100)
    const isOverBudget = progress.percentageUsed > 100
    return (
        <div className="card budget-progress-item">
            <div className="budget-progress-header">
                <div>
                    <h3>{progress.categoryName}</h3>

                    <p className="budget-progress-summary">
                        {formatCurrency(progress.spentAmount, i18n.language)}
                        {" / "}
                        {formatCurrency(progress.budgetAmount, i18n.language)}
                    </p>
                </div>

                <strong
                    className={
                        isOverBudget
                            ? "budget-progress-percentage over-budget"
                            : "budget-progress-percentage"
                    }
                >
                    {progress.percentageUsed.toFixed(1)}%
                </strong>
            </div>

            <div className="progress-bar">
                <div
                    className={
                        isOverBudget
                            ? "progress-bar-fill over-budget"
                            : "progress-bar-fill"
                    }
                    style={{
                        width: `${progressWidth}%`
                    }}
                />
            </div>

            <div className="budget-progress-details">
              <span>
                {t("budgets.spent")}:{" "}
                  <strong>
                  {formatCurrency(progress.spentAmount, i18n.language)}
                </strong>
              </span>

                <span>
                    {t("budgets.remaining")}:{" "}
                    <strong>
                      {formatCurrency(progress.remainingAmount, i18n.language)}
                    </strong>
                </span>
            </div>
        </div>
    )
}

export default BudgetProgressItem
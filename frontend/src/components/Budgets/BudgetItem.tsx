import type {Budget} from "../../types/Budget.ts";
import {useTranslation} from "react-i18next";
import {formatCurrency} from "../utils/formatCurrency.ts";

export type BudgetItemProps = {
    budget: Budget,
    categoryName: string,
    onDelete: (budgetId: string) => void
    onEdit: (budget: Budget) => void
}

function BudgetItem({budget, categoryName, onDelete, onEdit} : BudgetItemProps) {
    const { t, i18n } = useTranslation()

    return (
        <div className="card budget-item">
            <div className="budget-item-main">
                <div>
                    <h3>{categoryName}</h3>

                    <p className="budget-period-label">
                        {budget.month}/{budget.year}
                    </p>
                </div>

                <div className="budget-amount">
                    <span>{t("budgets.amount")}</span>

                    <strong>
                        {formatCurrency(
                            budget.amount,
                            i18n.language
                        )}
                    </strong>
                </div>
            </div>

            <div className="budget-actions">
                <button
                    className="button button-secondary"
                    onClick={() => onEdit(budget)}
                >
                    {t("common.edit")}
                </button>

                <button
                    className="button button-danger"
                    onClick={() => onDelete(budget.id)}
                >
                    {t("common.delete")}
                </button>
            </div>
        </div>
    )
}

export default BudgetItem
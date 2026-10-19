import type {Budget} from "../../types/Budget.ts";
import {useTranslation} from "react-i18next";

export type BudgetItemProps = {
    budget: Budget,
    categoryName: string,
    onDelete: (budgetId: string) => void
    onEdit: (budget: Budget) => void
}

function BudgetItem({budget, categoryName, onDelete, onEdit} : BudgetItemProps) {
    const { t } = useTranslation()

    return (
        <div>
            <p>{t("budgets.category")}: {categoryName}</p>
            <p>{t("budgets.amount")}: {budget.amount}</p>
            <p>{t("budgets.year")}: {budget.year}</p>
            <p>{t("budgets.month")}: {budget.month}</p>
            <p>{t("budgets.date")}: {budget.createdAt}</p>
            <button onClick={() => onEdit(budget)}>{t("common.edit")}</button>
            <button onClick={() => onDelete(budget.id)}>{t("common.delete")}</button>
        </div>
    )
}

export default BudgetItem
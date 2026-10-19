import type { RecurringTransaction } from "../../types/RecurringTransaction"
import {useTranslation} from "react-i18next";

export type RecurringTransactionItemProps = {
    recurringTransaction: RecurringTransaction
    accountName: string
    categoryName: string
    onEdit: (recurringTransaction: RecurringTransaction) => void
    onDeactivate: (recurringTransactionId: string) => void
}

function RecurringTransactionItem({recurringTransaction, accountName, categoryName, onEdit, onDeactivate}: RecurringTransactionItemProps) {
    const { t } = useTranslation()
    return (
        <div>
            <p>{t("recurring.account")}: {accountName}</p>
            <p>{t("recurring.category")}: {categoryName}</p>
            <p>{t("recurring.type")}:{" "}
                {recurringTransaction.type === "INCOME"
                    ? t("common.income")
                    : t("common.expense")}
            </p>
            <p>{t("recurring.amount")}: {recurringTransaction.amount}</p>
            <p>{t("recurring.frequency")}:{" "}
                {recurringTransaction.frequency === "WEEKLY"
                    ? t("recurring.weekly")
                    : recurringTransaction.frequency === "MONTHLY"
                        ? t("recurring.monthly")
                        : t("recurring.yearly")}
            </p>
            <p>{t("recurring.startDate")}: {recurringTransaction.startDate}</p>
            <p>{t("recurring.endDate")}:{" "}
                {recurringTransaction.endDate ?? t("common.noEndDate")}
            </p>
            <p>{t("recurring.nextExecution")}:{" "}{recurringTransaction.nextExecutionDate}</p>
            <p>{t("recurring.status")}:{" "}
                {recurringTransaction.active
                    ? t("common.active")
                    : t("common.inactive")}
            </p>
            <p>{t("recurring.note")}: {recurringTransaction.note ?? "-"}</p>

            <button onClick={() => onEdit(recurringTransaction)}>
                {t("common.edit")}
            </button>

            {recurringTransaction.active && (
                <button
                    onClick={() => onDeactivate(recurringTransaction.id)}
                >
                    {t("common.deactivate")}
                </button>
            )}
        </div>
    )
}

export default RecurringTransactionItem
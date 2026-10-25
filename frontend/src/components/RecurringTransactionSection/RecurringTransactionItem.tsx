import type { RecurringTransaction } from "../../types/RecurringTransaction"
import {useTranslation} from "react-i18next";
import {formatCurrency} from "../utils/formatCurrency.ts";
import {formatDateTime} from "../utils/formatDateTime.ts";

export type RecurringTransactionItemProps = {
    recurringTransaction: RecurringTransaction
    accountName: string
    categoryName: string
    onEdit: (recurringTransaction: RecurringTransaction) => void
    onDeactivate: (recurringTransactionId: string) => void
}

function RecurringTransactionItem({recurringTransaction, accountName, categoryName, onEdit, onDeactivate}: RecurringTransactionItemProps) {
    const { t, i18n} = useTranslation()
    return (
        <div className="card recurring-item">
            <div className="recurring-item-main">
                <div>
                    <h3>{categoryName}</h3>

                    <p className="recurring-note">
                        {recurringTransaction.note ?? "-"}
                    </p>

                    <p className="recurring-meta">
                        {accountName}
                    </p>

                    <div className="recurring-badges">
                      <span
                          className={
                              recurringTransaction.type === "INCOME"
                                  ? "recurring-badge income"
                                  : "recurring-badge expense"
                          }
                      >
                        {recurringTransaction.type === "INCOME"
                            ? t("common.income")
                            : t("common.expense")}
                      </span>

                        <span className="recurring-badge frequency">
                            {recurringTransaction.frequency === "WEEKLY"
                                ? t("recurring.weekly")
                                : recurringTransaction.frequency === "MONTHLY"
                                    ? t("recurring.monthly")
                                    : t("recurring.yearly")}
                        </span>

                        <span
                            className={
                                recurringTransaction.active
                                    ? "recurring-badge active"
                                    : "recurring-badge inactive"
                            }
                        >
                            {recurringTransaction.active
                            ? t("common.active")
                            : t("common.inactive")}
                        </span>
                    </div>
                </div>

                <div className="recurring-side">
                    <strong className="recurring-amount">
                        {formatCurrency(
                            recurringTransaction.amount,
                            i18n.language
                        )}
                    </strong>

                    <div className="recurring-dates">
                        <span>
                             {t("recurring.startDate")}: {formatDateTime(recurringTransaction.startDate, i18n.language)}
                        </span>

                        <span>
                             {t("recurring.endDate")}:{" "}
                             {recurringTransaction.endDate
                                ? formatDateTime(
                                    recurringTransaction.endDate,
                                    i18n.language) : t("common.noEndDate")}
                        </span>

                        <span>
                            {t("recurring.nextExecution")}:{" "}
                            {formatDateTime(recurringTransaction.nextExecutionDate, i18n.language)}
                        </span>
                    </div>

                    <div className="recurring-actions">
                        <button
                            className="button button-secondary"
                            onClick={() => onEdit(recurringTransaction)}
                        >
                            {t("common.edit")}
                        </button>

                        {recurringTransaction.active && (
                            <button
                                className="button button-danger"
                                onClick={() =>
                                    onDeactivate(recurringTransaction.id)
                                }
                            >
                                {t("common.deactivate")}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecurringTransactionItem
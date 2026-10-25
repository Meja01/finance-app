import type {Transaction} from "../../types/Transaction.ts";
import {useTranslation} from "react-i18next";
import {formatCurrency} from "../utils/formatCurrency.ts";
import {formatDateTime} from "../utils/formatDateTime.ts";


type TransactionItemProps = {
    transaction: Transaction
    accountName: string
    categoryName: string
    onDelete: (transactionId: string) => void
    onEdit: (transaction: Transaction) => void
    actionsDisabled: boolean
}

function TransactionItem({transaction, accountName, categoryName, onDelete, onEdit, actionsDisabled} : TransactionItemProps) {
    const { t, i18n } = useTranslation()
    return (
        <div className="card transaction-item">
            <div className="transaction-main">
                <div>
                    <h3>{categoryName}</h3>

                    <p className="transaction-note">
                        {transaction.note ?? "-"}
                    </p>

                    <p className="transaction-meta">
                        {accountName} · {formatDateTime(transaction.dateTime, i18n.language)}
                    </p>
                </div>

                <div className="transaction-side">
                    <strong
                        className={
                            transaction.transactionType === "INCOME"
                                ? "transaction-amount income"
                                : "transaction-amount expense"
                        }
                    >
                        {transaction.transactionType === "INCOME" ? "+" : "-"}
                        {formatCurrency(
                            transaction.amount,
                            i18n.language
                        )}
                    </strong>

                    <span
                        className={transaction.transactionType === "INCOME"
                                ? "transaction-type income"
                                : "transaction-type expense"}>
                        {transaction.transactionType === "INCOME"
                            ? t("common.income")
                            : t("common.expense")}
                    </span>

                    {!actionsDisabled && (
                        <div className="transaction-actions">
                            <button
                                className="button button-secondary"
                                onClick={() => onEdit(transaction)}
                            >
                                {t("common.edit")}
                            </button>

                            <button
                                className="button button-danger"
                                onClick={() => onDelete(transaction.id)}
                            >
                                {t("common.delete")}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TransactionItem
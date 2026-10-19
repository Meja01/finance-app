import type {Transaction} from "../../types/Transaction.ts";
import {useTranslation} from "react-i18next";


type TransactionItemProps = {
    transaction: Transaction
    accountName: string
    categoryName: string
    onDelete: (transactionId: string) => void
    onEdit: (transaction: Transaction) => void
    actionsDisabled: boolean
}

function TransactionItem({transaction, accountName, categoryName, onDelete, onEdit, actionsDisabled} : TransactionItemProps) {
    const { t } = useTranslation()
    return (
        <div>
            <p>
                {t("transactions.type")}:{" "}
                {transaction.transactionType === "INCOME" ? t("common.income") : t("common.expense")}
            </p>
            <p>{t("transactions.amount")}: {transaction.amount}</p>
            <p>{t("transactions.account")}: {accountName}</p>
            <p>{t("transactions.category")}: {categoryName}</p>
            <p>{t("transactions.date")}: {transaction.dateTime}</p>
            <p>{t("transactions.note")}: {transaction.note ?? "-"}</p>
            {!actionsDisabled && (
                <>
                    <button onClick={() => onEdit(transaction)}>{t("common.edit")}</button>
                    <button onClick={() => onDelete(transaction.id)}>{t("common.delete")}</button>
                </>
            )}
        </div>
    )
}

export default TransactionItem
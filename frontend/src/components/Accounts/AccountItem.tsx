import type { Account } from "../../types/Account"
import {useTranslation} from "react-i18next";
import {formatCurrency} from "../utils/formatCurrency.ts";

type AccountItemProps = {
    account: Account
    onDelete: (accountId: string) => void
    onEdit: (account: Account) => void
    isEditing: boolean
}

function AccountItem({account, onDelete, onEdit, isEditing}: AccountItemProps) {
    const { t, i18n } = useTranslation()
    return (
        <div className="card account-item">
            <div className="account-item-main">
                <div>
                    <h3>{account.name}</h3>

                    <p className="account-type">
                        {account.type === "CARD"
                            ? t("accounts.card")
                            : t("accounts.cash")}
                    </p>
                </div>

                <div className="account-balance">
                    <span>{t("accounts.initialBalance")}</span>

                    <strong>
                        {formatCurrency(
                            account.initialBalance,
                            i18n.language
                        )}
                    </strong>
                </div>
            </div>

            {!isEditing && (
                <div className="account-actions">
                    <button
                        className="button button-secondary"
                        onClick={() => onEdit(account)}
                    >
                        {t("common.edit")}
                    </button>

                    <button
                        className="button button-danger"
                        onClick={() => onDelete(account.id)}
                    >
                        {t("common.delete")}
                    </button>
                </div>
            )}
        </div>
    )
}

export default AccountItem
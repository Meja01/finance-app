import type { Account } from "../../types/Account"
import {useTranslation} from "react-i18next";

type AccountItemProps = {
    account: Account
    onDelete: (accountId: string) => void
    onEdit: (account: Account) => void
    isEditing: boolean
}

function AccountItem({account, onDelete, onEdit, isEditing}: AccountItemProps) {
    const { t } = useTranslation()
    return (
        <div>
            <h3>{account.name}</h3>
            <p>{t("accounts.type")}:{" "}
                {account.type === "CARD" ? t("accounts.card") : t("accounts.cash")}
            </p>
            <p>{t("accounts.initialBalance")}: {account.initialBalance}</p>
            {!isEditing && (
                <>
                    <button onClick={() => onEdit(account)}>
                        {t("common.edit")}
                    </button>

                    <button onClick={() => onDelete(account.id)}>
                        {t("common.delete")}
                    </button>
                </>
            )}
        </div>
    )
}

export default AccountItem
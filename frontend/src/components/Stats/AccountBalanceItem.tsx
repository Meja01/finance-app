import type { AccountBalance } from "../../types/AccountBalance"
import {useTranslation} from "react-i18next";
import {formatCurrency} from "../utils/formatCurrency.ts";

type AccountBalanceItemProps = {
    accountBalance: AccountBalance
}

function AccountBalanceItem({accountBalance}: AccountBalanceItemProps) {
    const { i18n } = useTranslation()
    return (
        <div className="card account-balance-item">
            <span className="account-balance-name">
              {accountBalance.accountName}
            </span>

            <strong className="account-balance-value">
                {formatCurrency(
                    accountBalance.balance,
                    i18n.language
                )}
            </strong>
        </div>
    )
}

export default AccountBalanceItem
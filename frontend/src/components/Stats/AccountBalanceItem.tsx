import type { AccountBalance } from "../../types/AccountBalance"
import {useTranslation} from "react-i18next";

type AccountBalanceItemProps = {
    accountBalance: AccountBalance
}

function AccountBalanceItem({accountBalance}: AccountBalanceItemProps) {
    const { t } = useTranslation()
    return (
        <div>
            <p>{t("statistics.account")}: {accountBalance.accountName}</p>
            <p>{t("statistics.balance")}: {accountBalance.balance}</p>
        </div>
    )
}

export default AccountBalanceItem
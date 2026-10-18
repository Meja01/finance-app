import type { AccountBalance } from "../../types/AccountBalance"

type AccountBalanceItemProps = {
    accountBalance: AccountBalance
}

function AccountBalanceItem({accountBalance}: AccountBalanceItemProps) {
    return (
        <div>
            <p>Account: {accountBalance.accountName}</p>
            <p>Balance: {accountBalance.balance}</p>
        </div>
    )
}

export default AccountBalanceItem
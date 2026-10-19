import {useEffect, useState} from "react";
import type {MonthlyStats} from "../../types/MonthlyStats.ts";
import type {AccountBalance} from "../../types/AccountBalance.ts";
import {useTranslation} from "react-i18next";


type DashboardSectionProps = {
    accessToken: string
}

function DashboardSection({accessToken}: DashboardSectionProps) {
    const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null)
    const [accountBalances, setAccountBalances] = useState<AccountBalance[]>([])
    const totalBalance = accountBalances.reduce(
        (sum, accountBalance) => sum + accountBalance.balance, 0)
    const { t } = useTranslation()

    useEffect(() => {
        if (!accessToken) {
            return
        }

        const now = new Date()
        const year = now.getFullYear()
        const month = now.getMonth() + 1

        fetch(
            `http://localhost:8080/stats/monthly?year=${year}&month=${month}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )
            .then(response => {
                if (!response.ok) {
                    throw new Error(
                        `Failed to load monthly stats: ${response.status}`
                    )
                }

                return response.json()
            })
            .then(data => {
                setMonthlyStats(data)
            })
            .catch(error => {
                console.error("Failed to load monthly stats:", error)
            })

    }, [accessToken])

    useEffect(() => {
        if (!accessToken) {
            return
        }

        fetch(
            "http://localhost:8080/stats/accounts/balances",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )
            .then(response => {
                if (!response.ok) {
                    throw new Error(
                        `Failed to load account balances: ${response.status}`
                    )
                }

                return response.json()
            })
            .then(data => {
                setAccountBalances(data)
            })
            .catch(error => {
                console.error("Failed to load account balances:", error)
            })

    }, [accessToken])

    return (
        <section>
            <h2>{t("dashboard.title")}</h2>

            <div>
                <h3>{t("dashboard.totalBalance")}</h3>
                <p>{totalBalance}</p>
            </div>

            <div>
                <h3>{t("dashboard.thisMonth")}</h3>

                {monthlyStats && (
                    <div>
                        <p>{t("common.income")}: {monthlyStats.income}</p>
                        <p>{t("statistics.expenses")}: {monthlyStats.expenses}</p>
                        <p>{t("statistics.balance")}: {monthlyStats.balance}</p>
                    </div>
                )}
            </div>
        </section>
    )
}

export default DashboardSection
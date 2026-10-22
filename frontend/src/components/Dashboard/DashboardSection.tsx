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
    const [monthlyLoading, setMonthlyLoading] = useState(true)
    const [balancesLoading, setBalancesLoading] = useState(true)

    const [monthlyError, setMonthlyError] = useState<string | null>(null)
    const [balancesError, setBalancesError] = useState<string | null>(null)

    useEffect(() => {
        if (!accessToken) {
            return
        }

        async function loadMonthlyStats() {
            setMonthlyLoading(true)
            setMonthlyError(null)

            const now = new Date()
            const year = now.getFullYear()
            const month = now.getMonth() + 1

            try {
                const response = await fetch(
                    `http://localhost:8080/stats/monthly?year=${year}&month=${month}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }
                )

                if (!response.ok) {
                    setMonthlyError(t("dashboard.loadError"))
                    return
                }

                const data = await response.json()
                setMonthlyStats(data)

            } catch (error) {
                console.error("Failed to load monthly stats:", error)
                setMonthlyError(t("dashboard.loadError"))

            } finally {
                setMonthlyLoading(false)
            }
        }
        void loadMonthlyStats()

    }, [accessToken])

    useEffect(() => {
        if (!accessToken) {
            return
        }

        async function loadAccountBalances() {
            setBalancesLoading(true)
            setBalancesError(null)

            try {
                const response = await fetch(
                    "http://localhost:8080/stats/accounts/balances",
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }
                )

                if (!response.ok) {
                    setBalancesError(t("dashboard.loadError"))
                    return
                }

                const data = await response.json()
                setAccountBalances(data)

            } catch (error) {
                console.error("Failed to load account balances:", error)
                setBalancesError(t("dashboard.loadError"))

            } finally {
                setBalancesLoading(false)
            }
        }

        void loadAccountBalances()

    }, [accessToken])

    const isLoading = monthlyLoading || balancesLoading
    const loadError = monthlyError || balancesError

    if (isLoading) {
        return (
            <section>
                <h2>{t("dashboard.title")}</h2>
                <p>{t("common.loading")}</p>
            </section>
        )
    }

    if (loadError) {
        return (
            <section>
                <h2>{t("dashboard.title")}</h2>
                <p>{loadError}</p>
            </section>
        )
    }
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
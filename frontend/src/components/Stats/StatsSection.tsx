import { useEffect, useState } from "react"
import type { MonthlyStats } from "../../types/MonthlyStats"
import MonthlyStatsItem from "./MonthlyStatsItem.tsx";
import type {CategoryStats} from "../../types/CategoryStats.ts";
import CategoryStatsItem from "./CategoryStatsItem.tsx";
import type {AccountBalance} from "../../types/AccountBalance.ts";
import AccountBalanceItem from "./AccountBalanceItem.tsx";
import PeriodSelector from "../common/PeriodSelector.tsx";
import {useTranslation} from "react-i18next";

type StatsSectionProps = {
    accessToken: string
}

function StatsSection({ accessToken }: StatsSectionProps) {
    const [selectedYear, setSelectedYear] = useState(2026)
    const [selectedMonth, setSelectedMonth] = useState(10)
    const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null)
    const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([])
    const [categoryStatsType, setCategoryStatsType] = useState<"INCOME" | "EXPENSE">("EXPENSE")
    const [accountBalances, setAccountBalances] = useState<AccountBalance[]>([])
    const { t } = useTranslation()
    const [monthlyLoading, setMonthlyLoading] = useState(true)
    const [categoryLoading, setCategoryLoading] = useState(true)
    const [balancesLoading, setBalancesLoading] = useState(true)
    const [monthlyError, setMonthlyError] = useState<string | null>(null)
    const [categoryError, setCategoryError] = useState<string | null>(null)
    const [balancesError, setBalancesError] = useState<string | null>(null)

    useEffect(() => {
        if (!accessToken) {
            return
        }

        async function loadMonthlyStats() {
            setMonthlyLoading(true)
            setMonthlyError(null)

            try {
                const response = await fetch(
                    `http://localhost:8080/stats/monthly?year=${selectedYear}&month=${selectedMonth}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }
                )

                if (!response.ok) {
                    setMonthlyError(t("statistics.loadError"))
                    return
                }

                const data = await response.json()
                setMonthlyStats(data)

            } catch (error) {
                console.error("Failed to load monthly stats:", error)
                setMonthlyError(t("statistics.loadError"))

            } finally {
                setMonthlyLoading(false)
            }
        }

        void loadMonthlyStats()

    }, [accessToken, selectedYear, selectedMonth])

    useEffect(() => {
        if (!accessToken) {
            return
        }

        async function loadCategoryStats() {
            setCategoryLoading(true)
            setCategoryError(null)

            try {
                const response = await fetch(
                    `http://localhost:8080/stats/categories?year=${selectedYear}&month=${selectedMonth}&type=${categoryStatsType}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }
                )

                if (!response.ok) {
                    setCategoryError(t("statistics.loadError"))
                    return
                }

                const data = await response.json()
                setCategoryStats(data)

            } catch (error) {
                console.error("Failed to load category stats:", error)
                setCategoryError(t("statistics.loadError"))

            } finally {
                setCategoryLoading(false)
            }
        }
        void loadCategoryStats()
    }, [accessToken, selectedYear, selectedMonth, categoryStatsType])

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
                    setBalancesError(t("statistics.loadError"))
                    return
                }

                const data = await response.json()
                setAccountBalances(data)

            } catch (error) {
                console.error("Failed to load account balances:", error)
                setBalancesError(t("statistics.loadError"))

            } finally {
                setBalancesLoading(false)
            }
        }

        void loadAccountBalances()

    }, [accessToken])

    const isLoading = monthlyLoading || categoryLoading || balancesLoading
    const loadError = monthlyError || categoryError || balancesError

    if (isLoading) {
        return (
            <section>
                <h2>{t("statistics.title")}</h2>
                <p>{t("common.loading")}</p>
            </section>
        )
    }

    if (loadError) {
        return (
            <section>
                <h2>{t("statistics.title")}</h2>
                <p>{loadError}</p>
            </section>
        )
    }

    return (
        <section>
            <h2>{t("statistics.title")}</h2>

            <div>
                <h3>{t("statistics.period")}</h3>

                <PeriodSelector
                    year={selectedYear}
                    month={selectedMonth}
                    onYearChange={setSelectedYear}
                    onMonthChange={setSelectedMonth}
                />
            </div>

            <div>
                <h3>{t("statistics.monthly")}</h3>

                {monthlyStats && (
                    <MonthlyStatsItem monthlyStats={monthlyStats} />
                )}
            </div>

            <div>
                <h3>{t("statistics.categories")}</h3>

                <div>
                    <select
                        value={categoryStatsType}
                        onChange={event =>
                            setCategoryStatsType(
                                event.target.value as "INCOME" | "EXPENSE"
                            )
                        }
                    >
                        <option value="EXPENSE">{t("common.expense")}</option>
                        <option value="INCOME">{t("common.income")}</option>
                    </select>
                </div>

                <div>
                    {categoryStats.map(categoryStat => (
                        <CategoryStatsItem
                            key={categoryStat.categoryId}
                            categoryStats={categoryStat}
                        />
                    ))}
                </div>
            </div>

            <div>
                <h3>{t("statistics.accountBalances")}</h3>

                {accountBalances.map(accountBalance => (
                    <AccountBalanceItem
                        key={accountBalance.accountId}
                        accountBalance={accountBalance}
                    />
                ))}
            </div>
        </section>
    )
}

export default StatsSection
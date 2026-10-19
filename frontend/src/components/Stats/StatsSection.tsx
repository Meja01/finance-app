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

    useEffect(() => {
        if (!accessToken) {
            return
        }

        fetch(
            `http://localhost:8080/stats/monthly?year=${selectedYear}&month=${selectedMonth}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load monthly stats: ${response.status}`)
                }
                return response.json()
            })
            .then(data => {
                setMonthlyStats(data)
            })
            .catch(error => {
                console.error("Failed to load monthly stats:", error)
            })

    }, [accessToken, selectedYear, selectedMonth])

    useEffect(() => {
        if (!accessToken) {
            return
        }

        fetch(
            `http://localhost:8080/stats/categories?year=${selectedYear}&month=${selectedMonth}&type=${categoryStatsType}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load category stats: ${response.status}`)
                }
                return response.json()
            })
            .then(data => {setCategoryStats(data)})
            .catch(error => {console.error("Failed to load category stats:", error)})
    }, [
        accessToken,
        selectedYear,
        selectedMonth,
        categoryStatsType
    ])

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
                    throw new Error(`Failed to load account balances: ${response.status}`)
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
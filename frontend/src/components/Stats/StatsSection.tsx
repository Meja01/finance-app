import { useEffect, useState } from "react"
import type { MonthlyStats } from "../../types/MonthlyStats"
import MonthlyStatsItem from "./MonthlyStatsItem.tsx";
import type {CategoryStats} from "../../types/CategoryStats.ts";
import CategoryStatsItem from "./CategoryStatsItem.tsx";
import type {AccountBalance} from "../../types/AccountBalance.ts";
import AccountBalanceItem from "./AccountBalanceItem.tsx";

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
            <h2>Statistics</h2>

            <div>
                <h3>Period</h3>
                <input
                    type="number"
                    value={selectedYear}
                    onChange={event =>
                        setSelectedYear(Number(event.target.value))
                    }
                />
                <select
                    value={selectedMonth}
                    onChange={event =>
                        setSelectedMonth(Number(event.target.value))
                    }
                >
                    <option value={1}>January</option>
                    <option value={2}>February</option>
                    <option value={3}>March</option>
                    <option value={4}>April</option>
                    <option value={5}>May</option>
                    <option value={6}>June</option>
                    <option value={7}>July</option>
                    <option value={8}>August</option>
                    <option value={9}>September</option>
                    <option value={10}>October</option>
                    <option value={11}>November</option>
                    <option value={12}>December</option>
                </select>
            </div>

            <div>
                <h3>Monthly statistics</h3>
                {monthlyStats && (<MonthlyStatsItem monthlyStats={monthlyStats} />)}
            </div>

            <div>
                <h3>Category statistics</h3>

                <div>
                    <select
                        value={categoryStatsType}
                        onChange={event =>
                            setCategoryStatsType(
                                event.target.value as "INCOME" | "EXPENSE"
                            )
                        }
                    >
                        <option value="EXPENSE">Expenses</option>
                        <option value="INCOME">Income</option>
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
                <h3>Account balances</h3>

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
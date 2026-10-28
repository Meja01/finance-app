import { useEffect, useState } from "react"
import type { MonthlyStats } from "../../types/MonthlyStats"
import MonthlyStatsItem from "./MonthlyStatsItem.tsx";
import type {CategoryStats} from "../../types/CategoryStats.ts";
import CategoryStatsItem from "./CategoryStatsItem.tsx";
import type {AccountBalance} from "../../types/AccountBalance.ts";
import AccountBalanceItem from "./AccountBalanceItem.tsx";
import PeriodSelector from "../common/PeriodSelector.tsx";
import {useTranslation} from "react-i18next";
import {useAuth} from "../../auth/useAuth.ts";
import {API_URL} from "../../config/api.ts";


function StatsSection() {
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
    const {accessToken, apiFetch} = useAuth()

    useEffect(() => {
        if (!accessToken) {
            return
        }

        async function loadMonthlyStats() {
            setMonthlyLoading(true)
            setMonthlyError(null)

            try {
                const response = await apiFetch(`${API_URL}/stats/monthly?year=${selectedYear}&month=${selectedMonth}`)

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
                const response = await apiFetch(`${API_URL}/stats/categories?year=${selectedYear}&month=${selectedMonth}&type=${categoryStatsType}`)

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
                const response = await apiFetch(`${API_URL}/stats/accounts/balances`)

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
                <p className="error-message">
                    {loadError}
                </p>
            </section>
        )
    }
    return (
        <section>
            <div className="page-header">
                <h2>{t("statistics.title")}</h2>
            </div>

            <div className="card statistics-period">
                <h3>{t("statistics.period")}</h3>

                <PeriodSelector
                    year={selectedYear}
                    month={selectedMonth}
                    onYearChange={setSelectedYear}
                    onMonthChange={setSelectedMonth}
                />
            </div>

            <section className="statistics-section">
                <div className="section-header">
                    <h3>{t("statistics.monthly")}</h3>
                </div>

                {monthlyStats && (
                    <MonthlyStatsItem
                        monthlyStats={monthlyStats}
                    />
                )}
            </section>

            <section className="statistics-section">
                <div className="section-header">
                    <h3>{t("statistics.categories")}</h3>

                    <select
                        className="form-control statistics-type-select"
                        value={categoryStatsType}
                        onChange={event =>
                            setCategoryStatsType(
                                event.target.value as "INCOME" | "EXPENSE"
                            )
                        }
                    >
                        <option value="EXPENSE">
                            {t("common.expense")}
                        </option>

                        <option value="INCOME">
                            {t("common.income")}
                        </option>
                    </select>
                </div>

                <div className="category-stats-list">
                    {categoryStats.map(categoryStat => (
                        <CategoryStatsItem
                            key={categoryStat.categoryId}
                            categoryStats={categoryStat}
                        />
                    ))}
                </div>
            </section>

            <section className="statistics-section">
                <div className="section-header">
                    <h3>{t("statistics.accountBalances")}</h3>
                </div>

                <div className="account-balance-list">
                    {accountBalances.map(accountBalance => (
                        <AccountBalanceItem
                            key={accountBalance.accountId}
                            accountBalance={accountBalance}
                        />
                    ))}
                </div>
            </section>
        </section>
    )
}

export default StatsSection
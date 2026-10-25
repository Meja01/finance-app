import {useEffect, useState} from "react";
import type {MonthlyStats} from "../../types/MonthlyStats.ts";
import type {AccountBalance} from "../../types/AccountBalance.ts";
import {useTranslation} from "react-i18next";
import {useAuth} from "../../auth/useAuth.ts";
import {formatCurrency} from "../utils/formatCurrency.ts";
import type {CategoryStats} from "../../types/CategoryStats.ts";
import {Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,} from "recharts"


function DashboardSection() {
    const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null)
    const [accountBalances, setAccountBalances] = useState<AccountBalance[]>([])
    const totalBalance = accountBalances.reduce(
        (sum, accountBalance) => sum + accountBalance.balance, 0)
    const { t, i18n } = useTranslation()
    const [monthlyLoading, setMonthlyLoading] = useState(true)
    const [balancesLoading, setBalancesLoading] = useState(true)

    const [monthlyError, setMonthlyError] = useState<string | null>(null)
    const [balancesError, setBalancesError] = useState<string | null>(null)
    const {accessToken, apiFetch} = useAuth()
    const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([])
    const [categoryStatsLoading, setCategoryStatsLoading] = useState(true)
    const [categoryStatsError, setCategoryStatsError] = useState<string | null>(null)

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
                const response = await apiFetch(`http://localhost:8080/stats/monthly?year=${year}&month=${month}`)

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
                const response = await apiFetch("http://localhost:8080/stats/accounts/balances")

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

    useEffect(() => {
        if (!accessToken) {
            return
        }

        async function loadCategoryStats() {
            setCategoryStatsLoading(true)
            setCategoryStatsError(null)

            const now = new Date()
            const year = now.getFullYear()
            const month = now.getMonth() + 1

            try {
                const response = await apiFetch(
                    `http://localhost:8080/stats/categories?year=${year}&month=${month}&type=EXPENSE`
                )

                if (!response.ok) {
                    setCategoryStatsError(t("dashboard.loadError"))
                    return
                }

                const data = await response.json()
                setCategoryStats(data)

            } catch (error) {
                console.error("Failed to load dashboard category statistics:", error)
                setCategoryStatsError(t("dashboard.loadError"))
            } finally {
                setCategoryStatsLoading(false)
            }
        }

        void loadCategoryStats()

    }, [accessToken])

    const summaryLoading = monthlyLoading || balancesLoading
    const summaryError = monthlyError || balancesError
    const categoryChartLoading = categoryStatsLoading
    const categoryChartError = categoryStatsError

    return (
        <section>
            <div className="page-header">
                <h2>{t("dashboard.title")}</h2>
            </div>

            {summaryLoading && (
                <p>{t("common.loading")}</p>
            )}

            {!summaryLoading && summaryError && (
                <p className="error-message">
                    {summaryError}
                </p>
            )}

            {!summaryLoading && !summaryError && (
                <div className="dashboard-cards">
                    <div className="card dashboard-stat-card">
                        <span className="dashboard-stat-label">
                            {t("dashboard.totalBalance")}
                        </span>

                        <strong className="dashboard-stat-value">
                            {formatCurrency(
                                totalBalance,
                                i18n.language
                            )}
                        </strong>
                    </div>

                    {monthlyStats && (
                        <>
                            <div className="card dashboard-stat-card">
                                <span className="dashboard-stat-label">
                                    {t("common.income")}
                                </span>

                                <strong className="dashboard-stat-value income">
                                    {formatCurrency(
                                        monthlyStats.income,
                                        i18n.language
                                    )}
                                </strong>
                            </div>

                            <div className="card dashboard-stat-card">
                                <span className="dashboard-stat-label">
                                    {t("statistics.expenses")}
                                </span>

                                <strong className="dashboard-stat-value expense">
                                    {formatCurrency(
                                        monthlyStats.expenses,
                                        i18n.language
                                    )}
                                </strong>
                            </div>

                            <div className="card dashboard-stat-card">
                                <span className="dashboard-stat-label">
                                    {t("statistics.balance")}
                                </span>

                                <strong className="dashboard-stat-value">
                                    {formatCurrency(
                                        monthlyStats.balance,
                                        i18n.language
                                    )}
                                </strong>
                            </div>
                        </>
                    )}
                </div>
            )}
            <div className="card dashboard-chart">
                <h3>{t("dashboard.expensesByCategory")}</h3>

                {categoryChartLoading && (
                    <p>{t("common.loading")}</p>
                )}

                {!categoryChartLoading && categoryChartError && (
                    <p className="error-message">
                        {categoryChartError}
                    </p>
                )}

                {!categoryChartLoading &&
                    !categoryChartError &&
                    categoryStats.length === 0 && (
                        <p className="empty-message">
                            {t("dashboard.noCategoryExpenses")}
                        </p>
                    )}

                {!categoryChartLoading &&
                    !categoryChartError &&
                    categoryStats.length > 0 && (
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart data={categoryStats}>
                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis dataKey="categoryName" />

                                <YAxis
                                    tickFormatter={(value) =>
                                        formatCurrency(value, i18n.language)
                                    }
                                />

                                <Tooltip
                                    formatter={(value) =>
                                        typeof value === "number"
                                            ? formatCurrency(value, i18n.language)
                                            : value
                                    }
                                />

                                <Bar
                                    dataKey="amount"
                                    name={t("statistics.amount")}
                                    fill="#2563eb"
                                    radius={[6, 6, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
            </div>
        </section>
    )
}

export default DashboardSection
import type {MonthlyStats} from "../../types/MonthlyStats.ts";
import {useTranslation} from "react-i18next";
import {formatCurrency} from "../utils/formatCurrency.ts";


type MonthlyStatsItemProps = {
    monthlyStats: MonthlyStats
}

function MonthlyStatsItem({monthlyStats}: MonthlyStatsItemProps) {
    const { t, i18n } = useTranslation()
    return (
        <div className="monthly-stats-grid">
            <div className="card monthly-stat-card">
                <span>{t("common.income")}</span>

                <strong className="monthly-stat-value income">
                    {formatCurrency(
                        monthlyStats.income,
                        i18n.language
                    )}
                </strong>
            </div>

            <div className="card monthly-stat-card">
                <span>{t("statistics.expenses")}</span>

                <strong className="monthly-stat-value expense">
                    {formatCurrency(
                        monthlyStats.expenses,
                        i18n.language
                    )}
                </strong>
            </div>

            <div className="card monthly-stat-card">
                <span>{t("statistics.balance")}</span>

                <strong className="monthly-stat-value">
                    {formatCurrency(
                        monthlyStats.balance,
                        i18n.language
                    )}
                </strong>
            </div>
        </div>
    )
}

export default MonthlyStatsItem
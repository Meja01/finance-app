import type {MonthlyStats} from "../../types/MonthlyStats.ts";
import {useTranslation} from "react-i18next";


type MonthlyStatsItemProps = {
    monthlyStats: MonthlyStats
}

function MonthlyStatsItem({monthlyStats}: MonthlyStatsItemProps) {
    const { t } = useTranslation()
    return (
        <div>
            <p>{t("common.income")}: {monthlyStats.income}</p>
            <p>{t("statistics.expenses")}: {monthlyStats.expenses}</p>
            <p>{t("statistics.balance")}: {monthlyStats.balance}</p>
        </div>
    )
}

export default MonthlyStatsItem
import type {MonthlyStats} from "../../types/MonthlyStats.ts";


type MonthlyStatsItemProps = {
    monthlyStats: MonthlyStats
}

function MonthlyStatsItem({monthlyStats}: MonthlyStatsItemProps) {
    return (
        <div>
            <p>Income: {monthlyStats.income}</p>
            <p>Expenses: {monthlyStats.expenses}</p>
            <p>Balance: {monthlyStats.balance}</p>
        </div>
    )
}

export default MonthlyStatsItem
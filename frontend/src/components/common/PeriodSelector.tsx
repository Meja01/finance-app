import {useTranslation} from "react-i18next";

type PeriodSelectorProps = {
    year: number
    month: number
    onYearChange: (year: number) => void
    onMonthChange: (month: number) => void
}

function PeriodSelector({year, month, onYearChange, onMonthChange}: PeriodSelectorProps) {
    const { t } = useTranslation()
    return (
        <div className="period-selector">
            <div className="form-group">
                <label htmlFor="budget-progress-year">
                    {t("budgets.year")}
                </label>

                <input
                    id="budget-progress-year"
                    className="form-control"
                    type="number"
                    value={year}
                    onChange={event =>
                        onYearChange(Number(event.target.value))
                    }
                />
            </div>

            <div className="form-group">
                <label htmlFor="budget-progress-month">
                    {t("budgets.month")}
                </label>

                <select
                    id="budget-progress-month"
                    className="form-control"
                    value={month}
                    onChange={event =>
                        onMonthChange(Number(event.target.value))
                    }
                >
                    <option value={1}>{t("common.months.january")}</option>
                    <option value={2}>{t("common.months.february")}</option>
                    <option value={3}>{t("common.months.march")}</option>
                    <option value={4}>{t("common.months.april")}</option>
                    <option value={5}>{t("common.months.may")}</option>
                    <option value={6}>{t("common.months.june")}</option>
                    <option value={7}>{t("common.months.july")}</option>
                    <option value={8}>{t("common.months.august")}</option>
                    <option value={9}>{t("common.months.september")}</option>
                    <option value={10}>{t("common.months.october")}</option>
                    <option value={11}>{t("common.months.november")}</option>
                    <option value={12}>{t("common.months.december")}</option>
                </select>
            </div>
        </div>
    )
}

export default PeriodSelector
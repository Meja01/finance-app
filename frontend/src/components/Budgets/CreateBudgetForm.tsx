import {useState} from "react";
import type {Category} from "../../types/Category.ts";
import {useTranslation} from "react-i18next";
import {getCategoryDisplayName} from "../utils/getCategoryDisplayName.ts";

export type CreateBudgetFormProps = {
    categories: Category[],
    onCreate: (
        categoryId: string,
        year: number,
        month: number,
        amount: number
    ) => Promise<boolean>,
    onCancel: () => void
}

function CreateBudgetForm({categories, onCreate, onCancel}:CreateBudgetFormProps)  {
    const [categoryId, setCategoryId] = useState("")
    const [year, setYear] = useState("")
    const [month, setMonth] = useState("")
    const [amount, setAmount] = useState("")
    const { t } = useTranslation()


    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const success = await onCreate(
            categoryId,
            Number(year),
            Number(month),
            Number(amount)
        )

        if (success) {
            setCategoryId("")
            setYear("")
            setMonth("")
            setAmount("")
        }
    }
    return (
        <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="budget-category">
                    {t("budgets.category")}
                </label>

                <select
                    id="budget-category"
                    className="form-control"
                    value={categoryId}
                    onChange={event => setCategoryId(event.target.value)}
                    required
                >
                    <option value="">
                        {t("budgets.selectCategory")}
                    </option>

                    {categories
                        .filter(category => category.type === "EXPENSE")
                        .map(category => (
                            <option
                                key={category.id}
                                value={category.id}
                            >
                                {getCategoryDisplayName(category, t)}
                            </option>
                        ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="budget-year">
                    {t("budgets.year")}
                </label>

                <input
                    id="budget-year"
                    className="form-control"
                    type="number"
                    value={year}
                    onChange={event => setYear(event.target.value)}
                    min="2000"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="budget-month">
                    {t("budgets.month")}
                </label>

                <input
                    id="budget-month"
                    className="form-control"
                    type="number"
                    value={month}
                    onChange={event => setMonth(event.target.value)}
                    min="1"
                    max="12"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="budget-amount">
                    {t("budgets.amount")}
                </label>

                <input
                    id="budget-amount"
                    className="form-control"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={amount}
                    onChange={event => setAmount(event.target.value)}
                    required
                />
            </div>

            <div className="form-actions">
                <button
                    type="submit"
                    className="button button-primary"
                >
                    {t("budgets.create")}
                </button>

                <button
                    type="button"
                    className="button button-secondary"
                    onClick={onCancel}
                >
                    {t("common.cancel")}
                </button>
            </div>
        </form>
    )
}

export default CreateBudgetForm
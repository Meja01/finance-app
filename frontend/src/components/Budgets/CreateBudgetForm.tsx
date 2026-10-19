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
    ) => Promise<void>,
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

        await onCreate(
            categoryId,
            Number(year),
            Number(month),
            Number(amount)
        )

        setCategoryId("")
        setYear("")
        setMonth("")
        setAmount("")
    }
    return (
        <form onSubmit={handleSubmit}>
            <select
                value={categoryId}
                onChange={event => setCategoryId(event.target.value)}
                required
            >
                <option value="">{t("budgets.selectCategory")}</option>

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

            <input
                type="number"
                placeholder={t("budgets.year")}
                value={year}
                onChange={event => setYear(event.target.value)}
                min="2000"
                required
            />

            <input
                type="number"
                placeholder={t("budgets.month")}
                value={month}
                onChange={event => setMonth(event.target.value)}
                min="1"
                max="12"
                required
            />

            <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder={t("budgets.amount")}
                value={amount}
                onChange={event => setAmount(event.target.value)}
                required
            />

            <button type="submit">
                {t("budgets.create")}
            </button>

            <button
                type="button"
                onClick={onCancel}
            >
                {t("common.cancel")}
            </button>
        </form>
    )
}

export default CreateBudgetForm
import type {Budget} from "../../types/Budget.ts";
import {useState} from "react";
import {useTranslation} from "react-i18next";

export type EditBudgetFormProps = {
    budget: Budget,
    onUpdate: (budgetId: string, amount: number) => Promise<boolean>
    onCancel: () => void
}

function EditBudgetForm({budget, onUpdate, onCancel} : EditBudgetFormProps) {
    const [amount, setAmount] = useState(budget.amount.toString())
    const { t } = useTranslation()

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const success = await onUpdate(
            budget.id,
            Number(amount)
        )

        if (success) {
            onCancel()
        }
    }

    return (
        <form className="form" onSubmit={handleSubmit}>
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
                    {t("budgets.update")}
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

export default EditBudgetForm
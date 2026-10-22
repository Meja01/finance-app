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

    return (<form onSubmit={handleSubmit}>
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
                {t("budgets.edit")}
            </button>

            <button
                type="button"
                onClick={onCancel}
            >
                {t("common.cancel")}
            </button>
        </form>)
}

export default EditBudgetForm
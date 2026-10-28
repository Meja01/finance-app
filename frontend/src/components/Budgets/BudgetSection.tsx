import type {Category} from "../../types/Category.ts";
import {useEffect, useState} from "react";
import BudgetItem from "./BudgetItem.tsx";
import type {Budget} from "../../types/Budget.ts";
import CreateBudgetForm from "./CreateBudgetForm.tsx";
import EditBudgetForm from "./EditBudgetForm.tsx";
import type {BudgetProgress} from "../../types/BudgetProgress.ts";
import BudgetProgressItem from "./BudgetProgressItem.tsx";
import PeriodSelector from "../common/PeriodSelector.tsx";
import {useTranslation} from "react-i18next";
import {getCategoryDisplayName} from "../utils/getCategoryDisplayName.ts";
import {useAuth} from "../../auth/useAuth.ts";
import {API_URL} from "../../config/api.ts";

type BudgetSectionProps = {
    categories: Category[]
    categoriesLoaded: boolean,
    categoriesError: string | null
}

function BudgetSection({categories, categoriesLoaded, categoriesError} : BudgetSectionProps) {
    const [budgets, setBudgets] = useState<Budget[]>([])
    const [showCreateBudget, setShowCreateBudget] = useState(false)
    const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
    const [budgetProgress, setBudgetProgress] = useState<BudgetProgress[]>([])
    const [selectedYear, setSelectedYear] = useState(2026)
    const [selectedMonth, setSelectedMonth] = useState(10)
    const { t } = useTranslation()
    const [budgetsLoading, setBudgetsLoading] = useState(true)
    const [progressLoading, setProgressLoading] = useState(true)

    const [budgetsError, setBudgetsError] = useState<string | null>(null)
    const [progressError, setProgressError] = useState<string | null>(null)

    const [actionError, setActionError] = useState<string | null>(null)
    const {accessToken, apiFetch} = useAuth()

    useEffect(() => {
        if (!accessToken) {
            return
        }

        async function loadBudgets() {
            setBudgetsLoading(true)
            setBudgetsError(null)

            try {
                const response = await apiFetch(`${API_URL}/budgets`)

                if (!response.ok) {
                    setBudgetsError(t("budgets.loadError"))
                    return
                }

                const data = await response.json()
                setBudgets(data)

            } catch (error) {
                console.error("Failed to load budgets:", error)
                setBudgetsError(t("budgets.loadError"))

            } finally {
                setBudgetsLoading(false)
            }
        }

        void loadBudgets()

    }, [accessToken])

    useEffect(() => {
        if (!accessToken) {
            return
        }

        async function loadBudgetProgress() {
            setProgressLoading(true)
            setProgressError(null)

            try {
                const response = await apiFetch(`${API_URL}/budgets/progress?year=${selectedYear}&month=${selectedMonth}`)

                if (!response.ok) {
                    setProgressError(t("budgets.progressLoadError"))
                    return
                }

                const data = await response.json()
                setBudgetProgress(data)

            } catch (error) {
                console.error("Failed to load budget progress:", error)
                setProgressError(t("budgets.progressLoadError"))

            } finally {
                setProgressLoading(false)
            }
        }

        void loadBudgetProgress()

    }, [accessToken, selectedYear, selectedMonth])

    async function handleCreateBudget(
        categoryId: string,
        year: number,
        month: number,
        amount: number
    ): Promise<boolean> {
        setActionError(null)

        try {
            const response = await apiFetch(
                `${API_URL}/budgets`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        categoryId,
                        year,
                        month,
                        amount
                    })
                }
            )

            if (!response.ok) {
                setActionError(t("budgets.actionError"))
                return false
            }

            const createdBudget = await response.json()
            setBudgets([...budgets, createdBudget])
            setShowCreateBudget(false)
            return true

        } catch (error) {
            console.error("Failed to create budget:", error)
            setActionError(t("budgets.actionError"))
            return false
        }
    }

    async function handleDeleteBudget(budgetId: string) {
        setActionError(null)
        try {
            const response = await apiFetch(
                `${API_URL}/budgets/${budgetId}`,
                {
                    method: "DELETE"
                }
            )

            if (!response.ok) {
                setActionError(t("budgets.actionError"))
                return
            }
            setBudgets(budgets.filter(budget => budget.id !== budgetId))

        } catch (error) {
            console.error("Failed to delete budget:", error)
            setActionError(t("budgets.actionError"))
        }
    }
    async function handleUpdateBudget(
        budgetId: string,
        amount: number
    ): Promise<boolean> {
        setActionError(null)

        try {
            const response = await apiFetch(
                `${API_URL}/budgets/${budgetId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        amount
                    })
                }
            )

            if (!response.ok) {
                setActionError(t("budgets.actionError"))
                return false
            }

            const updatedBudget = await response.json()
            setBudgets(budgets.map(budget => budget.id === budgetId ? updatedBudget : budget))
            return true

        } catch (error) {
            console.error("Failed to update budget:", error)
            setActionError(t("budgets.actionError"))
            return false
        }
    }

    function handleEditBudget(budget: Budget) {
        setEditingBudget(budget)
    }

    const isLoading = budgetsLoading || progressLoading
    const loadError = budgetsError || progressError

    if (!categoriesLoaded) {
        return (
            <section>
                <h2>{t("budgets.title")}</h2>
                <p>{t("common.loading")}</p>
            </section>
        )
    }

    if (categoriesError) {
        return (
            <section>
                <h2>{t("budgets.title")}</h2>
                <p>{categoriesError}</p>
            </section>
        )
    }

    if (isLoading) {
        return (
            <section>
                <h2>{t("budgets.title")}</h2>
                <p>{t("common.loading")}</p>
            </section>
        )
    }

    if (loadError) {
        return (
            <section>
                <h2>{t("budgets.title")}</h2>
                <p className="error-message">
                    {loadError}
                </p>
            </section>
        )
    }

    return (
        <section>
            <div className="page-header">
                <h2>{t("budgets.title")}</h2>

                {!showCreateBudget && !editingBudget && (
                    <button
                        className="button button-primary"
                        onClick={() => {
                            setShowCreateBudget(true)
                            setEditingBudget(null)
                        }}
                    >
                        {t("budgets.create")}
                    </button>
                )}
            </div>

            {actionError && (
                <p>{actionError}</p>
            )}

            {showCreateBudget && (
                <div className="card form-card">
                    <CreateBudgetForm
                        onCreate={handleCreateBudget}
                        categories={categories}
                        onCancel={() => setShowCreateBudget(false)}
                    />
                </div>
            )}

            {editingBudget && (
                <div className="card form-card">
                    <EditBudgetForm
                        budget={editingBudget}
                        onUpdate={handleUpdateBudget}
                        onCancel={() => setEditingBudget(null)}
                    />
                </div>
            )}

            <div className="budget-list-section">
                <h3>{t("budgets.list")}</h3>

                <div className="budget-list">
                    {budgets.length === 0 ? (
                        <p>{t("budgets.empty")}</p>
                    ) : (
                        budgets.map(budget => {
                            const category = categories.find(
                                category => category.id === budget.categoryId
                            )

                            if (!category) {
                                throw new Error(
                                    `Category not found for budget ${budget.id}`
                                )
                            }

                            return (
                                <BudgetItem
                                    key={budget.id}
                                    budget={budget}
                                    categoryName={getCategoryDisplayName(category, t)}
                                    onDelete={handleDeleteBudget}
                                    onEdit={handleEditBudget}
                                />
                            )
                        })
                    )}
                </div>
            </div>

            <section className="budget-progress-section">
                <div className="section-header">
                    <h3>{t("budgets.progress")}</h3>
                </div>

                <div className="card budget-period">
                    <PeriodSelector
                        year={selectedYear}
                        month={selectedMonth}
                        onYearChange={setSelectedYear}
                        onMonthChange={setSelectedMonth}
                    />
                </div>

                <div className="budget-progress-list">
                    {budgetProgress.length === 0 ? (
                        <p>{t("budgets.progressEmpty")}</p>
                    ) : (
                        budgetProgress.map(progress => (
                            <BudgetProgressItem
                                key={progress.budgetId}
                                progress={progress}
                            />
                        ))
                    )}
                </div>
            </section>
        </section>
    )
}

export default BudgetSection
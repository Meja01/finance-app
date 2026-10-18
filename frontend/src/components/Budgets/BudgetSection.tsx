import type {Category} from "../../types/Category.ts";
import {useEffect, useState} from "react";
import BudgetItem from "./BudgetItem.tsx";
import type {Budget} from "../../types/Budget.ts";
import CreateBudgetForm from "./CreateBudgetForm.tsx";
import EditBudgetForm from "./EditBudgetForm.tsx";
import type {BudgetProgress} from "../../types/BudgetProgress.ts";
import BudgetProgressItem from "./BudgetProgressItem.tsx";

type BudgetSectionProps = {
    accessToken: string,
    categories: Category[]
    categoriesLoaded: boolean
}

function BudgetSection({accessToken, categories, categoriesLoaded} : BudgetSectionProps) {
    const [budgets, setBudgets] = useState<Budget[]>([])
    const [showCreateBudget, setShowCreateBudget] = useState(false)
    const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
    const [budgetProgress, setBudgetProgress] = useState<BudgetProgress[]>([])
    const [selectedYear, setSelectedYear] = useState(2026)
    const [selectedMonth, setSelectedMonth] = useState(10)

    useEffect(() => {
        if (!accessToken) {
            return
        }
        fetch("http://localhost:8080/budgets", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load budgets: ${response.status}`)
                }
                return response.json()
            })
            .then(data => {
                console.log(data)
                setBudgets(data)
            })
            .catch(error => {
                console.error("Failed to load budgets:", error)
            })
    }, [accessToken])

    useEffect(() => {
        if (!accessToken) {
            return
        }

        fetch(
            `http://localhost:8080/budgets/progress?year=${selectedYear}&month=${selectedMonth}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )
            .then(response => {
                if (!response.ok) {
                    throw new Error(
                        `Failed to load budget progress: ${response.status}`
                    )
                }

                return response.json()
            })
            .then(data => {
                setBudgetProgress(data)
            })
            .catch(error => {
                console.error("Failed to load budget progress:", error)
            })

    }, [accessToken, selectedYear, selectedMonth])

    async function handleCreateBudget(
        categoryId: string,
        year: number,
        month: number,
        amount: number
    ) {
        const response = await fetch("http://localhost:8080/budgets", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                categoryId,
                year,
                month,
                amount
            })
        })

        if (!response.ok) {
            const errorMessage = await response.text()
            console.error("Backend error:", errorMessage)
            return
        }

        const createdBudget = await response.json()
        console.log("budget data:", createdBudget)
        setBudgets([...budgets, createdBudget])
        setShowCreateBudget(false)
    }

    async function handleDeleteBudget(budgetId: string) {
        const response = await fetch(
            `http://localhost:8080/budgets/${budgetId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        if (!response.ok) {
            const errorMessage = await response.text()
            console.error("Failed to delete budget:", errorMessage)
            return
        }

        setBudgets(budgets.filter(budget => budget.id !== budgetId))
    }

    async function handleUpdateBudget(budgetId: string, amount: number) {

        const response = await fetch(`http://localhost:8080/budgets/${budgetId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                amount
            })
        })
        if (!response.ok) {
            const errorMessage = await response.text()
            console.error("Failed to update budget:", errorMessage)
            return
        }
        const updatedBudget = await response.json()
        setBudgets(budgets.map(budget => budget.id === budgetId ? updatedBudget : budget))

    }

    function handleEditBudget(budget: Budget) {
        setEditingBudget(budget)
    }

    if (!categoriesLoaded) {
        return (
            <section>
                <h2>Budgets</h2>
                <p>Loading...</p>
            </section>
        )
    }

    return (
        <section>
            <h2>Budgets</h2>

            <div>
                <button
                    onClick={() => {
                        setShowCreateBudget(true)
                        setEditingBudget(null)
                    }}
                >
                    Create budget
                </button>
            </div>

            <div>
                {showCreateBudget && (
                    <CreateBudgetForm
                        onCreate={handleCreateBudget}
                        categories={categories}
                        onCancel={() => setShowCreateBudget(false)}
                    />
                )}

                {editingBudget && (
                    <EditBudgetForm
                        budget={editingBudget}
                        onUpdate={handleUpdateBudget}
                        onCancel={() => setEditingBudget(null)}
                    />
                )}
            </div>

            <div>
                {budgets.map(budget => {
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
                            categoryName={category.name}
                            onDelete={handleDeleteBudget}
                            onEdit={handleEditBudget}
                        />
                    )
                })}
            </div>

            <div>
                <h3>Budget progress</h3>

                <div>
                    <input
                        type="number"
                        value={selectedYear}
                        onChange={event =>
                            setSelectedYear(Number(event.target.value))
                        }
                    />
                    <select
                        value={selectedMonth}
                        onChange={event =>
                            setSelectedMonth(Number(event.target.value))
                        }
                    >
                        <option value={1}>January</option>
                        <option value={2}>February</option>
                        <option value={3}>March</option>
                        <option value={4}>April</option>
                        <option value={5}>May</option>
                        <option value={6}>June</option>
                        <option value={7}>July</option>
                        <option value={8}>August</option>
                        <option value={9}>September</option>
                        <option value={10}>October</option>
                        <option value={11}>November</option>
                        <option value={12}>December</option>
                    </select>
                </div>

                <div>
                    {budgetProgress.map(progress => (
                        <BudgetProgressItem
                            key={progress.budgetId}
                            progress={progress}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default BudgetSection
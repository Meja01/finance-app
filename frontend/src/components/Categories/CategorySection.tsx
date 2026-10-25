import { useTranslation } from "react-i18next"
import type {Category} from "../../types/Category.ts";
import {useState} from "react";
import {useAuth} from "../../auth/useAuth.ts";
import CreateCategoryForm from "./CreateCategoryForm.tsx";
import EditCategoryForm from "./EditCategoryForm.tsx";
import CategoryItem from "./CategoryItem.tsx";

type CategoriesSectionProps = {
    categories: Category[],
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>
    categoriesLoaded: boolean,
    categoriesError: string | null
}

export default function CategorySection({ categories, setCategories, categoriesLoaded, categoriesError} : CategoriesSectionProps) {
    const { t } = useTranslation()

    const [showCreateCategory, setShowCreateCategory] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [actionError, setActionError] = useState<string | null>(null)
    const { apiFetch } = useAuth()

    async function handleCreateCategory(name: string, type: "INCOME" | "EXPENSE"):Promise<boolean> {
        setActionError(null)
        try {
            const response = await apiFetch("http://localhost:8080/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    type
                })
            })
            if (!response.ok) {
                setActionError(t("categories.actionError"))
                return false
            }
            const createdCategory = await response.json()
            setCategories(currentCategories => [...currentCategories, createdCategory])
            setShowCreateCategory(false)
            return true
        }
        catch (error) {
            console.error(error)
            setActionError(t("categories.actionError"))
            return false
        }
    }

    async function handleUpdateCategory(categoryId: string, name: string):Promise<boolean> {
        setActionError(null)
        try {
            const response = await apiFetch(`http://localhost:8080/categories/${categoryId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name
                })
            })
            if (!response.ok) {
                setActionError(t("categories.actionError"))
                return false
            }
            const updatedCategory = await response.json()
            setCategories(currentCategories =>
                currentCategories.map(category => category.id === categoryId ? updatedCategory : category))

            setEditingCategory(null)
            return true
        }
        catch (error) {
            console.error(error)
            setActionError(t("categories.actionError"))
            return false
        }

    }

    async function handleDeleteCategory(categoryId: string) {
        setActionError(null)
        try {
            const response = await apiFetch(
                `http://localhost:8080/categories/${categoryId}`,
                {
                    method: "DELETE",
                }
            )

            if (!response.ok) {
                setActionError(t("categories.actionError"))
                return
            }

            setCategories(currentCategories =>
                currentCategories.filter(category => category.id !== categoryId))
        } catch (error) {
            console.error(error)
            setActionError(t("categories.actionError"))
        }
    }

    function handleEditCategory(category: Category) {
        setEditingCategory(category)
    }

    if (!categoriesLoaded) {
        return (
            <section>
                <h2>{t("categories.title")}</h2>
                <p>{t("common.loading")}</p>
            </section>
        )
    }

    if (categoriesError) {
        return (
            <section>
                <h2>{t("categories.title")}</h2>
                <p>{categoriesError}</p>
            </section>
        )
    }

    return (
        <section>
            <div className="page-header">
                <h2>{t("categories.title")}</h2>

                {!showCreateCategory && !editingCategory && (
                    <button
                        className="button button-primary"
                        onClick={() => setShowCreateCategory(true)}
                    >
                        {t("categories.create")}
                    </button>
                )}
            </div>

            {actionError && (
                <p className="error-message">
                    {actionError}
                </p>
            )}

            {showCreateCategory && (
                <div className="card form-card">
                    <CreateCategoryForm
                        onCreate={handleCreateCategory}
                        onCancel={() => setShowCreateCategory(false)}
                    />
                </div>
            )}

            {editingCategory && (
                <div className="card form-card">
                    <EditCategoryForm
                        category={editingCategory}
                        onUpdate={handleUpdateCategory}
                        onCancel={() => setEditingCategory(null)}
                    />
                </div>
            )}

            <div className="category-list">
                {categories.map(category => (
                    <CategoryItem
                        key={category.id}
                        category={category}
                        onEdit={handleEditCategory}
                        onDelete={handleDeleteCategory}
                    />
                ))}
            </div>
        </section>
    )
}
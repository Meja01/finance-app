import {useEffect, useState} from "react";
import './App.css'
import AccountSection from "./components/Accounts/AccountSection.tsx"
import AuthSection from "./components/Auth/AuthSection.tsx";
import type {Account} from "./types/Account.ts";
import TransactionSection from "./components/TransactionSection/TransactionSection.tsx";
import BudgetSection from "./components/Budgets/BudgetSection.tsx";
import type {Category} from "./types/Category.ts";
import RecurringTransactionSection from "./components/RecurringTransactionSection/RecurringTransactionSection.tsx";
import StatsSection from "./components/Stats/StatsSection.tsx";
import DashboardSection from "./components/Dashboard/DashboardSection.tsx";
import {useTranslation} from "react-i18next"
import {useAuth} from "./auth/useAuth.ts";
import CategorySection from "./components/Categories/CategorySection.tsx";

type Page =
    | "dashboard"
    | "accounts"
    | "transactions"
    | "categories"
    | "budgets"
    | "recurring"
    | "statistics"

function App() {
    const {
        accessToken,
        isAuthenticated,
        authInitializing,
        handleLogout,
        apiFetch
    } = useAuth()

    const [accounts, setAccounts] = useState<Account[]>([])
    const [accountsLoaded, setAccountsLoaded] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [categoriesLoaded, setCategoriesLoaded] = useState(false)

    const [currentPage, setCurrentPage] = useState<Page>("dashboard")

    const { t, i18n } = useTranslation()
    const [accountsError, setAccountsError] = useState<string | null>(null)
    const [categoriesError, setCategoriesError] = useState<string | null>(null)

    useEffect(() => {
        if (!accessToken) {
            return
        }

        async function loadAccounts() {
            setAccountsLoaded(false)
            setAccountsError(null)

            try {
                const response = await apiFetch("http://localhost:8080/accounts")

                if (!response.ok) {
                    setAccountsError(t("accounts.loadError"))
                    return
                }

                const data = await response.json()
                setAccounts(data)

            } catch (error) {
                console.error("Failed to load accounts:", error)
                setAccountsError(t("accounts.loadError"))

            } finally {
                setAccountsLoaded(true)
            }
        }
        void loadAccounts()
    }, [accessToken])

    useEffect(() => {
        if (!accessToken) {
            return
        }

        async function loadCategories() {
            setCategoriesLoaded(false)
            setCategoriesError(null)

            try {
                const response = await apiFetch("http://localhost:8080/categories")

                if (!response.ok) {
                    setCategoriesError(t("transactions.categories.loadError"))
                    return
                }

                const data = await response.json()
                setCategories(data)

            } catch (error) {
                console.error("Failed to load categories:", error)
                setCategoriesError(t("transactions.categories.loadError"))
            } finally {
                setCategoriesLoaded(true)
            }
        }
        void loadCategories()
    }, [accessToken])

    if (authInitializing) {
        return (
            <p>{t("common.loading")}</p>
        )
    }

    return (<div className="app-shell">
                {isAuthenticated && (
                    <aside className="sidebar">
                        <div className="sidebar-header">
                            <h1>{t("appTitle")}</h1>
                        </div>

                        <nav className="sidebar-nav">
                            <button className={currentPage === "dashboard" ? "nav-item active" : "nav-item"}
                                onClick={() => setCurrentPage("dashboard")}>
                                {t("navigation.dashboard")}
                            </button>

                            <button className={currentPage === "accounts" ? "nav-item active" : "nav-item"}
                                onClick={() => setCurrentPage("accounts")}>
                                {t("navigation.accounts")}
                            </button>

                            <button className={currentPage === "transactions" ? "nav-item active" : "nav-item"}
                                onClick={() => setCurrentPage("transactions")}>
                                {t("navigation.transactions")}
                            </button>

                            <button className={currentPage === "categories" ? "nav-item active" : "nav-item"}
                                onClick={() => setCurrentPage("categories")}>
                                {t("navigation.categories")}
                            </button>

                            <button className={currentPage === "budgets" ? "nav-item active" : "nav-item"}
                                onClick={() => setCurrentPage("budgets")}>
                                {t("navigation.budgets")}
                            </button>

                            <button className={currentPage === "recurring" ? "nav-item active" : "nav-item"}
                                onClick={() => setCurrentPage("recurring")}>
                                {t("navigation.recurring")}
                            </button>

                            <button className={currentPage === "statistics" ? "nav-item active" : "nav-item"}
                                onClick={() => setCurrentPage("statistics")}>
                                {t("navigation.statistics")}
                            </button>
                        </nav>

                        <div className="sidebar-footer">
                            <select
                                value={i18n.language}
                                onChange={event =>
                                    i18n.changeLanguage(event.target.value)
                                }
                            >
                                <option value="en">English</option>
                                <option value="de">Deutsch</option>
                            </select>

                            <button onClick={handleLogout}>
                                {t("navigation.logout")}
                            </button>
                        </div>
                    </aside>
                )}

                <main className="main-content">
                    <div className="content-container">
                        {!isAuthenticated && (
                            <AuthSection/>
                        )}

                        {isAuthenticated && currentPage === "dashboard" && (
                            <DashboardSection/>
                        )}

                        {isAuthenticated && currentPage === "accounts" && (
                            <AccountSection
                                accounts={accounts}
                                setAccounts={setAccounts}
                                accountsLoaded={accountsLoaded}
                                accountsError={accountsError}
                            />
                        )}

                        {isAuthenticated && currentPage === "transactions" && (
                            <TransactionSection
                                accounts={accounts}
                                accountsLoaded={accountsLoaded}
                                categories={categories}
                                categoriesLoaded={categoriesLoaded}
                                categoriesError={categoriesError}
                                accountsError={accountsError}
                            />
                        )}

                        {isAuthenticated && currentPage === "categories" && (
                            <CategorySection
                                categories={categories}
                                setCategories={setCategories}
                                categoriesLoaded={categoriesLoaded}
                                categoriesError={categoriesError}
                            />
                        )}

                        {isAuthenticated && currentPage === "budgets" && (
                            <BudgetSection
                                categories={categories}
                                categoriesLoaded={categoriesLoaded}
                                categoriesError={categoriesError}
                            />
                        )}

                        {isAuthenticated && currentPage === "recurring" && (
                            <RecurringTransactionSection
                                accounts={accounts}
                                accountsLoaded={accountsLoaded}
                                categories={categories}
                                categoriesLoaded={categoriesLoaded}
                                categoriesError={categoriesError}
                                accountsError={accountsError}
                            />
                        )}

                        {isAuthenticated && currentPage === "statistics" && (
                            <StatsSection/>
                        )}
                    </div>
                </main>
            </div>
    )
}

export default App

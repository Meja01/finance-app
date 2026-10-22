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
import { useTranslation } from "react-i18next"

type Page =
    | "dashboard"
    | "accounts"
    | "transactions"
    | "budgets"
    | "recurring"
    | "statistics"

function App() {
    const [accessToken, setAccessToken] = useState("")
    const [refreshToken, setRefreshToken] = useState("")
    const isAuthenticated = accessToken !== ""
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
                const response = await fetch(
                    "http://localhost:8080/accounts",
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }
                )

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
                const response = await fetch(
                    "http://localhost:8080/categories",
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }
                )

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

    async function handleLogout() {
        try {
            const response = await fetch(
                "http://localhost:8080/users/logout",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        refreshToken
                    })
                }
            )

            if (!response.ok) {
                console.error(`Logout request failed: ${response.status}`)
            }

        } catch (error) {
            console.error("Logout request failed:", error)
        } finally {
            setAccessToken("")
            setRefreshToken("")
            setAccounts([])
            setCategories([])
            setAccountsLoaded(false)
            setCategoriesLoaded(false)
            setAccountsError(null)
            setCategoriesError(null)
            setCurrentPage("dashboard")
        }
    }

    function handleLoginSuccess(
        accessToken: string,
        refreshToken: string
    ) {
        setAccessToken(accessToken)
        setRefreshToken(refreshToken)
    }


    return (
        <div>
            <header>
                <h1>{t("appTitle")}</h1>

                {isAuthenticated && (
                    <nav>
                        <button onClick={() => setCurrentPage("dashboard")}>
                            {t("navigation.dashboard")}
                        </button>

                        <button onClick={() => setCurrentPage("accounts")}>
                            {t("navigation.accounts")}
                        </button>

                        <button onClick={() => setCurrentPage("transactions")}>
                            {t("navigation.transactions")}
                        </button>

                        <button onClick={() => setCurrentPage("budgets")}>
                            {t("navigation.budgets")}
                        </button>

                        <button onClick={() => setCurrentPage("recurring")}>
                            {t("navigation.recurring")}
                        </button>

                        <button onClick={() => setCurrentPage("statistics")}>
                            {t("navigation.statistics")}
                        </button>

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
                    </nav>
                )}
            </header>

            <main>
                {!isAuthenticated && (
                    <AuthSection
                        onLoginSuccess={handleLoginSuccess}
                    />
                )}

                {isAuthenticated && currentPage === "dashboard" && (
                    <DashboardSection accessToken={accessToken} />
                )}

                {isAuthenticated && currentPage === "accounts" && (
                    <AccountSection
                        accessToken={accessToken}
                        accounts={accounts}
                        setAccounts={setAccounts}
                        accountsLoaded={accountsLoaded}
                        accountsError={accountsError}
                    />
                )}

                {isAuthenticated && currentPage === "transactions" && (
                    <TransactionSection
                        accessToken={accessToken}
                        accounts={accounts}
                        accountsLoaded={accountsLoaded}
                        categories={categories}
                        categoriesLoaded={categoriesLoaded}
                        setCategories={setCategories}
                        categoriesError={categoriesError}
                        accountsError={accountsError}
                    />
                )}

                {isAuthenticated && currentPage === "budgets" && (
                    <BudgetSection
                        accessToken={accessToken}
                        categories={categories}
                        categoriesLoaded={categoriesLoaded}
                        categoriesError={categoriesError}
                    />
                )}

                {isAuthenticated && currentPage === "recurring" && (
                    <RecurringTransactionSection
                        accessToken={accessToken}
                        accounts={accounts}
                        accountsLoaded={accountsLoaded}
                        categories={categories}
                        categoriesLoaded={categoriesLoaded}
                        categoriesError={categoriesError}
                        accountsError={accountsError}
                    />
                )}

                {isAuthenticated && currentPage === "statistics" && (
                    <StatsSection
                        accessToken={accessToken}
                    />
                )}
            </main>
        </div>
    )
}

export default App

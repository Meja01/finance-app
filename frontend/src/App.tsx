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

    useEffect(() => {
        if (!accessToken) {
            return
        }
        fetch("http://localhost:8080/accounts", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setAccounts(data)
                setAccountsLoaded(true)
            })
            .catch(error => {
                console.error("Failed to load accounts:", error)
            })
    }, [accessToken])

    useEffect(() => {
        if (!accessToken) {
            return
        }
        fetch("http://localhost:8080/categories", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setCategories(data)
                setCategoriesLoaded(true)
            })
            .catch(error => {
                console.error("Failed to load categories:", error)
            })
    }, [accessToken])

    async function handleLogout() {
        await fetch("http://localhost:8080/users/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                refreshToken: refreshToken
            })
        })

        setAccessToken("")
        setRefreshToken("")
        setCurrentPage("dashboard")
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
                    />
                )}

                {isAuthenticated && currentPage === "budgets" && (
                    <BudgetSection
                        accessToken={accessToken}
                        categories={categories}
                        categoriesLoaded={categoriesLoaded}
                    />
                )}

                {isAuthenticated && currentPage === "recurring" && (
                    <RecurringTransactionSection
                        accessToken={accessToken}
                        accounts={accounts}
                        accountsLoaded={accountsLoaded}
                        categories={categories}
                        categoriesLoaded={categoriesLoaded}
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

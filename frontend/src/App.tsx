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
                <h1>Finance Manager</h1>

                {isAuthenticated && (
                    <nav>
                        <button onClick={() => setCurrentPage("dashboard")}>
                            Dashboard
                        </button>

                        <button onClick={() => setCurrentPage("accounts")}>
                            Accounts
                        </button>

                        <button onClick={() => setCurrentPage("transactions")}>
                            Transactions
                        </button>

                        <button onClick={() => setCurrentPage("budgets")}>
                            Budgets
                        </button>

                        <button onClick={() => setCurrentPage("recurring")}>
                            Recurring
                        </button>

                        <button onClick={() => setCurrentPage("statistics")}>
                            Statistics
                        </button>

                        <button onClick={handleLogout}>
                            Logout
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

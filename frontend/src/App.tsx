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

function App() {
    const [accessToken, setAccessToken] = useState("")
    const [refreshToken, setRefreshToken] = useState("")
    const isAuthenticated = accessToken !== ""
    const [accounts, setAccounts] = useState<Account[]>([])
    const [accountsLoaded, setAccountsLoaded] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [categoriesLoaded, setCategoriesLoaded] = useState(false)

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
            <h1>Finance Manager</h1>
            {!isAuthenticated && (
                <AuthSection
                    onLoginSuccess={handleLoginSuccess}
                />
            )}

            {isAuthenticated && (
                <><button onClick={handleLogout}>Logout</button>
                <AccountSection
                    accessToken={accessToken}
                    accounts={accounts}
                    setAccounts={setAccounts}/>
                <TransactionSection
                    accessToken={accessToken}
                    accounts={accounts}
                    accountsLoaded={accountsLoaded}
                    categories={categories}
                    setCategories={setCategories}
                    categoriesLoaded={categoriesLoaded}
                />
                <BudgetSection
                    accessToken={accessToken}
                    categories={categories}
                    categoriesLoaded={categoriesLoaded}
                />
                <RecurringTransactionSection
                    accessToken={accessToken}
                    accounts={accounts}
                    accountsLoaded={accountsLoaded}
                    categories={categories}
                    categoriesLoaded={categoriesLoaded}
                />
                <StatsSection accessToken={accessToken} />
                </>
            )}
        </div>
    )
}

export default App

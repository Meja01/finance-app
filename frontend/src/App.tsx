import { useState} from "react";
import './App.css'
import AccountSection from "./components/Accounts/AccountSection.tsx"
import AuthSection from "./components/Auth/AuthSection.tsx";

function App() {
    const [accessToken, setAccessToken] = useState("")
    const [refreshToken, setRefreshToken] = useState("")
    const isAuthenticated = accessToken !== ""

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
                <AccountSection accessToken={accessToken}/>
                </>
            )}
        </div>
    )
}

export default App

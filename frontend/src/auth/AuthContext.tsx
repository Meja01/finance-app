import {
    createContext,
    useEffect,
    useState,
    type ReactNode
} from "react"

type AuthContextType = {
    accessToken: string
    refreshToken: string
    isAuthenticated: boolean
    authInitializing: boolean
    handleLoginSuccess: (
        newAccessToken: string,
        newRefreshToken: string
    ) => void
    handleLogout: () => Promise<void>
    apiFetch: (
        url: string,
        options?: RequestInit
    ) => Promise<Response>
}

export const AuthContext =
    createContext<AuthContextType | undefined>(undefined)

type AuthProviderProps = {
    children: ReactNode
}

export function AuthProvider({children}: AuthProviderProps) {

    const [accessToken, setAccessToken] = useState("")
    const [refreshToken, setRefreshToken] = useState("")
    const [authInitializing, setAuthInitializing] = useState(true)

    const isAuthenticated = accessToken !== ""

    function handleLoginSuccess(
        newAccessToken: string,
        newRefreshToken: string
    ) {
        setAccessToken(newAccessToken)
        setRefreshToken(newRefreshToken)

        localStorage.setItem("refreshToken", newRefreshToken)
    }

    function clearSession() {
        setAccessToken("")
        setRefreshToken("")

        localStorage.removeItem("refreshToken")
    }

    async function refreshAccessToken(token: string): Promise<string | null> {
        try {
            const response = await fetch(
                "http://localhost:8080/users/refresh",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        refreshToken: token
                    })
                }
            )

            if (!response.ok) {
                return null
            }

            const data = await response.json()

            setAccessToken(data.accessToken)
            return data.accessToken

        } catch (error) {
            console.error("Failed to refresh access token:", error)
            return null
        }
    }

    async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {

        const response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${accessToken}`
            }
        })

        if (response.status !== 401) {
            return response
        }

        const newAccessToken = await refreshAccessToken(refreshToken)

        if (!newAccessToken) {
            clearSession()
            return response
        }

        return fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${newAccessToken}`
            }
        })
    }

    useEffect(() => {
        async function initializeAuth() {
            const storedRefreshToken =
                localStorage.getItem("refreshToken")

            if (!storedRefreshToken) {
                setAuthInitializing(false)
                return
            }

            try {
                const response = await fetch(
                    "http://localhost:8080/users/refresh",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            refreshToken: storedRefreshToken
                        })
                    }
                )

                if (!response.ok) {
                    localStorage.removeItem("refreshToken")
                    return
                }

                const data = await response.json()

                setRefreshToken(storedRefreshToken)
                setAccessToken(data.accessToken)

            } catch (error) {
                console.error("Failed to restore session:", error)

            } finally {
                setAuthInitializing(false)
            }
        }

        void initializeAuth()

    }, [])

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
                console.error(
                    `Logout request failed: ${response.status}`
                )
            }

        } catch (error) {
            console.error("Logout request failed:", error)

        } finally {
            clearSession()
        }
    }

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                refreshToken,
                isAuthenticated,
                authInitializing,
                handleLoginSuccess,
                handleLogout,
                apiFetch
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
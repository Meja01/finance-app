import {useState} from "react";
import LoginForm from "./LoginForm.tsx";
import RegisterForm from "./RegisterForm.tsx";
import {useTranslation} from "react-i18next";
import {useAuth} from "../../auth/useAuth.ts";


function AuthSection() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [authMode, setAuthMode] = useState<"login" | "register">("login")
    const { t } = useTranslation()
    const [authError, setAuthError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const {handleLoginSuccess} = useAuth()


    async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        setAuthError(null)
        setIsSubmitting(true)

        try {
            const response = await fetch(
                "http://localhost:8080/users/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            )

            if (!response.ok) {
                setAuthError(t("auth.registerError"))
                return
            }

            await response.json()
            setAuthMode("login")

        } catch (error) {
            console.error("Registration failed:", error)
            setAuthError(t("auth.registerError"))

        } finally {
            setIsSubmitting(false)
        }
    }

    async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        setAuthError(null)
        setIsSubmitting(true)

        try {
            const response = await fetch(
                "http://localhost:8080/users/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            )

            if (!response.ok) {
                setAuthError(t("auth.loginError"))
                return
            }
            const data = await response.json()
            handleLoginSuccess(data.accessToken, data.refreshToken)

        } catch (error) {
            console.error("Login failed:", error)
            setAuthError(t("auth.loginError"))

        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section className="auth-page">
            <div className="card auth-card">
                <div className="auth-header">
                    <h2>{t("auth.title")}</h2>
                </div>

                {authError && (
                    <p className="auth-error">
                        {authError}
                    </p>
                )}

                {authMode === "login" && (
                    <LoginForm
                        email={email}
                        password={password}
                        setEmail={setEmail}
                        setPassword={setPassword}
                        onSubmit={handleLogin}
                        onSwitchToRegister={() => setAuthMode("register")}
                        isSubmitting={isSubmitting}
                    />
                )}

                {authMode === "register" && (
                    <RegisterForm
                        name={name}
                        email={email}
                        password={password}
                        setName={setName}
                        setEmail={setEmail}
                        setPassword={setPassword}
                        onSubmit={handleRegister}
                        onSwitchToLogin={() => setAuthMode("login")}
                        isSubmitting={isSubmitting}
                    />
                )}
            </div>
        </section>
    )
}

export default AuthSection
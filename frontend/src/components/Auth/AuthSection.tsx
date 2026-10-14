import {useState} from "react";
import LoginForm from "./LoginForm.tsx";
import RegisterForm from "./RegisterForm.tsx";

type AuthSectionProps = {
    onLoginSuccess: (
        accessToken: string,
        refreshToken: string
    ) => void
}

function AuthSection({ onLoginSuccess } : AuthSectionProps) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [authMode, setAuthMode] = useState<"login" | "register">("login")


    async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const response = await fetch("http://localhost:8080/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        })
        if (!response.ok) {
            console.error("Registration failed:", response.status)
            return
        }

        const data = await response.json()
        console.log("Registered user:", data)
        setAuthMode("login")
    }

    async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const response = await fetch("http://localhost:8080/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })

        const data = await response.json()
        console.log("Logged user:", data)
        onLoginSuccess(data.accessToken, data.refreshToken)
    }

    return (
        <section>
            <h2>Authentication</h2>
            {authMode === "login" && (
                <LoginForm
                    email={email}
                    password={password}
                    setEmail={setEmail}
                    setPassword={setPassword}
                    onSubmit={handleLogin}
                    onSwitchToRegister={() => setAuthMode("register")}
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
                />
            )}
        </section>
    );
}

export default AuthSection
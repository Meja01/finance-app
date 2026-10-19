import {useTranslation} from "react-i18next";

type LoginFormProps = {
    email: string
    password: string
    setEmail: (value: string) => void
    setPassword: (value: string) => void
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
    onSwitchToRegister: () => void
}

function LoginForm({
   email,
   password,
   setEmail,
   setPassword,
   onSubmit,
   onSwitchToRegister
}: LoginFormProps) {
    const { t } = useTranslation()
    return (
        <form onSubmit={onSubmit}>
            <input
                type="email"
                placeholder={t("auth.email")}
                value={email}
                onChange={event => setEmail(event.target.value)}
                autoComplete="username"
            />

            <input
                type="password"
                placeholder={t("auth.password")}
                value={password}
                onChange={event => setPassword(event.target.value)}
                autoComplete="current-password"
            />

            <button type="submit">
                {t("auth.login")}
            </button>

            <button
                type="button"
                onClick={onSwitchToRegister}
            >
                {t("auth.switchToRegister")}
            </button>
        </form>
    )
}

export default LoginForm
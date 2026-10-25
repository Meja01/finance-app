import {useTranslation} from "react-i18next";

type LoginFormProps = {
    email: string
    password: string
    setEmail: (value: string) => void
    setPassword: (value: string) => void
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
    onSwitchToRegister: () => void
    isSubmitting: boolean
}

function LoginForm({
   email,
   password,
   setEmail,
   setPassword,
   onSubmit,
   onSwitchToRegister,
   isSubmitting
}: LoginFormProps) {
    const { t } = useTranslation()
    return (
        <form className="form" onSubmit={onSubmit}>
            <div className="form-group">
                <label htmlFor="login-email">
                    {t("auth.email")}
                </label>

                <input
                    id="login-email"
                    className="form-control"
                    type="email"
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    autoComplete="username"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="login-password">
                    {t("auth.password")}
                </label>

                <input
                    id="login-password"
                    className="form-control"
                    type="password"
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                />
            </div>

            <div className="form-actions auth-actions">
                <button
                    type="submit"
                    className="button button-primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? t("common.loading")
                        : t("auth.login")}
                </button>

                <button
                    type="button"
                    className="button button-secondary"
                    onClick={onSwitchToRegister}
                    disabled={isSubmitting}
                >
                    {t("auth.switchToRegister")}
                </button>
            </div>
        </form>
    )
}

export default LoginForm
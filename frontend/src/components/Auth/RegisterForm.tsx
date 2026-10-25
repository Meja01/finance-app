import {useTranslation} from "react-i18next";

type RegisterFormProps = {
    name: string
    email: string
    password: string
    setName: (value: string) => void
    setEmail: (value: string) => void
    setPassword: (value: string) => void
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
    onSwitchToLogin: () => void,
    isSubmitting: boolean
}

function RegisterForm({
                          name,
                          email,
                          password,
                          setName,
                          setEmail,
                          setPassword,
                          onSubmit,
                          onSwitchToLogin,
                          isSubmitting
                      }: RegisterFormProps) {
    const { t } = useTranslation()
    return (
        <form className="form" onSubmit={onSubmit}>
            <div className="form-group">
                <label htmlFor="register-name">
                    {t("auth.name")}
                </label>

                <input
                    id="register-name"
                    className="form-control"
                    type="text"
                    value={name}
                    onChange={event => setName(event.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="register-email">
                    {t("auth.email")}
                </label>

                <input
                    id="register-email"
                    className="form-control"
                    type="email"
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    autoComplete="username"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="register-password">
                    {t("auth.password")}
                </label>

                <input
                    id="register-password"
                    className="form-control"
                    type="password"
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    autoComplete="new-password"
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
                        : t("auth.register")}
                </button>

                <button
                    type="button"
                    className="button button-secondary"
                    onClick={onSwitchToLogin}
                    disabled={isSubmitting}
                >
                    {t("auth.switchToLogin")}
                </button>
            </div>
        </form>
    )
}

export default RegisterForm
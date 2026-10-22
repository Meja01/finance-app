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
        <form onSubmit={onSubmit}>
            <input
                type="text"
                placeholder={t("auth.name")}
                value={name}
                onChange={event => setName(event.target.value)}
            />

            <input
                type="email"
                placeholder={t("auth.email")}
                value={email}
                onChange={event => setEmail(event.target.value)}
            />

            <input
                type="password"
                placeholder={t("auth.password")}
                value={password}
                onChange={event => setPassword(event.target.value)}
                autoComplete="new-password"
            />

            <button type="submit" disabled={isSubmitting}>
                {t("auth.register")}
            </button>

            <button
                type="button"
                onClick={onSwitchToLogin}
            >
                {t("auth.switchToLogin")}
            </button>
        </form>
    )
}

export default RegisterForm
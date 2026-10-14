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
    return (
        <form onSubmit={onSubmit}>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                autoComplete="username"
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                autoComplete="current-password"
            />

            <button type="submit">
                Login
            </button>

            <button
                type="button"
                onClick={onSwitchToRegister}
            >
                Create account
            </button>
        </form>
    )
}

export default LoginForm
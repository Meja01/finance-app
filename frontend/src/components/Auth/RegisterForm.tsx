type RegisterFormProps = {
    name: string
    email: string
    password: string
    setName: (value: string) => void
    setEmail: (value: string) => void
    setPassword: (value: string) => void
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
    onSwitchToLogin: () => void
}

function RegisterForm({
                          name,
                          email,
                          password,
                          setName,
                          setEmail,
                          setPassword,
                          onSubmit,
                          onSwitchToLogin
                      }: RegisterFormProps) {
    return (
        <form onSubmit={onSubmit}>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={event => setName(event.target.value)}
            />

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={event => setEmail(event.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                autoComplete="new-password"
            />

            <button type="submit">
                Register
            </button>

            <button
                type="button"
                onClick={onSwitchToLogin}
            >
                Back to login
            </button>
        </form>
    )
}

export default RegisterForm
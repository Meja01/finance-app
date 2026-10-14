import {useState} from "react";

type CreateAccountFormProps = {
    onCreate: (
        name: string,
        type: "CARD" | "CASH",
        initialBalance: number
    ) => Promise<void>
}

function CreateAccountForm({ onCreate }: CreateAccountFormProps) {
    const [name, setName] = useState("")
    const [type, setType] = useState<"CARD" | "CASH">("CARD")
    const [initialBalance, setInitialBalance] = useState("")

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        await onCreate(
            name,
            type,
            Number(initialBalance)
        )

        setName("")
        setType("CARD")
        setInitialBalance("")
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Account name"
                value={name}
                onChange={event => setName(event.target.value)}
            />

            <select
                value={type}
                onChange={event =>
                    setType(event.target.value as "CARD" | "CASH")
                }
            >
                <option value="CARD">Card</option>
                <option value="CASH">Cash</option>
            </select>

            <input
                type="number"
                placeholder="Initial balance"
                value={initialBalance}
                onChange={event => setInitialBalance(event.target.value)}
            />

            <button type="submit">
                Create account
            </button>
        </form>
    )
}

export default CreateAccountForm
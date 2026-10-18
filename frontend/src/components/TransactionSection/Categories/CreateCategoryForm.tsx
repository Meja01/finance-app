import {useState} from "react";

type CreateCategoryFormProps = {
    onCreate: (
        name: string,
        type: "EXPENSE" | "INCOME"
    ) => Promise<void>
    onCancel: () => void
}
function CreateCategoryForm({onCreate, onCancel} : CreateCategoryFormProps) {
    const [name, setName] = useState("")
    const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE")

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        await onCreate(
            name,
            type
        )

        setName("")
        setType("EXPENSE")
    }
    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={event => setName(event.target.value)}
                required
            />
            <select
                value={type}
                onChange={event => {
                    setType(event.target.value as "INCOME" | "EXPENSE")
                }}
            >
                <option value="INCOME">INCOME</option>
                <option value="EXPENSE">EXPENSE</option>
            </select>

            <button type="submit">
                Create category
            </button>
            <button
                type="button"
                onClick={onCancel}
            >
                Cancel
            </button>
        </form>
    )
}

export default CreateCategoryForm
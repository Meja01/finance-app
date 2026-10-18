export type Category = {
    id: string
    name: string
    type: "INCOME" | "EXPENSE"
    userId: string | null
    global: boolean
}
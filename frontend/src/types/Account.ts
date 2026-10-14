export type Account = {
    id: string
    name: string
    type: "CARD" | "CASH"
    initialBalance: number
    createdAt: string
}
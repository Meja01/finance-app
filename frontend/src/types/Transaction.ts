export type Transaction = {
    id: string
    accountId: string
    categoryId: string
    amount: number
    dateTime: string
    note: string | null
    transactionType: "INCOME" | "EXPENSE"
    createdAt: string
}
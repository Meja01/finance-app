export type RecurringTransaction = {
    id: string
    accountId: string
    categoryId: string
    amount: number
    note: string | null
    type: "INCOME" | "EXPENSE"
    frequency: "WEEKLY" | "MONTHLY" | "YEARLY"
    startDate: string
    endDate: string | null
    nextExecutionDate: string
    active: boolean
    createdAt: string
}
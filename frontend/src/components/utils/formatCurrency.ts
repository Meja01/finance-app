export function formatCurrency(value: number, language: string) {
    return new Intl.NumberFormat(
        language,
        {
            style: "currency",
            currency: "EUR"
        }
    ).format(value)
}
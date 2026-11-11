export function formatCurrency(amount: number, language: string) {
    const currency = language === "sr" ? "BAM" : "EUR";
    return new Intl.NumberFormat(language, {
        style: "currency",
        currency
    }).format(amount);
}
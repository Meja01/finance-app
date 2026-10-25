export function formatDateTime(
    value: string,
    language: string
) {
    return new Intl.DateTimeFormat(
        language,
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    ).format(new Date(value))
}
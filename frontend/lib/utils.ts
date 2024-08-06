export function formatDate(date: Date): string {
    let year: number = date.getFullYear()
    let month: string = (date.getMonth() + 1).toString().padStart(2, '0')
    let day: string = date.getDate().toString().padStart(2, '0')

    return `${year}-${month}-${day}`
}

export function formatDateToMMDYYYY(dateString: string): string {
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ]

    const [year, month, day] = dateString.split('-').map(Number)

    // Adjust for zero-based month index
    const monthName = months[month - 1]

    return `${monthName} ${day}, ${year}`
}

export function formatDate(date: Date): string {
    let year: number = date.getFullYear()
    let month: string = (date.getMonth() + 1).toString().padStart(2, '0')
    let day: string = date.getDate().toString().padStart(2, '0')

    return `${year}-${month}-${day}`
}

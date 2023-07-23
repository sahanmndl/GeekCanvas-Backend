export function convertDateToUnix (date) {
    return Math.round(date.getTime() / 1000)
}
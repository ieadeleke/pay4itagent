import moment from "moment";

export function formatDate(date: string) {
    return moment(date).format("MMMM D, YYYY h:mm A")
}
export function formatDateShort(date: string) {
    if (date) {
        return moment(date).format("MMM D, YYYY h:mm A")
    } else {
        "-"
    }
}

export function formatDateWithoutTime(date: string) {
    return moment(date).format("MMMM D, YYYY")
}
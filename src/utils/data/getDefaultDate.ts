export function getDefaultDateAsString() {
    const today = new Date();
    const lastMonth = new Date(today)
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    
    return {
        startDate: formatDate(lastMonth),
        endDate: formatDate(today)
    };
}

export function getDefaultDate() {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    return {
        startDate: startDate,
        endDate: endDate
    };
}

function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function convertToDate(date: string) {
    const [year, month, day] = date.split('-').map(Number);
    return new Date(year, month - 1, day);
}

export function convertDateToFormat(date: Date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}/${month}/${day}`
}

export function convertDateToSecondFormat(date: Date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}
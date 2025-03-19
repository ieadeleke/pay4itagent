
export function errorHandler(error: any) {
    const { response } = error
    if (response && response.data) {
        const { data, status } = response
        const message = data.message ?? data.statusMessage
        if (message) {
            return {
                status: status as number,
                message: message as string
            }
        } else {
            return {
                status: status,
                message: "An unexpected error has occurred"
            }
        }
    } else {
        return {
            status: 500,
            message: error.message || "An unexpected error has occurred"
        }
    }

}
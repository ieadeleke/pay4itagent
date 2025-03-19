import { useState } from "react"
import { useApi } from "../index"
import { ChargeService } from "@/utils/services/charge"
import { PrintReceiptParams } from "@/utils/services/charge/types"
import { Reference } from "@/models/reference"

export const usePrintReceipt = () => {
    const [data, setData] = useState<Reference | null>(null)
    const { isLoading, error, execute } = useApi()

    async function printReceipt(params: PrintReceiptParams) {
        setData(null)
        const response = await execute(async () => await ChargeService().printReceipt(params))
        if (response) {
            setData(response)
        }
    }

    return { isLoading, error, data, printReceipt }
}
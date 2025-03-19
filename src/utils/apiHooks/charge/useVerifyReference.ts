import { useState } from "react"
import { useApi } from "../index"
import { ChargeService } from "@/utils/services/charge"
import { VerifyReferenceParams } from "@/utils/services/charge/types"
import { Reference } from "@/models/reference"

export const useVerifyReference = () => {
    const [data, setData] = useState<Reference | null>(null)
    const { isLoading, error, execute } = useApi()

    async function verifyReference(params: VerifyReferenceParams) {
        setData(null)
        const response = await execute(async () => await ChargeService().verifyReference(params))
        if (response) {
            console.log(response)
            setData(response)
        }
    }

    return { isLoading, error, data, verifyReference }
}
import { useState } from "react"
import { useApi } from ".."
import { ConfirmResetPasswordParams } from "@/utils/services/auth/types"
import { AuthService } from "@/utils/services/auth"


export const useVerifyResetPassword = () => {
    const [isComplete, setIsComplete] = useState<boolean>(false)
    const { isLoading, error, execute } = useApi()

    async function verifyResetPassword(params: ConfirmResetPasswordParams) {
        setIsComplete(false)
        const response = await execute(async () => await AuthService().confirmResetPassword(params))
        if (response) {
            setIsComplete(true)
        }
    }

    return { isLoading, error, verifyResetPassword, isComplete }
}
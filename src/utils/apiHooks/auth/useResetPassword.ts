import { useState } from "react"
import { useApi } from ".."
import { ResetPasswordParams } from "@/utils/services/auth/types"
import { AuthService } from "@/utils/services/auth"


export const useResetPassword = () => {
    const [isComplete, setIsComplete] = useState<boolean>(false)
    const { isLoading, error, execute } = useApi()

    async function resetPassword(params: ResetPasswordParams) {
        setIsComplete(false)
        const response = await execute(async () => await AuthService().resetPassword(params))
        if (response) {
            setIsComplete(true)
        }
    }

    return { isLoading, error, resetPassword, isComplete }
}
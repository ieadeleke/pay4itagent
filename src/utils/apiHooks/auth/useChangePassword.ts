import { useState } from "react"
import { useApi } from ".."
import { ChangePasswordParams, ResetPasswordParams } from "@/utils/services/auth/types"
import { AuthService } from "@/utils/services/auth"


export const useChangePassword = () => {
    const [isComplete, setIsComplete] = useState<boolean>(false)
    const { isLoading, error, execute } = useApi()

    async function changePassword(params: ChangePasswordParams) {
        setIsComplete(false)
        const response = await execute(async () => await AuthService().changePassword(params))
        if (response) {
            setIsComplete(true)
        }
    }

    return { isLoading, error, changePassword, isComplete }
}
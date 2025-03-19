import { useContext, useState } from "react"
import { useApi } from ".."
import { LoginParams } from "@/utils/services/auth/types"
import { Profile } from "@/models/profile"
import { AuthService } from "@/utils/services/auth"
import UserContext from "@/context/UserContext"
import AuthToken from "@/utils/AuthToken"


export const useLogin = () => {
    const [data, setData] = useState<Profile | null>(null)
    const { isLoading, error, execute } = useApi()
    const { updateUser } = useContext(UserContext)

    async function login(params: LoginParams) {
        setData(null)
        const response = await execute(async () => await AuthService().login(params))
        if (response) {
            AuthToken().saveToken(response.token)
            updateUser(response.profile)
            setData(response.profile)
        }
    }

    return { isLoading, error, data, login }
}
import { useContext, useState } from "react"
import { useApi } from ".."
import { Profile } from "@/models/profile"
import UserContext from "@/context/UserContext"
import { ProfileService } from "@/utils/services/profile"


export const useFetchUser = () => {
    const [data, setData] = useState<any>({})
    const { isLoading, error, execute } = useApi()
    const { updateUser } = useContext(UserContext)

    async function fetchUser() {
        // setData(null)
        const response = await execute(async () => await ProfileService().getUser())
        if (response) {
            updateUser(response.user)
            setData(response.user)
        }
    }

    return { isLoading, error, data, fetchUser }
}
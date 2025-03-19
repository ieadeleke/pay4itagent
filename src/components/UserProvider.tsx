import { useFetchUser } from "@/utils/apiHooks/profile/useFetchUser"
import { useEffect } from "react"

type UserProviderProps = {
    children?: JSX.Element
}

export const UserProvider = (props: UserProviderProps) => {
    const { fetchUser } = useFetchUser()

    useEffect(() => {
        fetchUser()
    }, [])
    
    return props.children

}
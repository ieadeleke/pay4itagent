import { createContext } from "react"
import { Profile } from "@/models/profile"

type UserContextType = {
    user: Profile | null,
    updateUser: (value: Profile | null) => void
}

const UserContext = createContext<UserContextType>({
    user: null,
    updateUser: (value: Profile | null) => { }
})

export default UserContext
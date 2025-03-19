import { ControllableSnackBarStateParams } from "@/components/snackbar/ControllableSnackbar"
import { createContext } from "react"


type GlobalContextType = {
    showSnackBar: (payload: ControllableSnackBarStateParams) => void
}

const GlobalContext = createContext<GlobalContextType>({
    showSnackBar: (payload: ControllableSnackBarStateParams) => { }
})

export default GlobalContext
import { ControllableSnackBarStateParams } from "@/components/snackbar/ControllableSnackbar";
import { createContext } from "react";

export const GlobalActionContext = createContext({
    showSnackBar: (payload: ControllableSnackBarStateParams) => { }
})
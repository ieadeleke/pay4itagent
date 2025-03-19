import Alert, { AlertColor } from "@mui/material/Alert";
import SnackBar, { SnackbarOrigin } from "@mui/material/Snackbar";
import { useState } from "react";
import { forwardRef, useImperativeHandle } from "react";

type ControllableSnackBarProps = {

}

export type ControllableSnackBarStateParams = {
    message: string,
    severity: AlertColor,
    vertical?: SnackbarOrigin
}

export type ControllableSnackBarRef = {
    open: (payload: ControllableSnackBarStateParams) => void,
    close: () => void
}

const _ControllableSnackBar = forwardRef<ControllableSnackBarRef, ControllableSnackBarProps>((props: ControllableSnackBarProps, ref) => {
    const [state, setState] = useState<ControllableSnackBarStateParams | null>(null)
    const [isVisible, setIsVisible] = useState(false)

    function onClose() {
        setIsVisible(false)
        setIsVisible(false)
    }

    useImperativeHandle(ref, () => ({
        open(payload: ControllableSnackBarStateParams) {
            setState(payload)
            setIsVisible(true)
        },
        close() {
            onClose()
        }
    }))

    return <SnackBar autoHideDuration={3000} onClose={onClose} open={isVisible} anchorOrigin={state?.vertical || { vertical: 'top', horizontal: 'right' }}>
        <Alert variant="filled" className="text-white" style={{
            fontFamily: "Inter"
        }} severity={state?.severity}>{state?.message}</Alert>
    </SnackBar>
})

_ControllableSnackBar.displayName = "Controlalble_Snackbar_Component"
export const ControllableSnackBar = _ControllableSnackBar
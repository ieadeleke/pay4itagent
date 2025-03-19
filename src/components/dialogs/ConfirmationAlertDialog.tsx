import {
    AlertDialog as BaseAlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { forwardRef, useImperativeHandle, useRef, useState } from "react"

export type ConfirmationAlertDialogRef = {
    show: (params: ShowParams) => void,
    dismiss: () => void
}

type ShowParams = {
    data: {
        title: string,
        description?: string,
        label?: ActionLabel
    },
    onConfirm?: () => void,
    onCancel?: () => void
}

type ConfirmationAlertDialogProps = {
    
}

type ActionLabel = {
    confirm?: string,
    cancel?: string
}

export const ConfirmationAlertDialog = forwardRef<ConfirmationAlertDialogRef, ConfirmationAlertDialogProps>((props, ref) => {
    const [isVisible, setIsVisible] = useState(false)
    const [content, setContent] = useState({
        title: "",
        description: ""
    })
    const [labels, setLabels] = useState<ActionLabel>()
    const onConfirm = useRef<() => void>()
    const onCancel = useRef<() => void>()

    useImperativeHandle(ref, () => ({
        show(params: ShowParams) {
            setContent({
                title: params.data.title,
                description: params.data.description || ""
            })
            onConfirm.current = params.onConfirm
            onCancel.current = params.onCancel
            setLabels(params.data.label)
            setIsVisible(true)
        },
        dismiss() {
            dismissDialog()
        }
    }))

    function dismissDialog(){
        setIsVisible(false)
        setContent({title: "", description: ""})
        setLabels(undefined)
        onConfirm.current = undefined
        onCancel.current = undefined
    }

    return <BaseAlertDialog open={isVisible}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle className="text-center font-medium text-2xl text-[#3F3F3F]">{content.title || ""}</AlertDialogTitle>
                <AlertDialogDescription className="text-center">
                    {content.description || ""}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel className="flex-1 py-6" onClick={onCancel.current}>{labels?.cancel || "Cancel"}</AlertDialogCancel>
                
                <AlertDialogAction className="flex-1 py-6 text-white" onClick={onConfirm.current}>{labels?.confirm || "Confirm"}</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </BaseAlertDialog>
})

ConfirmationAlertDialog.displayName = "ConfirmationAlertDialog"
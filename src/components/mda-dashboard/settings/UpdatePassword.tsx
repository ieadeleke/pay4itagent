import Button from "@/components/buttons"
import { TextField } from "@/components/input/InputText"
import { GlobalActionContext } from "@/context/GlobalActionContext"
import { useChangePassword } from "@/utils/apiHooks/auth/useChangePassword"
import { Input } from "antd"
import { useContext, useEffect, useState } from "react"

export const UpdatePassword = () => {
    const [oldPassword, setOldPassoword] = useState('')
    const [password, setPassword] = useState('')
    const [password1, setPassword1] = useState('')
    const { showSnackBar } = useContext(GlobalActionContext)
    const { changePassword, isLoading, error, isComplete } = useChangePassword()

    useEffect(() => {
        if (isComplete) {
            showSnackBar({
                message: "Password successfully updated",
                severity: 'success'
            })
        }
    }, [isComplete])

    useEffect(() => {
        if (error) {
            showSnackBar({
                message: error,
                severity: 'error'
            })
        }
    }, [error])

    function submit() {
        if (password.trim().length < 4) {
            return showSnackBar({
                message: "Password should be at least 4 characters or more",
                severity: 'error'
            })
        } else if (password.trim() != password1.trim()) {
            return showSnackBar({
                message: "Passwords do not match",
                severity: 'error'
            })
        }
        changePassword({
            newPassword: password,
            oldPassword
        })
    }

    return <div className="flex flex-col py-4">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-3">
            <div className="flex flex-col gap-2">
                <h1 className="font-semibold">Old Password</h1>
                <Input.Password 
                style={{height: "4rem"}}
                onChange={(evt) => setOldPassoword(evt.target.value)} value={oldPassword} type="password" className="outline outline-1 outline-gray-100 px-2 rounded-md" placeholder="*********" />
            </div>

            <div className="flex flex-col gap-2">
                <h1 className="font-semibold">New Password</h1>
                <Input.Password 
                style={{height: "4rem"}}
                onChange={(evt) => setPassword(evt.target.value)} value={password} type="password" className="outline outline-1 outline-gray-100 px-2 rounded-md" placeholder="*********" />
            </div>

            <div className="flex flex-col gap-2">
                <h1 className="font-semibold">Confirm New Password</h1>
                <Input.Password 
                style={{height: "4rem"}}
                onChange={(evt) => setPassword1(evt.target.value)} value={password1} type="password" className="outline outline-1 outline-gray-100 px-2 rounded-md" placeholder="*********" />
            </div>
        </div>

        <div className="flex justify-end">
            <Button onClick={submit} isLoading={isLoading} disabled={isLoading} className="px-16 py-3 mt-6">Save</Button>
        </div>
    </div>
}
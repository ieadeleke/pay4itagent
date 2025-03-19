import { EyeIcon, EyeOffIcon } from "lucide-react"
import { IconButton } from "../buttons/IconButton"
import { TextField } from "../input/InputText"
import Link from "next/link"
import Button from "../buttons"
import { useLogin } from "@/utils/apiHooks/auth/useLogin"
import { useContext, useEffect, useState } from "react"
import GlobalContext from "@/context/GlobalContext"
import { isEmail } from "@/utils/validation"
import { useRouter } from "next/navigation"

export const Login = () => {
    const { showSnackBar } = useContext(GlobalContext)
    const { error, isLoading, data, login } = useLogin()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()
    const [isPasswordRevealed, setIsPasswordRevealed] = useState(false);

    useEffect(() => {
        if (error) {
            showSnackBar({ severity: 'error', message: error })
        }
    }, [error])

    useEffect(() => {
        if (data) {
            showSnackBar({ severity: 'success', message: "Login successful" })
            setTimeout(() => {
                router.push('/dashboard')
            }, 1000)
        }
    }, [data])

    function submit() {
        if (!isEmail(email)) {
            return showSnackBar({ severity: 'error', message: "Invalid email" })
        } else if (password.trim().length < 4) {
            return showSnackBar({ severity: 'error', message: "Password should be at least 4 characters" })
        }
        login({
            identifier: email,
            password
        })
    }

    function revealPassword() {
        setIsPasswordRevealed((value) => !value);
    }

    return <div>
        <h1 className="font-bold text-2xl text-center">Welcome Back</h1>

        <div className="flex flex-col gap-4">
            <div>
                <p className="text-base text-gray-600 font-light">Email Address</p>
                <TextField.Container className="mt-1">
                    <TextField.Input autoComplete="email" value={email} onChange={(evt) => setEmail(evt.target.value)} type="email" placeholder="example@gmail.com" className="text-xs" />
                </TextField.Container>
            </div>

            <div>
                <p className="text-base text-gray-600 font-light">Password</p>
                <TextField.Container className="mt-1">
                    <TextField.Input autoComplete="current-password" value={password} onChange={(evt) => setPassword(evt.target.value)} type={isPasswordRevealed ? "text" : "password"} placeholder="123456" className="text-xs" />

                    <IconButton onClick={revealPassword}>
                        {isPasswordRevealed ? <EyeOffIcon className="text-gray-500 w-4 h-4" /> : <EyeIcon className="text-gray-500 w-4 h-4" />}
                    </IconButton>
                </TextField.Container>
            </div>

            <Link className="font-light text-end text-sm underline" href={"/reset-password"}>Reset Password</Link>

            <Button onClick={submit} isLoading={isLoading} disabled={isLoading} className="mt-4 rounded-xl">Login</Button>


            <Link href={'/signup'} className="flex">
                <Button variant="text" className="flex-1 mt-4 rounded-xl text-primary">{`I don't have an account`}</Button>
            </Link>
        </div>
    </div>
}
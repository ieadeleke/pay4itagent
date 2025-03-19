import Button from "@/components/buttons";
import { TextField } from "@/components/input/InputText";
import image from '@/assets/images/auth_bg.png'
import AuthLayout from "@/components/mda-dashboard/layout/AuthLayout";
import Link from "next/link";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { GlobalActionContext } from "@/context/GlobalActionContext";
import { isEmail } from "@/utils/validation/validation";
import { useLogin } from "@/utils/apiHooks/auth/useLogin";
import { Navigation } from "@/components/nav";

export default function Login() {
    const { isLoading, data, login, error } = useLogin();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loadLoginAction, setLoadLoginAction] = useState(false);
    const { showSnackBar } = useContext(GlobalActionContext);
    const router = useRouter();

    function handleLogin() {
        setLoadLoginAction(false);
        if (!isEmail(email)) {
            showSnackBar({ severity: "error", message: "Invalid Email Address" });
        } else if (password.length < 3) {
            showSnackBar({
                severity: "error",
                message: "Password should be 3 or more characters",
            });
        } else {
            setLoadLoginAction(true);
            login({
                identifier: email,
                password,
            });
        }
    }

    useEffect(() => {
        if (error) {
            setLoadLoginAction(false);
            showSnackBar({ severity: 'error', message: error })
        }
    }, [error])

    useEffect(() => {
        if (data) {
            setTimeout(() => {
                setLoadLoginAction(false);
                router.push('/')
                showSnackBar({ severity: 'success', message: "Login successful" })
            }, 1000)
        }
    }, [data])

    function onEmailEntered(event: ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value);
    }

    function onPasswordEntered(event: ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value);
    }

    return <AuthLayout>
        <>
            <Navigation />
            <div className="flex flex-col gap-4 min-h-[85vh] md:min-h-[85vh] items-center justify-center">
                <div className="flex flex-col gap-8 justify-center align-center">
                    <div className="px-10 md:px-0">
                        <div className="md:w-max mx-auto block">
                            <div className="">
                                <h1 className="font-bold text-2xl md:text-4xl">Welcome Back  👋</h1>
                                <p className="text-gray-700 mt-4">Enter your email and password below to login to your account.</p>
                            </div>
                            <div className="flex flex-col gap-4 mt-10">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm">Email</label>
                                    <TextField.Input type="email"
                                        inputMode="email"
                                        value={email}
                                        onChange={onEmailEntered} className="rounded-lg px-2 text-sm" />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm">Password</label>
                                    <TextField.Input type="password" value={password}
                                        onChange={onPasswordEntered} className="rounded-lg px-2 text-sm" />
                                </div>

                                <div className="flex justify-end">
                                    <Link href={"/reset-password"} className="-mr-2 text-sm py-2 text-primary font-black">Forgot Password?</Link>
                                </div>

                                <div className="flex flex-col mt-3">
                                    <Button isLoading={loadLoginAction} disabled={loadLoginAction} onClick={handleLogin}
                                        className="py-3 rounded-md w-full">Sign in</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    </AuthLayout>
}
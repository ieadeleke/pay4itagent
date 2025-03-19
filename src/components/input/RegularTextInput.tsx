import { cn } from "@/lib/utils";
import { forwardRef, InputHTMLAttributes } from "react";
import { Input } from "../ui/input";

export type InputProps = InputHTMLAttributes<HTMLInputElement>

export const RegularTextInput =forwardRef<HTMLInputElement, InputProps>(({ className, ...props }: InputProps, ref) => {
    return <Input ref={ref} className={cn("w-full px-3 py-3", className)} {...props} />
})

RegularTextInput.displayName = "RegularTextInput"
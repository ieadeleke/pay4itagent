import { cn } from "@/lib/utils";
import { forwardRef, TextareaHTMLAttributes } from "react";
import { HTMLAttributes, InputHTMLAttributes } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement>
export type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }: InputProps, ref) => {

    return <input ref={ref} className={cn("h-[4rem] bg-transparent outline-none border-2 border-solid px-0 py-[1.3rem] w-full", className)} {...props} />
    // return <input ref={ref} className={cn("bg-transparent outline-none border-none px-0 py-[1.3rem] w-full", className)} {...props} />
})

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({ className, ...props }: TextAreaProps, ref) => {

    return <textarea ref={ref} className={cn("bg-transparent outline-none border-none px-0 py-[1.3rem] border-2 border-solid w-full", className)} {...props} />
})

const TextFieldContainer = (containerProps: HTMLAttributes<HTMLDivElement>) => {
    const { className, ...props } = containerProps

    return <div className={cn(`flex items-center bg-gray1 rounded-md gap-4 text-text-color`, className)} {...props} />
    // return <div className={cn(`flex items-center bg-gray1 rounded-md px-3 gap-4 text-text-color`, className)} {...props} />
}

export const TextField = {
    Container: TextFieldContainer,
    TextArea,
    Input: Input
}

Input.displayName = "TextFieldInput"
TextArea.displayName = "TextArea"
TextFieldContainer.displayName = "TextFieldContainer"
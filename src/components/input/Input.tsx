import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { HTMLAttributes, InputHTMLAttributes } from "react";

type InputProps = {
    startIcon?: JSX.Element;
    containerProps?: HTMLAttributes<HTMLDivElement>;
} & InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>((props: InputProps, ref) => {
    const { startIcon, containerProps, ...inputProps } = props;
    const { className: containerClassNames, ...restContainerProps } = containerProps || {}
    const { className: inputClassNames, ...restInputProps } = inputProps || {}

    return <div className={cn(`flex items-center bg-gray1 rounded-md px-4 gap-4 text-white`, containerClassNames)} {...restContainerProps}>
        {props.startIcon}
        <input ref={ref} className={cn("bg-transparent outline-none border-none px-0 py-3 w-full", inputClassNames)} {...restInputProps} />
    </div>
})

Input.displayName = "Input"
import { cn } from '@/lib/utils';
import React, { forwardRef, ButtonHTMLAttributes, useMemo, MouseEvent } from 'react';
import { ClipLoader } from 'react-spinners';

interface ForwardRefButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean,
    variant?: "contained" | "text" | "outlined"
}

const Button = forwardRef<HTMLButtonElement, ForwardRefButtonProps>((props, ref) => {
    const { className, disabled, isLoading, onClick, children, ...rest } = props

    const bgClassName = useMemo(() => {
        switch (props.variant) {
            case 'outlined':
                return 'bg-transparent border-2 border-solid border-primary text-primary'
            case 'text':
                return 'bg-transparent text-primary hover:bg-gray-100'
            default:
                return 'bg-primary text-white font-medium border-none hover:opacity-90'
        }
    }, [props.variant])

    function handleOnClick(event: MouseEvent<HTMLButtonElement>) {
        if (!disabled) {
            onClick?.(event)
        }
    }

    return <button className={cn(`rounded-[8px] h-[60px] text-base text-base-semibold px-8 ${bgClassName} ${disabled ? 'opacity-50' : ''}`, className)} ref={ref} onClick={handleOnClick} {...rest}>
        {typeof children == 'string' ?
            <div className="flex justify-center items-center gap-3">
                <ClipLoader color={'white'} size={24} loading={isLoading != undefined ? isLoading : false} />
                <p>{children}</p>
            </div> : children}
    </button>
});
Button.displayName = "Button"
export default Button;

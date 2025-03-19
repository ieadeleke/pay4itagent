import { DetailedHTMLProps, HTMLAttributes } from "react"
import { cn } from "../lib/utils"


export const Divider = ({ className, ...props }: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
    return <div className={cn("h-[1px] bg-gray-100", className)} {...props} />
}
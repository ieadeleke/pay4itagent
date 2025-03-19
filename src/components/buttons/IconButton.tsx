import { cn } from "@/lib/utils"
import { forwardRef, HTMLAttributes } from "react"

export const IconButton = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }: HTMLAttributes<HTMLDivElement>, ref) => {

    return <div ref={ref} className={cn(`p-1 cursor-pointer hover:bg-gray-100 rounded-full`, className)} {...props} />
})

IconButton.displayName = "IconButton"
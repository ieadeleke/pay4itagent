import { cn } from "@/lib/utils"
import { HTMLAttributes } from "react"
import Error from "./Error"
import Loading from "./Loading"


type NetworkRequestContainerProps = {
    isLoading?: boolean,
    error?: string | null,
    onRetry?: () => void
} & HTMLAttributes<HTMLDivElement>

export const NetworkRequestContainer = ({ isLoading, error, className, children, onRetry, ...props }: NetworkRequestContainerProps) => {
    return <div className={cn("h-full", className)} {...props}>
        {isLoading  ? <Loading /> : error ? <Error onRetry={onRetry} message={error} /> : null}
        {children}
    </div>
}

NetworkRequestContainer.displayName = "NetworkRequestContainer"
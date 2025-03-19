import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";
import Button from "../buttons";

type ErrorProps = {
    message?: string,
    onRetry?: () => void
} & HTMLAttributes<HTMLDivElement>


export default function Error({ message, onRetry, className, ...props }: ErrorProps) {

    function handleRetry() {
        onRetry?.()
    }

    return <div className={cn("w-full h-full flex flex-col justify-center items-center gap-4 md:h-[80vh]", className)} {...props}>
        <div className="flex flex-col gap-0 text-center">
            <p className={"text-xl font-medium"}>
                Oops!
            </p>
            <p className="text-base text-gray mt-3">
                {message || `Something went wrong!`}
            </p>
        </div>
        <Button variant="contained" className="rounded-full rounded-lg text-sm p-4 px-10 h-max" onClick={handleRetry}>Try Again</Button>
    </div>
}
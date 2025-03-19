import { cn } from "@/lib/utils";
import CircularProgress from "@mui/material/CircularProgress";
import { HTMLAttributes } from "react";

type LoadingProps = {

} & HTMLAttributes<HTMLDivElement>

export default function Loading({ className, ...props }: LoadingProps) {
    return <div className={cn("w-full h-full flex justify-center items-center", className)} {...props}>
        <CircularProgress />
    </div>
}
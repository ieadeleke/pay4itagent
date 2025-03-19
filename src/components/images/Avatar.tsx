import { DetailedHTMLProps, ImgHTMLAttributes } from "react"
import { cn } from "../../lib/utils"

type AvatarProps = DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>

export const Avatar = ({ className, ...props }: AvatarProps) => {
    return <img className={cn('w-7 h-7 rounded-full object-cover object-center', className)} {...props} />
}
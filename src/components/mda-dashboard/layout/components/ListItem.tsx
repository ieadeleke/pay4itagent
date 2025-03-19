import Link from "next/link"
import { useRouter } from "next/router"
import { useMemo } from "react"

export type ListItemProps = {
    name: string,
    href: string,
    newTab?: boolean,
    isActive?: boolean,
    startIcon?: JSX.Element
}

export const ListItem = (props: ListItemProps) => {
    const router = useRouter()

    const isActive = useMemo(() => {
        return router.pathname == props.href
    }, [router.pathname])

    return (
        <Link
            href={props.href}
            passHref
            target={props.newTab ? "_blank" : undefined}
            rel={props.newTab ? "noreferrer noopener" : undefined}
            // className={`flex rounded-md ${isActive ? 'text-primary' : 'text-text-color'} ${isActive ? 'text-primary' : 'text-gray-500'} items-center gap-4 px-3 py-3 hover:bg-primary-20`}>
            className={`flex ${isActive ? 'text-primary' : 'text-text-color'} ${isActive ? 'text-primary' : 'text-gray-500'} ${isActive ? 'bg-white' : 'text-gray-500'} items-center gap-4 py-5 hover:bg-primary-20`}>
            {props.startIcon}
            <p className={`text-sm ${isActive ? 'text-base-semibold' : 'text-base-regular'} font-black lg:block`}>{props.name}</p>

        </Link>
    );
}
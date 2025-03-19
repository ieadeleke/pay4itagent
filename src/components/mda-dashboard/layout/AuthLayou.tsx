import { Footer } from "@/components/footer"

type AuthLayoutProps = {
    children?: JSX.Element,
    showSearchBar?: boolean,
    rightSideBar?: JSX.Element,
    showNavBar?: boolean
}

export default function AuthLayout(props: AuthLayoutProps) {

    return <div className="relative max-w-[2000px] bg-r flex mx-auto">

        <div className="px-3 py-8 w-full relative md:px-8 md:py-8">
            {props.children}

            <Footer />
        </div>
    </div>
}
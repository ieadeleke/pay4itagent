import { Footer } from "@/components/footer"

type AuthLayoutProps = {
    children?: JSX.Element,
    showSearchBar?: boolean,
    rightSideBar?: JSX.Element,
    showNavBar?: boolean
}

export default function AuthLayout(props: AuthLayoutProps) {

    return <div className="relative max-w-[2000px] bg-r flex mx-auto">

        <div className="w-full relative">
            {props.children}

            {/* <Footer /> */}
        </div>
    </div>
}
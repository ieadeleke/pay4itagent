import { Footer } from "../footer"

type LayoutProps = {
    children?: JSX.Element
}

export const Layout = (props: LayoutProps) => {
    return <div className="max-w-[2000px] mx-auto">
        {/* <Header /> */}
        <div>
            {props.children}
        </div>
        <Footer />
    </div>
}
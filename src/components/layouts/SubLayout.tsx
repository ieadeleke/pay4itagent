import { Footer } from "../footer"
import { Header } from "../header"

type LayoutProps = {
    children?: JSX.Element
}

export const SubLayout = (props: LayoutProps) => {
    return <div className="max-w-[1600px] mx-auto">
        <Header logoClassName="text-white" getStartedClassName="bg-white text-primary !hidden" className="bg-primary" navLinkClassName="!hidden text-white" />
        <div>
            {props.children}
        </div>
        <Footer />
    </div>
}
import { Footer } from "@/components/footer"
import { MenuSideBar } from "./components/MenuSideBar"
import { NavBar } from "./components/NavBar"
import { useRef } from "react"
import { NotificationModalRef, NotificationModal } from "../notifications/NotificationModal"

type LayoutProps = {
    children?: JSX.Element,
    navTitle?: string
}

export default function DashboardLayout(props: LayoutProps) {
    const notificationModalRef = useRef<NotificationModalRef>(null)

    function openNotificationModal() {
        notificationModalRef.current?.open({

        })
    }

    return (
        // <div>
        <div className="relative w-[95%]  py-10 mx-auto bg-r flex gap-[48px] max-h-[100vh] h-[100vh] overflow-hidden">
            <NotificationModal ref={notificationModalRef} />
            <div className="hidden h-[100%] md:flex border rounded-[16px] bg-white border-[#efefef] w-[250px] p-[24px]">
                <div className="w-full overflow-hidden">
                    <MenuSideBar />
                </div>
            </div>

            {/* <div className="px-3 pb-8 w-full relative md:px-8 md:py-8 max-h-[100vh] overflow-scroll overflow-x-hidden bg-black"> */}
            {/* <div className="pb-8 w-full relative md:pb-8 max-h-[100vh] overflow-scroll overflow-hidden"> */}
            <div className=" w-full none relative max-h-[100vh] h-screen flex flex-col overflow-x-hidden overflow-hidden border-[#efefef] rounded-[16px]">
                <div className="flex h-[88px] bg-white border rounded-[16px] b-[#efefef] px-4 items-center">
                    <NavBar navTitle={props.navTitle} openNotificationModal={openNotificationModal} />
                </div>
                <div className="flex-1 md:px-8 mt-2 overflow-scroll overflow-x-hidden">
                    {props.children}
                </div>
            </div>
        </div>
        //     <Footer />
        // </div>
    )
}
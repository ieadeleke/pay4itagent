import { TextField } from "@/components/input/InputText"
import { BellDotIcon, ChevronDown, ListFilterIcon, SearchIcon } from "lucide-react"
import { useRouter } from "next/router"
import { useContext, useRef, useState } from "react"

import MenuIcon from "@/assets/images/menu.svg";
import Image from "next/image";
import { Drawer } from "antd";
import Link from "next/link";

import HomeIcon from '@/assets/icons/ic_home.svg'
import SettingsIcon from '@/assets/icons/ic_settings.svg'
import PaymentIcon from '@/assets/icons/ic_transactions.svg'
import StatIcon from '@/assets/icons/ic_stats.svg'
import LogOutIcon from '@/assets/icons/ic_logout.svg'
import { ListItem } from "./ListItem";
import UserContext from "@/context/UserContext";
import { ConfirmationAlertDialogRef } from "@/components/dialogs/ConfirmationAlertDialog";
import { logOut } from '@/utils/auth/logout';


type NavBarProps = {
    openNotificationModal?: () => void
    navTitle?: string
}

export const NavBar = (props: NavBarProps) => {

    const [reference, setReference] = useState('');
    const { user } = useContext(UserContext);
    const [displayMenuDrawer, setDisplayMenuDrawer] = useState<boolean>(false);
    const router = useRouter()
    const queryReference = router.query.reference as string | undefined;
    const confirmationDialogRef = useRef<ConfirmationAlertDialogRef>(null);

    function handleSearch() {
        if (reference.trim().length > 0) {
            router.push(`/transactions?reference=${reference}`)
        }
    }

    const toggleMobileNavigation = () => {
        setDisplayMenuDrawer(!displayMenuDrawer);
    }

    function handleLogout() {
        // console.log("hello")
        // confirmationDialogRef.current?.show({
        //     data: {
        //         title: "Are you sure you want to logout?",
        //         description: "Your active session will be removed from this device",
        //         label: {
        //             confirm: "Yes",
        //             cancel: "No"
        //         }
        //     },
        //     onCancel: () => {
        //         confirmationDialogRef.current?.dismiss()
        //     },
        //     onConfirm: () => {
        //         confirmationDialogRef.current?.dismiss()
        logOut()
        router.push("/login")
        // }
        // })
    }

    return <div className="flex flex-col w-full">

        <div className="flex gap-2 items-center justify-between">
            <h1 className="font-bold text-2xl">{props.navTitle ? props.navTitle : "Overview"}</h1>
            <div className="mobile-only" onClick={toggleMobileNavigation}>
                <MenuIcon />
            </div>
            {/* <div>
                <div className="desktop-only">
                    <div className="flex gap-0">
                        <form onSubmit={(evt) => {
                            evt.preventDefault()
                            router.push(`/transactions?reference=${reference}`)
                        }}>
                            <TextField.Container className="w-[400px]">
                                <TextField.Input defaultValue={queryReference} onChange={(evt) => setReference(evt.target.value)}
                                    className="rounded-l-lg px-5 h-[52px] text-sm bg-[#f9f9f9] border-none"
                                    type="text" placeholder="Search" />
                            </TextField.Container>
                        </form>
                        <div onClick={handleSearch} className="px-5 rounded-r-lg text-white flex items-center justify-center px-3 bg-[#f9f9f9] border-none cursor-pointer">
                            <SearchIcon className="text-black" />
                        </div>
                    </div>
                </div>
                <div className="mobile-only">
                    <MenuIcon />
                </div>
            </div> */}
            <Drawer footer={null} open={displayMenuDrawer} onClose={toggleMobileNavigation}>
                <div>
                    <div className="flex flex-col gap-0 mt-10 w-full">

                        <ListItem isActive startIcon={<HomeIcon />} name="Home" href="/" />
                        <ListItem startIcon={<StatIcon />} name="Wallet" href="/wallet" />
                        <ListItem startIcon={<PaymentIcon />} name="Transactions" href="/transactions" />
                        {/* <ListItem startIcon={<SettingsIcon />} name="Make Payment" href="/payment" /> */}
                        {
                            user?.profileType === "superAgent" ?
                                <ListItem startIcon={<PaymentIcon />} name="Agents" href="/agents" />
                                : ""
                        }
                        {/* <ListItem startIcon={<PaymentIcon />} name="Payment" href="/payment/collection" /> */}
                        <ListItem startIcon={<SettingsIcon />} name="Settings" href="/settings" />
                        <div
                            onClick={handleLogout}
                            className={`flex cursor-pointer mt-5 items-center gap-2 text-danger`}>
                            <LogOutIcon className="text-danger font-bold" />
                            <p className={`text-sm text-danger font-bold`}>Log Out</p>
                        </div>
                    </div>
                </div>
            </Drawer>
        </div>
    </div>
}
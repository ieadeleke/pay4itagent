import Logo from '@/assets/images/dashboard_logo.png'
import HomeIcon from '@/assets/icons/ic_home.svg'
import SettingsIcon from '@/assets/icons/ic_settings.svg'
import PaymentIcon from '@/assets/icons/ic_transactions.svg'
import StatIcon from '@/assets/icons/ic_stats.svg'
import LogOutIcon from '@/assets/icons/ic_logout.svg'
import { ListItem } from './ListItem'
import Link from 'next/link'
import { ConfirmationAlertDialog, ConfirmationAlertDialogRef } from '@/components/dialogs/ConfirmationAlertDialog'
import { useContext, useEffect, useRef } from 'react';
import { logOut } from '@/utils/auth/logout';
import { useRouter } from 'next/router';
import Image from 'next/image';
import UserContext from '@/context/UserContext'
import { PlusOutlined } from "@ant-design/icons";
import { capitalizeText } from '@/utils/formatters/capitalizeText'

export const MenuSideBar = () => {

    const { user } = useContext(UserContext);
    const confirmationDialogRef = useRef<ConfirmationAlertDialogRef>(null);
    const router = useRouter();

    function handleLogout() {
        confirmationDialogRef.current?.show({
            data: {
                title: "Are you sure you want to logout?",
                description: "Your active session will be removed from this device",
                label: {
                    confirm: "Yes",
                    cancel: "No"
                }
            },
            onCancel: () => {
                confirmationDialogRef.current?.dismiss()
            },
            onConfirm: () => {
                confirmationDialogRef.current?.dismiss()
                logOut()
                router.push("/login")
            }
        })
    }

    return (
        // <div className="w-full h-full flex flex-col gap-8 items-center rounded-3xl overflow-y-scroll no-scrollbar px-0 py-3 lg:px-2 lg:items-start">
        <div className="w-full h-full flex flex-col gap-8 items-center no-scrollbar px-0 py-3 lg:items-start">
            <ConfirmationAlertDialog ref={confirmationDialogRef} />

            <div className="flex flex-col gap-5 mt-4 w-full h-full justify-between">
                <div className="flex flex-col gap-0 mt-4 w-full">
                    <h2 className="font-bold text-2xl">Hello {capitalizeText(user?.userName ? user?.userName : "")},</h2>
                    {/* <Link className="mx-auto" href="/settings" passHref>
                        <div className='img-icon'>
                            {
                                user?.imgUrl?.length ?
                                    // <Image alt="user profile picture" src={user.imgUrl} width={0} height={0}
                                    //     className='sidebar-img' />
                                    <img alt="user profile picture" src={user.imgUrl}
                                        className='sidebar-img' />
                                    :
                                    <div>
                                        <PlusOutlined />
                                    </div>
                            }
                        </div>
                    </Link> */}
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
                    </div>
                </div>
                <div
                    onClick={handleLogout}
                    className={`flex cursor-pointer items-center gap-2 px-3 py-3 text-gray-500 bg-danger border-none rounded-lg`}>
                    <LogOutIcon className="text-white" />
                    <p className={`text-sm text-white`}>Log Out</p>
                </div>
            </div>
        </div>
    );
}

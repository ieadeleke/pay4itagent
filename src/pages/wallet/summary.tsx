'use client';

import EmptyResult from "@/components/layouts/empty";
import DashboardLayout from "@/components/mda-dashboard/layout";
import { DailyAnalytics } from "@/components/mda-dashboard/main/DailyAnalytics";
import { Hero } from "@/components/mda-dashboard/main/Hero";
import { RevenuePill } from "@/components/mda-dashboard/main/RevenuePill";
import { TransactionHistory } from "@/components/mda-dashboard/main/TransWalletHistory";
import { TransactionPill } from "@/components/mda-dashboard/main/TransactionPill";
import { DayData } from "@/components/mda-dashboard/main/WeeklyDeliveries";
import { OngoingTransaction } from "@/components/mda-dashboard/transactions/OngoingTransactions";
import { UserActivityBarGraph } from "@/components/mda-dashboard/transactions/UserActivityBarChart";
import { NetworkRequestContainer } from "@/components/states/NetworkRequestContainer";
import { GlobalActionContext } from "@/context/GlobalActionContext";
import UserContext from "@/context/UserContext";
import { Profile } from "@/models/profile";
import { useFetchUser } from "@/utils/apiHooks/profile/useFetchUser";
import { useDashboardInfo } from "@/utils/apiHooks/transactions/useDashboardInfo";
import { capitalizeText } from "@/utils/formatters/capitalizeText";
import { formatAmount } from "@/utils/formatters/formatAmount";
import { Dropdown, Modal, Select, Spin } from "antd";
import { useFetchBankList } from "@/utils/apiHooks/consultants/useFetchBankList"
import { useVerifyBankList } from "@/utils/apiHooks/consultants/useVerifyBankLIst"
import { useContext, useEffect, useState } from "react";

import EmptyIcon from "@/assets/images/list.png";
import Confetti from "@/assets/images/confetti.png";
import Image from "next/image";
import { useActivateUserWallet } from "@/utils/apiHooks/profile/useActivateWallet";
import { TextField } from "@/components/input/InputText";
import Button from "@/components/buttons";
import MonthsOfTheYear from "@/components/months";
import WithdrawToBank from "@/components/agents/withdraw";
import { TbReload } from "react-icons/tb";
import { useRefreshWallet } from "@/utils/apiHooks/profile/useRefreshWallet";
import { LoadingOutlined } from '@ant-design/icons';
import TransferToWallet from "@/components/agents/transfertowallet";
import Link from "next/link";

interface InfoInterface {
    transferStatus?: string,
    transferAmount?: string,
    transferMessage?: string,
    transfersettlementAccountNumber?: string
}
export default function MdaDashboard() {

    const [transferInfo, setTransferInfo] = useState<InfoInterface>({
        transferStatus: "",
        transferAmount: "",
        transferMessage: "",
        transfersettlementAccountNumber: ""
    });

    useEffect(() => {
        setTransferInfo({
            transferStatus: localStorage.getItem("transferStatus") ?? "",
            transferAmount: localStorage.getItem("transferAmount") ?? "",
            transferMessage: localStorage.getItem("transferMessage") ?? "",
            transfersettlementAccountNumber: localStorage.getItem("transfersettlementAccountNumber") ?? ""
        })
    }, [])

    return <DashboardLayout>
        <div>
            <div className="flex flex-col gap-8">
                <div>
                    <div className="flex flex-col justify-center py-10 rounded-3xl bg-white mt-10 mb-20">
                        <div>
                            <div className="w-[90%] md:w-[50%] mx-auto block mb-20">
                                <div className="w-full rounded-lg h-[20rem] bg-[#F2F2F2] flex items-center justify-center">
                                    <Image src={Confetti} alt="confetti" className="h-[10rem] w-auto" />
                                </div>
                                <div className="text-center mt-10">
                                    <h3 className="font-black text-2xl">{transferInfo.transferMessage}</h3>
                                    <div className="mt-3 md:w-[80%] mx-auto">
                                        {
                                            transferInfo.transferStatus === "queue" ?
                                                <p className="leading-loose">Your {transferInfo?.transferAmount ? formatAmount(+transferInfo.transferAmount) : ""} transfer to account
                                                    number {transferInfo.transfersettlementAccountNumber} has been queued successfully and is on its way to the recipient.</p>
                                                :
                                                transferInfo.transferStatus === "pending" ?
                                                    <p className="leading-loose">Your {transferInfo?.transferAmount ? formatAmount(+transferInfo.transferAmount) : ""} transfer to account
                                                        number {transferInfo.transfersettlementAccountNumber} is pending and will be processed shortly.</p>
                                                    :
                                                    <p className="leading-loose">Your {transferInfo?.transferAmount ? formatAmount(+transferInfo.transferAmount) : ""} transfer to account
                                                        number {transferInfo.transfersettlementAccountNumber} has been completed successfully.</p>
                                        }
                                    </div>
                                    <div className="mt-10">
                                        <Link href="/wallet" className="bg-primary text-white w-full py-6 block px-20 rounded-lg">Go back to Wallet</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </DashboardLayout>
}
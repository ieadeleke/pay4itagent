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
import { Dropdown, Modal, Select, Spin, Tabs } from "antd";
import { useFetchBankList } from "@/utils/apiHooks/consultants/useFetchBankList"
import { useVerifyBankList } from "@/utils/apiHooks/consultants/useVerifyBankLIst"
import { useContext, useEffect, useState } from "react";

import EmptyIcon from "@/assets/images/list.png";
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
import { IoEyeSharp } from "react-icons/io5";
import { HiEyeSlash } from "react-icons/hi2";
import RequestLoanModal from "@/components/agents/requestloan";
import { LoanRequestTable } from "@/components/mda-dashboard/transactions/LoanTransactionTable";
import { useParams, useSearchParams } from "next/navigation";


function distributeCounts(data: DayData[]): { dayOfWeek: string; count: number }[] {
    const counts: { [key: string]: number } = {
        Sunday: 0,
        Monday: 0,
        Tuesday: 0,
        Wednesday: 0,
        Thursday: 0,
        Friday: 0,
        Saturday: 0
    };

    data.forEach(item => {
        counts[item.dayOfWeek] = item.count;
    });

    const result = Object.keys(counts).map(dayOfWeek => ({
        dayOfWeek,
        count: counts[dayOfWeek]
    }));

    return result;
}

function distributePieChartCounts(data: ({
    status: string;
    count: number;
    percentage: number;
})[]) {
    const success = data.find((item) => item.status == "Successful")
    const pending = data.find((item) => item.status == "Pending")
    const failed = data.find((item) => item.status == "Faled")

    return {
        success: {
            percentage: success?.percentage ?? 0,
            count: success?.count ?? 0
        },
        pending: {
            percentage: pending?.percentage ?? 0,
            count: pending?.count ?? 0
        },
        failed: {
            percentage: failed?.percentage ?? 0,
            count: failed?.count ?? 0
        }
    }
}

export default function MdaDashboard() {

    const params = useSearchParams();
    const { isLoading, error, data, getDashboardInfo } = useDashboardInfo();

    const { isLoading: isLoadingUser, error: userError, data: userFetchedData, fetchUser } = useFetchUser();
    const { isLoading: isLoadingWalletRefresh, error: userWalletRefreshError, data: userRefreshData, refreshWallet } = useRefreshWallet();
    // const { isLoading: isLoadingUser, error: userError, data: userFetchedData, fetchUser } = useFetchUser();
    const { isLoading: isLoadingWallet, error: activateError, data: activateUserWalletData, activateAgentWallet } = useActivateUserWallet();
    const { user: profile } = useContext(UserContext);

    const [displayTransferModal, setDisplayTransferModal] = useState(false);
    const [withDrawalType, setWithDrawalType] = useState("wallet");
    const [displayWalletActivationModal, setDisplayWalletActivationModal] = useState(false);
    const [displayWalletWithdrawalModal, setDisplayWalletWithdrawalModal] = useState(false);

    const [openLoanModal, setOpenLoanModal] = useState(false);
    const [currentDisplayKey, setCurrentDisplayKey] = useState<string>('1');

    const [refreshCount, setRefreshCount] = useState(0);
    const [hideAmount, setHideAmount] = useState(typeof window !== 'undefined' && localStorage.getItem("displayAmount") ? localStorage.getItem("displayAmount") : true);

    const [walletActivationForm, setWalletActivationForm] = useState({
        bvn: "",
        phoneNumber: "",
        address: "",
        dateOfBirth: "",
        year: "",
        month: "",
        date: ""
    });

    useEffect(() => {
        let key = params.get('activekey');
        if (key) {
            setCurrentDisplayKey(key);
        }
    }, [params.get('activekey')])


    const { showSnackBar } = useContext(GlobalActionContext);
    const [userData, setUserData] = useState<Profile>({
        name: "",
        addedBy: "",
        email: "",
        firstName: "",
        isActive: false,
        lastName: "",
        loginCount: 0,
        loginDisabled: false,
        loginReTryTime: "",
        phoneNumber: "",
        userName: "",
        imgUrl: "",
        wallet: {
            _id: "",
            accountName: "",
            accountNumber: "",
            accountReference: "",
            availableBalance: 0,
            bankName: "",
            bookedBalance: 0,
            country: "",
            currency: "",
            dailyTransactionLimit: 0,
            email: "",
            maxBalance: 0,
            minBalance: 0,
            phoneNumber: "",
            previousBalance: 0,
            provider: "",
            providerCustomerId: "",
            status: "",
            tier: "",
            type: "",
            userId: "",
        }
    });

    const copyToClipboard = async () => {
        try {
            let accName = userData?.wallet?.accountNumber ? userData?.wallet?.accountNumber : '';
            await navigator.clipboard.writeText(accName);
            showSnackBar({
                message: "Text copied to clipboard!",
                severity: 'success'
            })
        } catch (err) {
            showSnackBar({
                message: "Failed to copy text",
                severity: 'error'
            })
        }
    };

    useEffect(() => {
        if (activateError) {
            showSnackBar({
                message: activateError,
                severity: 'error'
            })
        }
    }, [activateError])
    useEffect(() => {
        if (userError) {
            showSnackBar({
                message: userError,
                severity: 'error'
            })
        }
    }, [userError])

    useEffect(() => {
        if (userFetchedData) {
            setUserData(userFetchedData);
        }
    }, [userFetchedData])
    useEffect(() => {
        if (activateUserWalletData?.message?.length) {
            showSnackBar({
                message: "Request Successful",
                severity: 'success'
            })
            window.location.reload();
        }
    }, [activateUserWalletData])

    useEffect(() => {
        getDashboardInfo()
    }, [])

    useEffect(() => {
        fetchUser();
    }, [])

    const toggleDisplayModal = () => setDisplayTransferModal(!displayTransferModal);
    const toggleDisplayActivationModal = () => setDisplayWalletActivationModal(!displayWalletActivationModal);
    const toggleDisplayWithdrawalModal = () => setDisplayWalletWithdrawalModal(!displayWalletWithdrawalModal);

    const handleActivateUserWallet = () => {
        let { bvn, phoneNumber, date, year, month, address } = walletActivationForm;
        if (bvn.length && phoneNumber.length && date.length && year.length && month.length && address.length) {
            if (bvn.length === 11) {
                if (year.length === 4 && (Number(year) < Number(new Date().getFullYear()))) {
                    activateAgentWallet({
                        bvn,
                        phoneNumber,
                        address,
                        dateOfBirth: `${year}/${month}/${date}`
                    });
                } else {
                    showSnackBar({
                        message: "Birth year is not valid",
                        severity: 'error'
                    })
                }
            } else {
                showSnackBar({
                    message: "BVN must be 11 characters",
                    severity: 'error'
                })
            }
        } else {
            showSnackBar({
                message: "Please enter all fields",
                severity: 'error'
            })
        }
    }

    const UpdateWalletActivationForm = (e: any) => {
        let name = e.target.name;
        setWalletActivationForm({
            ...walletActivationForm,
            [name]: e.target.value
        })
    }

    useEffect(() => {
        if (userRefreshData) {
            setUserData({
                ...userData,
                wallet: userRefreshData
            })
        }
    }, [userRefreshData]);
    useEffect(() => {
        if (userWalletRefreshError) {
            showSnackBar({
                message: userWalletRefreshError,
                severity: 'error'
            })
        }
    }, [userWalletRefreshError]);

    const handleWalletBalanceRefresh = () => {
        if (userData?.wallet?.providerCustomerId) {
            refreshWallet({
                providerCustomerId: userData?.wallet?.providerCustomerId
            });
            setRefreshCount(refreshCount + 1);
        }
    }

    const items = [
        {
            key: '1',
            label: (
                <button className="bg-transparent py-3" onClick={
                    () => {
                        setWithDrawalType("bank");
                        toggleDisplayWithdrawalModal();
                    }
                }>
                    Withdraw to Bank
                </button>
            ),
        },
        {
            key: '2',
            label: (
                <button className="bg-transparent py-3" onClick={
                    () => {
                        setWithDrawalType("wallet");
                        toggleDisplayWithdrawalModal();
                    }
                }>
                    Transfer to Wallet
                </button>
            ),
        }
    ]

    const controlWalletAmountVisibility = (status: string) => {
        setHideAmount(status);
        if (typeof window !== 'undefined') {
            localStorage.setItem("displayAmount", status);
        }
    }
    const handlePageReload = (e: any) => {
        window.location.reload();
    }

    const toggleLoanRequestModal = () => {
        setOpenLoanModal(!openLoanModal);
    }

    return <DashboardLayout>
        <NetworkRequestContainer isLoading={isLoading} error={error}>
            <div>
                {(data && !isLoading) ?
                    <div className="flex flex-col gap-8">
                        {
                            userData?.wallet?.status === "ACTIVE" ?
                                <div>
                                    <div className="flex flex-col justify-center py-10 rounded-3xl global-hero mt-10">
                                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-5 px-8">
                                            <div className="flex gap-10 items-center">
                                                <div>
                                                    <h5 className="text-base text-white">Current Balance</h5>
                                                    <h2 className="text-4xl text-white font-bold leading-relaxed">{
                                                        hideAmount === "hide" ? "****" :
                                                            formatAmount(userData?.wallet?.availableBalance ? userData?.wallet?.availableBalance : "0.00")}</h2>
                                                </div>
                                                <div className="flex gap-3 items-center">
                                                    {
                                                        hideAmount === "hide" ?
                                                            <div onClick={() => {
                                                                controlWalletAmountVisibility("show");
                                                            }}>
                                                                <IoEyeSharp className="text-white cursor-pointer" />
                                                            </div> :
                                                            <div onClick={() => {
                                                                controlWalletAmountVisibility("hide")
                                                            }}>
                                                                <HiEyeSlash className="text-white cursor-pointer" />
                                                            </div>
                                                    }
                                                    {
                                                        !isLoadingWalletRefresh ?
                                                            <div className="cursor-pointer" onClick={handleWalletBalanceRefresh}>
                                                                <TbReload className="text-white text-3xl" />
                                                            </div>
                                                            :
                                                            <Spin indicator={<LoadingOutlined spin className="text-white font-black" />} />
                                                    }
                                                </div>
                                                {/* </div> */}
                                                {/* {
                                                    !isLoadingWalletRefresh ?
                                                        <div className="cursor-pointer" onClick={handleWalletBalanceRefresh}>
                                                            <TbReload className="text-white text-3xl" />
                                                        </div>
                                                        :
                                                        <Spin indicator={<LoadingOutlined spin className="text-white font-black" />} />
                                                } */}
                                            </div>
                                            <div>
                                                {/* <h5 className="text-white text-sm mb-2">Current Balance</h5>
                            <h2 className="text-white text-3xl mb-3">{formatAmount(userData?.wallet?.availableBalance ? userData?.wallet?.availableBalance : "")}</h2> */}
                                                <div className="flex gap-5">
                                                    <button onClick={toggleDisplayModal} className="bg-white px-8 py-3 text-base rounded-xl">Fund Wallet</button>
                                                    {/* {
                                                        userData?.profileType === "superAgent" ? */}
                                                    <Dropdown
                                                        menu={{
                                                            items,
                                                        }}
                                                        placement="bottomLeft"
                                                    >
                                                        <button className="bg-white px-8 py-3 text-base rounded-xl">Withdraw</button>
                                                    </Dropdown>
                                                    <button onClick={toggleLoanRequestModal} className="bg-white px-8 py-3 text-base rounded-xl">Request Float</button>
                                                    {/* : ""} */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mt-5">
                                        {/* <TransactionPill data={{
                        title: "Wallet Balance",
                        description: userData?.wallet?.availableBalance?.toString() ? userData?.wallet?.availableBalance : ""
                    }} /> */}
                                        {/* <TransactionPill data={{
                        title: "Account Number",
                        description: userData?.wallet?.accountNumber ? userData?.wallet?.accountNumber : ""
                    }} />
                    <TransactionPill data={{
                        title: "Bank Name",
                        description: userData?.wallet?.bankName ? userData?.wallet?.bankName : ""
                    }} /> */}
                                        <TransactionPill data={{
                                            title: "Tier",
                                            description: userData?.wallet?.tier ? userData?.wallet?.tier : ""
                                        }} />
                                        <TransactionPill data={{
                                            title: "Daily Transaction Limit",
                                            description: userData?.wallet?.dailyTransactionLimit?.toString() ? userData?.wallet?.dailyTransactionLimit : ""
                                        }} />
                                        <TransactionPill data={{
                                            title: "Max Balance",
                                            description: userData?.wallet?.maxBalance ? userData?.wallet?.maxBalance : ""
                                        }} />
                                    </div>
                                    <div className="flex items-start gap-8 mt-5">
                                        <div className="flex-1 border bg-white rounded-[16px] px-2 py-2">
                                            <Tabs type="card" size="large" className="mt-10 w-full" activeKey={currentDisplayKey} onChange={(key: string) => setCurrentDisplayKey(key)}>
                                                <Tabs.TabPane key={1} tab="Wallet Transaction History">
                                                    <TransactionHistory walletId={profile?.wallet?._id ? profile.wallet._id : ""} refreshCount={refreshCount} />
                                                </Tabs.TabPane>
                                                <Tabs.TabPane key={2} tab="Float Requests">
                                                    <LoanRequestTable walletId={profile?.wallet?._id ? profile.wallet._id : ""} />
                                                </Tabs.TabPane>
                                            </Tabs>
                                        </div>
                                        <Modal open={displayTransferModal} onCancel={toggleDisplayModal} footer={null}>
                                            <div className="md:w-[80%] mx-auto py-10">
                                                <h3 className="font-bold text-center text-xl mb-2">Fund Wallet</h3>
                                                <p className="text-center mb-5 text-base md:w-[80%] mx-auto">Copy the account number below and transfer funds from any bank.</p>
                                                <div className="mb-8 bg-[#F2F2F2] px-5 h-[12rem] rounded-[8px] flex flex-col items-center justify-center">
                                                    <p className="text-lg mb-5">{capitalizeText(userData?.wallet?.bankName ? userData?.wallet?.bankName : "")}</p>
                                                    <h2 className="text-4xl font-black mb-5">{userData?.wallet?.accountNumber ? userData?.wallet?.accountNumber : ""}</h2>
                                                    <p className="text-lg">{capitalizeText(userData?.wallet?.accountName ? userData?.wallet?.accountName : "")}</p>
                                                </div>
                                                <button onClick={copyToClipboard} className="bg-primary text-white rounded-lg py-4 w-full">Copy Account Number</button>
                                            </div>
                                        </Modal>
                                    </div>
                                </div>
                                :
                                <div className="empty-icon">
                                    <div>
                                        <Image src={EmptyIcon} alt="empty icon" width={0} height={0} className="w-[15%] mx-auto mb-5" />
                                        <p>Your wallet has not been activated yet</p>
                                        <div className="mt-5">
                                            <button onClick={toggleDisplayActivationModal} className="rounded-lg w-max mx-auto py-5 h-max px-8 border-solid border-primary border-2 bg-transparent 
          text-primary font-black text-2xs block">Activate Wallet</button>
                                        </div>
                                    </div>
                                </div>
                        }
                    </div>
                    : ""}
                <Modal open={displayWalletActivationModal} onCancel={toggleDisplayActivationModal} footer={null}>
                    <div className="md:w-[95%] mx-auto py-5">
                        <h3 className="font-bold text-center text-xl mb-10">Activate Wallet</h3>
                        <form action="" onSubmit={e => e.preventDefault()}>
                            <div className="form-group mb-5">
                                <h1 className="text-sm">BVN</h1>
                                <TextField.Input onChange={UpdateWalletActivationForm} value={walletActivationForm?.bvn} name="bvn" className="bg-white outline-none px-2 rounded-lg" />
                            </div>
                            <div className="form-group mb-5">
                                <h1 className="text-sm">Phone Number</h1>
                                <TextField.Input type="tel" onChange={UpdateWalletActivationForm} value={walletActivationForm?.phoneNumber} name="phoneNumber" className="bg-white outline-none px-2 rounded-lg" />
                            </div>
                            <div>
                                <h1 className="text-sm">Date of birth</h1>
                                <div className="grid grid-cols-3 gap-5">
                                    <div className="form-group mb-5">
                                        <TextField.Input onChange={UpdateWalletActivationForm} value={walletActivationForm?.year} placeholder="YYYY" name="year" className="bg-white outline-none px-2 rounded-lg" />
                                    </div>
                                    <div className="form-group mb-5">
                                        <Select placeholder="MM" onChange={(e: any) => setWalletActivationForm({
                                            ...walletActivationForm,
                                            month: e
                                        })}
                                            className="h-[4rem] bg-transparent outline-none border border-solid rounded-lg px-0 w-full">
                                            {
                                                MonthsOfTheYear.map((month, index) => (
                                                    <Select.Option value={month.index} key={index}>{month.name}</Select.Option>
                                                ))
                                            }
                                        </Select>
                                        {/* value={walletActivationForm?.address} placeholder="MM" className="bg-white outline-none px-2 rounded-lg" /> */}
                                    </div>
                                    <div className="form-group mb-5">
                                        <TextField.Input onChange={UpdateWalletActivationForm} value={walletActivationForm?.date} name="date" placeholder="DD" className="bg-white outline-none px-2 rounded-lg" />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group mb-5">
                                <h1 className="text-sm">House Address</h1>
                                <TextField.TextArea rows={2} onChange={UpdateWalletActivationForm} value={walletActivationForm?.address} name="address" className="bg-white outline-none px-2 rounded-lg pt-2" />
                            </div>
                            <div className="mt-10">
                                <Button isLoading={isLoadingWallet} onClick={handleActivateUserWallet} className="w-full">Activate Wallet</Button>
                            </div>
                        </form>
                    </div>
                </Modal>
                <Modal open={displayWalletWithdrawalModal} onCancel={toggleDisplayWithdrawalModal} footer={null}>
                    <div className="md:w-[95%] mx-auto py-5">
                        {
                            withDrawalType === "bank" ?
                                <h3 className="font-bold text-center text-xl mb-10">Withdraw to Bank</h3>
                                :
                                <h3 className="font-bold text-center text-xl mb-10">Transfer to Wallet</h3>
                        }
                        {
                            withDrawalType === "bank" ?
                                <WithdrawToBank closeAction={toggleDisplayWithdrawalModal} />
                                :
                                <TransferToWallet closeAction={toggleDisplayWithdrawalModal} updateAgentData={handlePageReload} agent={userData} />
                        }
                    </div>
                </Modal>
                <RequestLoanModal openModal={openLoanModal} closeAction={toggleLoanRequestModal} />
            </div>
        </NetworkRequestContainer>
    </DashboardLayout >
}
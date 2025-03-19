import { OTPInputBoxes } from "@/components/auth/OTPInput";
import Button from "@/components/buttons";
import DashboardLayout from "@/components/mda-dashboard/layout";
import { DailyAnalytics } from "@/components/mda-dashboard/main/DailyAnalytics";
import { Hero } from "@/components/mda-dashboard/main/Hero";
import { RevenuePill } from "@/components/mda-dashboard/main/RevenuePill";
import { TransactionHistory } from "@/components/mda-dashboard/main/TransactionHistory";
import { TransactionPill } from "@/components/mda-dashboard/main/TransactionPill";
import { DayData } from "@/components/mda-dashboard/main/WeeklyDeliveries";
import { OngoingTransaction } from "@/components/mda-dashboard/transactions/OngoingTransactions";
import { UserActivityBarGraph } from "@/components/mda-dashboard/transactions/UserActivityBarChart";
import { NetworkRequestContainer } from "@/components/states/NetworkRequestContainer";
import { GlobalActionContext } from "@/context/GlobalActionContext";
import UserContext from "@/context/UserContext";
import { Profile } from "@/models/profile";
import { useFetchUser } from "@/utils/apiHooks/profile/useFetchUser";
import { useSetNewUserPin } from "@/utils/apiHooks/profile/useSetNewPassword";
import { useDashboardInfo } from "@/utils/apiHooks/transactions/useDashboardInfo";
import { Modal } from "antd";
import { useContext, useEffect, useState } from "react";


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

    const { isLoading, error, data, getDashboardInfo } = useDashboardInfo();
    const { isLoading: isLoadingUser, error: userError, data: userFetchedData, fetchUser } = useFetchUser();
    const { isLoading: isLoadingPin, error: usePinError, data: userPinData, setNewPin } = useSetNewUserPin();

    const { user: profile } = useContext(UserContext);
    const { showSnackBar } = useContext(GlobalActionContext);
    const [userOTPValue, setUserOTPValue] = useState("");
    const [openAuthModal, setOpenAuthModal] = useState(false);
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

    // useEffect(() => {
    //     console.log(data)
    // }, [data])

    useEffect(() => {
        if (userError) {
            showSnackBar({
                message: userError,
                severity: 'error'
            })
        }
    }, [userError])
    useEffect(() => {
        if (usePinError) {
            showSnackBar({
                message: usePinError,
                severity: 'error'
            })
        }
    }, [usePinError])
    useEffect(() => {
        if (userPinData === "Successful") {
            showSnackBar({
                message: "Transaction pin set successfully",
                severity: 'success'
            })
            setOpenAuthModal(false);
        }
    }, [userPinData])

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        if (userFetchedData) {
            if (typeof userFetchedData.isPin !== "undefined") {
                if (!userFetchedData.isPin) {
                    setOpenAuthModal(true);
                }
            }
            setUserData(userFetchedData);
        }
    }, [userFetchedData])

    useEffect(() => {
        // setData(getTransasctionsData(16))
    }, [])

    useEffect(() => {
        getDashboardInfo()
    }, [])

    const updateOTPValue = (e: string) => {
        setUserOTPValue(e);
    }

    const completeNewUserTransactionPin = () => {
        if (userOTPValue) {
            setNewPin({
                pin: userOTPValue
            })
        }
    }

    return <DashboardLayout>
        <NetworkRequestContainer isLoading={isLoading} error={error}>
            {(data && !isLoading) && <div className="flex flex-col gap-8">
                <div className="mt-4">
                    <Hero />
                </div>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <TransactionPill data={{
                        title: "All Transactions",
                        description: data.AllTransaction.toString()
                    }} />
                    <TransactionPill data={{
                        title: "Successful Transactions",
                        description: data.SuccessfulTransaction.toString()
                    }} />
                    <TransactionPill data={{
                        title: "Pending Transactions",
                        description: data.PendingTransaction.toString()
                    }} />
                    <TransactionPill data={{
                        title: "Failed Transactions",
                        description: data.FailTransaction.toString()
                    }} />
                </div>
                {/* <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <RevenuePill name="Total Revenue" value={data.TotalAmount.toString()} />
                </div> */}

                <div className="flex items-start gap-8 mb-20">
                    <div className="flex-1 border bg-white rounded-[16px] px-2 py-2">
                        <TransactionHistory />
                    </div>
                </div>
            </div>}
            <Modal open={openAuthModal} onCancel={() => setOpenAuthModal(false)} footer={null}>
                <div>
                    <div className="modal-header">
                        <div className="pt-5 px-5 pb-2">
                            <div>
                                <h4 className="text-2xl font-bold text-center">Add New Transaction PIN</h4>
                            </div>
                        </div>
                    </div>
                    <div className="px-5 pb-10">
                        <div>
                            <div className="mt-10">
                                <p className="font-medium text-sm mb-2">Enter New Transaction PIN</p>
                                <OTPInputBoxes count={4} updateOTP={updateOTPValue} value={userOTPValue} />
                            </div>
                            <div>
                                <div className="flex justify-center">
                                    <Button
                                        isLoading={isLoadingPin}
                                        onClick={completeNewUserTransactionPin}
                                        className="w-full py-5 mt-10 self-center"
                                        variant="contained"
                                    >Save Pin
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </NetworkRequestContainer>
    </DashboardLayout>
}
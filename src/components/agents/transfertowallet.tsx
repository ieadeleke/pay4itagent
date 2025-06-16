import { GlobalActionContext } from "@/context/GlobalActionContext";
import { useFetchBankList } from "@/utils/apiHooks/consultants/useFetchBankList"
import { useVerifyBankList } from "@/utils/apiHooks/consultants/useVerifyBankLIst"
import { useContext, useEffect, useState } from "react";
import { Checkbox, Radio, Select, Spin } from "antd";
import { request, RequestConfig } from "@/utils/request";
import { TextField } from "@/components/input/InputText";
import { useWithdrawFromBank } from "@/utils/apiHooks/consultants/useWithdrawFromBank";
import Button from "../buttons";
import { useCompleteTransfer } from "@/utils/apiHooks/agents/useCompleteTransfer";
import { OTPInputBoxes } from "../auth/OTPInput";
import { useRefreshWallet } from "@/utils/apiHooks/profile/useRefreshWallet";
import { useGetAgentsSummary } from "@/utils/apiHooks/agents/useGetAgentSummary";
import { useGetAgents } from "@/utils/apiHooks/agents/useGetAgents";
import UserContext from "@/context/UserContext";
import { Profile } from "@/models/profile";


interface BankListInterface {
    id?: number,
    code?: string,
    name?: string,
    label: string,
    value: string
}

interface PropType {
    accNum?: string
    status?: string
    firstName?: string
    lastName?: string
    hideDescription?: boolean
    agent: any
    updateAgentData: (props: any) => void
    closeAction?: () => void
}

const TransferToWallet = (props: PropType) => {

    const { isLoading, data, error, withdrawFromBank } = useWithdrawFromBank();
    const { isLoading: isLoadingBankList, data: fetchBankListData, error: fetchBankListError, fetchBankList } = useFetchBankList();
    const { isLoading: isLoadingWalletTransfer, data: completeWalletTransferData, error: errorWalletTransfer, completeWalletTransfer } = useCompleteTransfer();

    const { isLoading: isLoadingWalletRefresh, error: userWalletRefreshError, data: userRefreshData, refreshWallet } = useRefreshWallet();
    const { isLoading: isLoadingSuperAgentWalletRefresh, error: refreshSuperAgentWalletRefreshError, data: refreshSuperAgentRefreshData, refreshWallet: refreshSuperAgent } = useRefreshWallet();
    const { getAgentList, isLoading: loadingAgentSummary, error: errorSummary, data: dataSummary } = useGetAgents();


    const { isLoading: isLoadingVerifyDataList, data: verifyBankDataData, error: VerifyBankDataError, verifyBankData } = useVerifyBankList();

    const [bankData, setBankData] = useState<BankListInterface[]>([]);
    const [userOTPValue, setUserOTPValue] = useState("");
    const [currentFetchState, setCurrentFetchState] = useState<boolean>(false);
    const [loadAccountVerificationData, setLoadAccountVerificationData] = useState(false);
    const [loadingCreditButton, setLoadingCreditButton] = useState<boolean>(false);
    const { showSnackBar } = useContext(GlobalActionContext);
    const { user } = useContext(UserContext);
    const [displayWalletPaymentInfo, setDisplayWalletPaymentInfo] = useState<boolean>(true);
    const [consultantData, setConsultantData] = useState<any>({
        amount: "",
        settlementAccountNumber: props?.accNum,
        description: ""
    });
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

    // const fetchAllBankList = async () => {
    //     let allBanks = await fetchBankList();
    // }
    // useEffect(() => {
    //     if (fetchBankListError) {
    //         showSnackBar({
    //             message: fetchBankListError,
    //             severity: 'error'
    //         })
    //     }
    // }, [fetchBankListError]);
    // useEffect(() => {
    //     if (VerifyBankDataError) {
    //         showSnackBar({
    //             message: VerifyBankDataError,
    //             severity: 'error'
    //         })
    //     }
    // }, [VerifyBankDataError]);

    // useEffect(() => {
    //     if (fetchBankListData) {
    //         let bankList: any[];
    //         bankList = fetchBankListData;
    //         let dataBar: any[] = [];
    //         if (bankList.length) {
    //             bankList.map((data: any, index: number) => {
    //                 let obj = {
    //                     key: index,
    //                     value: `${data.name}----${data.code}`,
    //                     label: data.name
    //                 }
    //                 dataBar.push(obj);
    //             })
    //         }
    //         setBankData(dataBar);
    //     }
    // }, [fetchBankListData])
    // useEffect(() => {
    //     fetchAllBankList();
    // }, [])

    useEffect(() => {
        if (data) {
            showSnackBar({
                message: "Wallet transfer successful",
                severity: 'success'
            })
        }
    }, [data])
    useEffect(() => {
        if (error) {
            showSnackBar({
                message: error,
                severity: 'error'
            })
        }
    }, [error])

    useEffect(() => {
        if (userWalletRefreshError) {
            showSnackBar({
                message: userWalletRefreshError,
                severity: 'error'
            })
        }
    }, [userWalletRefreshError]);

    useEffect(() => {
        if (consultantData.settlementBankName && consultantData.settlementAccountNumber.length === 10) {
            let bankName = consultantData.settlementAccountCBNCode;
            let accNum = consultantData.settlementAccountNumber;

            let bk = gett(bankName, accNum);
            // verifyUserBankData(bankName, accNum);
        }
    }, [consultantData.settlementAccountNumber, consultantData.settlementBankName])

    const updateBankData = (e: any) => {
        setConsultantData({
            ...consultantData,
            settlementBankName: e.split("----")[0],
            settlementAccountCBNCode: e.split("----")[1]
        })
    }

    const gett = async (bankName: string, accNum: string) => {
        setLoadAccountVerificationData(true);
        setConsultantData({
            ...consultantData,
            sortCode: bankName,
            settlementAccountName: "",
        })
        let data: RequestConfig = {
            path: "v1/wallet/AccountDetails",
            body: {
                accountNumber: consultantData.settlementAccountNumber,
                sortCode: bankName
            },
            method: "POST"
        };
        try {
            let verificationData = await request(data);
            if (verificationData.status === "error") {
                showSnackBar({
                    message: verificationData.message,
                    severity: 'error'
                })
                setConsultantData({
                    ...consultantData,
                    sortCode: bankName,
                    settlementAccountName: "guuvug"
                })
            } else {
                setConsultantData({
                    ...consultantData, sortCode: bankName,
                    settlementAccountName: verificationData?.verify_Account?.data?.account_name
                })
            }
            setLoadAccountVerificationData(false);
        }
        catch (err) {
            setLoadAccountVerificationData(false);
            showSnackBar({
                message: "An error occurred while verifying data",
                severity: 'error'
            })
        }
    }

    const updateFormData = (e: any) => {
        setConsultantData({
            ...consultantData,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        if (errorWalletTransfer) {
            showSnackBar({
                message: errorWalletTransfer,
                severity: 'error'
            })
            setLoadingCreditButton(false);
        }
    }, [errorWalletTransfer]);

    useEffect(() => {
        if (dataSummary?.Agents && currentFetchState) {
            props.updateAgentData(dataSummary?.Agents);
            setCurrentFetchState(false);
            showSnackBar({
                message: "Account funded successfully",
                severity: 'success'
            })
            setLoadingCreditButton(false);
            setConsultantData({
                ...consultantData,
                amount: '',
                description: ''
            })
        }
    }, [dataSummary])
    useEffect(() => {
        if (userRefreshData?.found) {
            setTimeout(() => {
                getAgentList({
                    page: 1
                });
            }, 3000)
        }
    }, [userRefreshData])

    useEffect(() => {
        if (user) {
            setUserData(user);
        }
    }, [user])

    const fetchAgentTransDetail = () => {
        setTimeout(() => {
            refreshWallet({
                providerCustomerId: props?.agent?.wallet?.providerCustomerId
            });
        }, 2000)
        if (userData?.wallet?.providerCustomerId) {
            refreshSuperAgent({
                providerCustomerId: userData?.wallet?.providerCustomerId
            });
        }
        setCurrentFetchState(true);
    }
    useEffect(() => {
        if (completeWalletTransferData?.message?.length) {
            // showSnackBar({
            //     message: completeWalletTransferData.message,
            //     severity: 'success'
            // })
            fetchAgentTransDetail();

            let obj = {
                message: completeWalletTransferData.message,
                amount: consultantData?.amount,
                settlementAccountNumber: consultantData?.settlementAccountNumber,
                transfersettlementSecondName: props.lastName,
                transfersettlementFirstName: props.firstName
            }
            // localStorage.setItem("transferStatus", obj.message === "Transfer Queued Successfully" ? "queue" : "success");
            // localStorage.setItem("transferMessage", obj.message);
            // localStorage.setItem("transferAmount", obj.amount);
            // localStorage.setItem("transfersettlementAccountNumber", obj.settlementAccountNumber);

            // if (props.status === "agent") {
            //     localStorage.setItem("transferKeyWord", "to");
            //     localStorage.setItem("transfersettlementFirstName", obj.transfersettlementFirstName ?? "");
            //     localStorage.setItem("transfersettlementSecondName", obj.transfersettlementSecondName ? obj.transfersettlementSecondName : "");
            //     window.location.href = "/agents/summary";
            // } else {
            //     window.location.href = "/wallet/summary";
            // }
        }
    }, [completeWalletTransferData]);

    const completeTransferToWallet = (e: any) => {
        e.preventDefault();
        let { amount,
            description, settlementAccountNumber } = consultantData;
        if ((settlementAccountNumber.length) && (amount.length)) {
            let formData = {
                amount, accountNumber: settlementAccountNumber, description, pin: ''
            }
            completeWalletTransfer(formData);
            setLoadingCreditButton(true);
        } else {
            showSnackBar({
                message: "Please fill all required fields",
                severity: 'error'
            })
        }
    }

    const updateOTPValue = (e: string) => {
        setUserOTPValue(e);
    }

    const closeWalletModal = () => {
        setConsultantData({
            amount: "",
            description: ""
        })
        setUserOTPValue("");
        setLoadingCreditButton(false);
        setDisplayWalletPaymentInfo(true);
        if (props.closeAction) props.closeAction();
    }

    const handleCurrentView = () => {
        if (!consultantData.amount.length) {
            return showSnackBar({
                message: "Please enter amount to transfer",
                severity: 'error'
            })
        }
        // if (!consultantData.description.length) {
        //     return showSnackBar({
        //         message: "Please enter transfer description",
        //         severity: 'error'
        //     })
        // }
        setDisplayWalletPaymentInfo(!displayWalletPaymentInfo);
    }

    return (
        <div>
            {displayWalletPaymentInfo ?
                <div>
                    <div className="form-group mb-5">
                        <div className="flex justify-between">
                            <div>
                                <h1>Amount</h1>
                            </div>
                        </div>
                        <TextField.Input
                            onChange={updateFormData} name="amount" value={consultantData.amount}
                            className="outline-none px-2 rounded-lg" />
                    </div>
                    {
                        !props.accNum ?
                            <div className="form-group mb-5">
                                <div className="flex justify-between">
                                    <div>
                                        <h1>Settlement Account Number</h1>
                                    </div>
                                    <div>
                                        <Spin spinning={loadAccountVerificationData} />
                                    </div>
                                </div>
                                <TextField.Input
                                    onChange={updateFormData} name="settlementAccountNumber"
                                    className="outline-none px-2 rounded-lg" />
                                {/* {consultantData.settlementAccountName.length ? <p className="text-sm text-[#6DB674] uppercase">{consultantData.settlementAccountName}</p> : ""} */}
                            </div>
                            : ""
                    }
                    {
                        props?.hideDescription ? '' :
                            <div className="form-group mb-5">
                                <h1>Description</h1>
                                <TextField.TextArea rows={4}
                                    onChange={updateFormData} name="description"
                                    className="outline-none px-2 py-2 rounded-lg" />
                            </div>
                    }
                    <div>
                        {/* <Button isLoading={loadingCreditButton} onClick={handleCurrentView} className="w-full block mb-5 py-5 text-white rounded-lg">Click here to Transfer</Button> */}
                        <Button isLoading={loadingCreditButton} onClick={completeTransferToWallet} className="w-full block mb-5 py-5 text-white rounded-lg">Click here to Transfer</Button>
                        {/* <Button
                            onClick={closeWalletModal}
                            className="w-full py-5 self-center text-danger"
                            variant="text"
                        >
                            Cancel
                        </Button> */}
                    </div>
                </div>
                :
                <div className="px-5 pb-0">
                    <div>
                        <div className="mt-14">
                            <p className="font-medium text-sm mb-2">Enter Transaction PIN</p>
                            <OTPInputBoxes updateOTP={updateOTPValue} count={4} value={userOTPValue} />
                        </div>
                        <div>
                            <div className="flex flex-col justify-center mt-14">
                                <Button isLoading={loadingCreditButton} onClick={completeTransferToWallet} className="w-full block py-5 text-white rounded-lg">Click here to Transfer</Button>
                                {/* <Button
                                    disabled={isWalletPaymentLoading}
                                    onClick={completePayment}
                                    className="w-full py-5 mt-10 self-center"
                                    variant="contained"
                                >
                                    {loadingCreditButton ? `Please wait...` : `Complete Payment`}
                                </Button> */}
                                <Button
                                    onClick={closeWalletModal}
                                    className="w-full py-5 self-center text-danger"
                                    variant="text"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default TransferToWallet;
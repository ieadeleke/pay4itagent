import React, { useContext, useEffect, useState } from "react";
import EmptyIcon from "@/assets/images/list.png";
import Image from "next/image";
import { useGetSubAgent } from "@/utils/apiHooks/agents/subagents/useGetSubAgentData";
import { capitalizeText } from "@/utils/formatters/capitalizeText";
import { TransactionPill } from "@/components/mda-dashboard/main/TransactionPill";
import { Modal, Spin, Tabs } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { FaArrowLeftLong } from "react-icons/fa6";
import { TbReload } from "react-icons/tb";
import AgentBasicInfo from "./AgentBasicInfo";
import { useSuspendAgents } from "@/utils/apiHooks/agents/subagents/useSuspendAgent";
import { useWithdrawWallet } from "@/utils/apiHooks/agents/subagents/useWithdrawWallet";
import { GlobalActionContext } from "@/context/GlobalActionContext";
import { useFreezeAgent } from "@/utils/apiHooks/agents/subagents/useFreezeAgent";
import { TextField } from "@/components/input/InputText";
import Button from "@/components/buttons";
import { useFundWallet } from "@/utils/apiHooks/agents/subagents/useFundWallet";
import { formatAmount } from "@/utils/formatters/formatAmount";
import { TransactionTable } from "@/components/mda-dashboard/transactions/TransactionTable";
import { convertDateToFormat, getDefaultDateAsString } from "@/utils/data/getDefaultDate";
import { DateRange } from "@/components/calendar/CalendarRange";
import SubAgentTransactionTable from "./SubAgentTransTable";
import SubAgentTotalTransactionTable from "./SubAgentTotalTransactions";
import TransferToWallet from "../transfertowallet";
import { useRefreshWallet } from "@/utils/apiHooks/profile/useRefreshWallet";
import { OTPInputBoxes } from "@/components/auth/OTPInput";
import { generateUUID } from "@/utils/data/generateUUID";
import { useGetSubAgentSummary } from "@/utils/apiHooks/agents/subagents/useSubAgentSummary";
import { Profile } from "@/models/profile";
import { useHandleUserWithdrawalStatus } from "@/utils/apiHooks/agents/subagents/useHandleWithdrawalStatus";
import UserContext from "@/context/UserContext";

interface AgentDataInterface {
    agentID: string;
    agentData: any;
    viewAction: () => void;
}

const ViewSubAgent = (props: AgentDataInterface) => {

    const spinIcon = <LoadingOutlined spin style={{ fontSize: 21 }} />;
    const { showSnackBar } = useContext(GlobalActionContext);
    const [userTransactionData, setUserTransactionData] = useState<any>({});
    const [displayWithdrawModal, setDisplayWithdrawModal] = useState(false);
    const [payWithWalletModal, setPayWithWalletModal] = useState(false);
    const { user: userData } = useContext(UserContext)
    const { isLoading: isLoadingUser, error: userError, data: userFetchedData, getSubAgentData } = useGetSubAgent();
    const { isLoading: isLoadingWithdrawalStatus, error: withdrawalStatusError, data: withdrawalStatusData, changeUserWithdrawalStatus } = useHandleUserWithdrawalStatus();
    const { isLoading: isLoadingSubAgentSummary, error: subAgentSummaryError, data: subAgentSummaryData, getSubAgentSummaryData } = useGetSubAgentSummary();

    const { isLoading: isLoadingSuspendUser, error: userSuspendError, data: userFetchedSuspendData, suspendAgent } = useSuspendAgents();
    const { isLoading: isLoadingWalletRefresh, error: userWalletRefreshError, data: userRefreshData, refreshWallet } = useRefreshWallet();
    const [displayTransferModal, setDisplayTransferModal] = useState(false);
    const { isLoading: isLoadingWithdrawUser, error: userWithdrawError, data: userFetchedWithdrawData, withdrawWallet } = useWithdrawWallet();
    const { isLoading: isLoadingFundUser, error: userFundError, data: userFetchedFundData, fundWallet } = useFundWallet();

    const [withdrawalFormInput, setWithdrawalFormInput] = useState({
        amount: "",
        description: ""
    })
    const [agentWalletData, setAgentWalletData] = useState<any>("");
    const [agentSuspensionStatus, setAgentSuspensionStatus] = useState<boolean>(false);

    const [displayFundModal, setDisplayFundModal] = useState(false);
    const [loadingWithdrawalButton, setLoadingWithdrawalButton] = useState<boolean>(false);
    const [refreshCount, setRefreshCount] = useState(0);
    const [userWithdrawalStatus, setUserWithdrawalStatus] = useState<boolean>(false);


    const [fundFormInput, setFundFormInput] = useState({
        amount: "",
        description: ""
    })
    // const [displayWithdrawModal, setDisplayWithdrawModal] = useState(false);
    // const { isLoading: isLoadingSuspendUser, error: userSuspendError, data: userFetchedSuspendData, suspendAgent } = useSuspendAgents();

    useEffect(() => {
        if (withdrawalStatusData) {
            // console.log(withdrawalStatusData);
            showSnackBar({
                message: 'Withdrawal status updated successfully',
                severity: 'success'
            })
            setUserWithdrawalStatus(withdrawalStatusData?.allowBankTransfer)
        }
    }, [withdrawalStatusData]);

    useEffect(() => {
        let id = props.agentID;
        if (id) {
            getSubAgentData({
                userId: id
            });
            // getSubAgentSummaryData({
            //     agentId: id
            // });
        }
    }, [props.agentID]);

    const handleUserWithdrawalStatus = (e: string) => {
        changeUserWithdrawalStatus({
            userId: props.agentID,
            action: e
        });
    }

    // start freeze agent

    // end freeze agent

    // start suspend agent
    useEffect(() => {
        if (userSuspendError) {
            showSnackBar({
                message: userSuspendError,
                severity: 'error'
            })
        }
    }, [userSuspendError])
    useEffect(() => {
        if (withdrawalStatusError) {
            showSnackBar({
                message: withdrawalStatusError,
                severity: 'error'
            })
        }
    }, [withdrawalStatusError])
    useEffect(() => {
        if (userFetchedSuspendData) {
            setAgentSuspensionStatus(!agentSuspensionStatus);
        }
    }, [userFetchedSuspendData])

    // useEffect(() => {
    //     if (props?.agentData?.wallet?.status === "ACTIVE") {
    //         setAgentWalletData(props.agentData.wallet.availableBalance);
    //     }
    // }, [props.agentData]);
    useEffect(() => {
        setAgentSuspensionStatus(props?.agentData?.isActive);
    }, []);

    const handleSuspendAgent = () => {
        suspendAgent({
            userId: props.agentID,
            status: agentSuspensionStatus
        });
    }

    // stop suspend agent

    const toggleDisplayWithdrawModal = () => {
        setWithdrawalFormInput({
            amount: "",
            description: ""
        })
        setDisplayWithdrawModal(!displayWithdrawModal);
    };

    // complete withdrawal
    const handleFormInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWithdrawalFormInput({
            ...withdrawalFormInput,
            [e.target.name]: e.target.value
        })
    }
    const handleTextAreaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setWithdrawalFormInput({
            ...withdrawalFormInput,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        setUserWithdrawalStatus(props?.agentData?.allowBankTransfer)
    }, [props.agentData])

    useEffect(() => {
        if (userWithdrawError) {
            showSnackBar({
                message: userWithdrawError,
                severity: 'error'
            })
            setLoadingWithdrawalButton(false);
        }
    }, [userWithdrawError])

    useEffect(() => {
        if (userFetchedWithdrawData) {
            showSnackBar({
                message: userFetchedWithdrawData.message,
                severity: 'success'
            })
            let obj = {
                message: userFetchedWithdrawData.message,
                amount: +withdrawalFormInput.amount,
                transfersettlementSecondName: props.agentData.lastName,
                transfersettlementFirstName: props.agentData.firstName
            }
            localStorage.setItem("transferStatus", obj.message === "Transfer Queued Successfully" ? "queue" : "success");
            localStorage.setItem("transferMessage", obj.message);
            localStorage.setItem("transferAmount", String(obj.amount));
            localStorage.setItem("transferKeyWord", "from");
            localStorage.setItem("transfersettlementFirstName", obj.transfersettlementFirstName);
            localStorage.setItem("transfersettlementSecondName", obj.transfersettlementSecondName);
            window.location.href = "/agents/summary";
        }
    }, [userFetchedWithdrawData])
    useEffect(() => {
        if (userFetchedFundData) {
            showSnackBar({
                message: userFetchedFundData.message,
                severity: 'success'
            })
            let obj = {
                message: userFetchedFundData.message,
                amount: +withdrawalFormInput.amount,
                transfersettlementSecondName: props.agentData.lastName,
                transfersettlementFirstName: props.agentData.firstName
            }
            localStorage.setItem("transferStatus", obj.message === "Transfer Queued Successfully" ? "queue" : "success");
            localStorage.setItem("transferMessage", obj.message);
            localStorage.setItem("transferAmount", String(obj.amount));
            localStorage.setItem("transferKeyWord", "to");
            localStorage.setItem("transfersettlementFirstName", obj.transfersettlementFirstName);
            localStorage.setItem("transfersettlementSecondName", obj.transfersettlementSecondName);
            window.location.href = "/agents/summary";
        }
    }, [userFetchedFundData])

    const completePaymentWithdrawal = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!withdrawalFormInput.amount.length) {
            return showSnackBar({
                message: "Please enter amount to transfer",
                severity: 'error'
            })
        }
        // if (!withdrawalFormInput.description.length) {
        //     return showSnackBar({
        //         message: "Please enter transfer description",
        //         severity: 'error'
        //     })
        // }
        let { amount } = withdrawalFormInput;
        if (amount.length) {
            withdrawWallet({
                userId: props.agentID,
                amount: +withdrawalFormInput.amount,
                description: ''
            });
            setLoadingWithdrawalButton(true);
        } else {
            showSnackBar({
                message: "Please fill in all fields",
                severity: 'error'
            })
        }
        // if (handleFormInput)
        // }
    }


    // handle fund wallet
    const toggleDisplayFundWalletModal = () => {
        setFundFormInput({
            amount: "",
            description: ""
        })
        setDisplayFundModal(!displayFundModal);
    };

    // complete withdrawal
    const handleFundWalletFormInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFundFormInput({
            ...fundFormInput,
            [e.target.name]: e.target.value
        })
    }
    const handleFundWalletTextAreaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFundFormInput({
            ...fundFormInput,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        if (userFundError) {
            showSnackBar({
                message: userFundError,
                severity: 'error'
            })
        }
    }, [userFundError])
    const completeFundWalletWithdrawal = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        let { amount } = fundFormInput;
        if (amount.length) {
            fundWallet({
                // userId: props.agentID,
                amount: +fundFormInput.amount,
                description: '',
                accountNumber: "", fee: 0, vat: 0
            });
        } else {
            showSnackBar({
                message: "Please fill in all fields",
                severity: 'error'
            })
        }
        // if (handleFormInput)
        // }
    }
    // const handleUnSuspendAgent = () => {
    //     unSuspendAgent({
    //         userId: userTransactionData._id
    //     });
    // }

    // const handleFreezeAgent = () => {
    //     freezeAgent({
    //         accountNumber: userTransactionData.wallet?.accountNumber ? userTransactionData.wallet.accountNumber : ""
    //     });
    // }

    // const handleUnfreezeAgent = () => {
    //     UnfreezeAgent({
    //         accountNumber: userTransactionData.wallet?.accountNumber ? userTransactionData.wallet.accountNumber : ""
    //     });
    // }

    const [date, setDate] = useState(getDefaultDateAsString());
    const [page, setPage] = useState(0);

    // useEffect(() => {
    //     console.log(userData);
    // }, [userData])

    function onDateApplied(date: DateRange) {
        setDate({
            startDate: convertDateToFormat(date.from),
            endDate: convertDateToFormat(date.to ?? new Date()),
        });
    }

    function onPageChange(selectedItem: {
        selected: number;
    }) {
        setPage(selectedItem.selected)
    }

    const copyToClipboard = async () => {
        try {
            let accName = props.agentData?.wallet?.accountNumber ? props.agentData?.wallet?.accountNumber : '';
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

    // useEffect(() => {
    //     console.log(props.agentData)
    // }, [userTransactionData])
    const handleWalletBalanceRefresh = () => {
        if (props.agentData?.wallet?.providerCustomerId) {
            refreshWallet({
                providerCustomerId: props.agentData?.wallet?.providerCustomerId
            })
            setRefreshCount(refreshCount + 1);
        }
    }

    useEffect(() => {
        if (userRefreshData) {
            setAgentWalletData(userRefreshData.availableBalance);
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

    const closeTransferModal = () => {
        setDisplayTransferModal(false);
    }

    return (
        <div>
            <div className="flex flex-col gap-8">
                {/* <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <TransactionPill data={{
                        title: "Total Available Balance",
                        description: singleSubAgentSummaryData?.totalAvailableBalance
                    }} />
                    <TransactionPill data={{
                        title: "Today's Credit Bank Transfer",
                        description: singleSubAgentSummaryData?.totalBankTransferCreditToday
                    }} />
                    <TransactionPill data={{
                        title: "Today's Bill Transactions",
                        description: singleSubAgentSummaryData?.totalBillTransactionToday
                    }} />
                    <TransactionPill data={{
                        title: "Last One Month's Bill Transactions",
                        description: singleSubAgentSummaryData?.totalBillTransactionLastOneMonth
                    }} />
                </div> */}
                <div className="bg-white border border-gray-200 rounded-xl p-8 px-3 md:px-8">
                    <div>
                        <button onClick={() => props.viewAction()} className="flex gap-5 bg-transparent items-center text-base md:text-xl">
                            <FaArrowLeftLong /> <h4>Go Back</h4>
                        </button>
                    </div>
                    {
                        props?.agentData?.wallet?.status === "ACTIVE" ?
                            <div>
                                <div className="text-center flex gap-10 items-center justify-center">
                                    <h2 className="text-4xl md:text-9xl block mt-5">{agentWalletData ? formatAmount(+agentWalletData) :
                                        props.agentData.wallet.availableBalance ? formatAmount(props.agentData.wallet.availableBalance) : formatAmount(0)}</h2>
                                    {
                                        !isLoadingWalletRefresh ?
                                            <div className="cursor-pointer" onClick={handleWalletBalanceRefresh}>
                                                <TbReload className="text-black text-3xl" />
                                            </div>
                                            :
                                            <Spin indicator={<LoadingOutlined spin className="text-black font-black" />} />
                                    }
                                </div>
                                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-5 w-full md:w-[90%] block mx-auto mt-10">
                                    {/* <button
                                        onClick={() => setDisplayTransferModal(true)}
                                        className="w-full py-5 text-white bg-primary border-primary border-2 rounded-lg">Fund Wallet</button>
                                    <button
                                        onClick={toggleDisplayWithdrawModal}
                                        className="w-full py-5 text-white bg-danger border-danger border-2 rounded-lg">Defund Wallet</button> */}
                                    {
                                        agentSuspensionStatus ?
                                            <button disabled={isLoadingSuspendUser ? true : false} onClick={handleSuspendAgent}
                                                className="w-full py-5 text-danger bg-transparent border-danger border-2 rounded-lg">
                                                {
                                                    isLoadingSuspendUser ? <Spin indicator={spinIcon} size="small" /> : "Suspend Account"
                                                }
                                            </button>
                                            :
                                            <button disabled={isLoadingSuspendUser ? true : false} onClick={handleSuspendAgent}
                                                className="w-full py-5 text-primary bg-transparent border-primary border-2 rounded-lg">
                                                {
                                                    isLoadingSuspendUser ? <Spin indicator={spinIcon} size="small" /> : "Unsuspend Account"
                                                }
                                            </button>
                                    }
                                    {
                                        userWithdrawalStatus ?
                                            <Button onClick={() => handleUserWithdrawalStatus('disallow')}
                                                isLoading={isLoadingWithdrawalStatus}
                                                className="w-full py-5 px-5 text-white bg-danger border-danger border-2 rounded-lg">Disallow Withdrawal Status</Button>
                                            :
                                            <Button onClick={() => handleUserWithdrawalStatus('approve')}
                                                isLoading={isLoadingWithdrawalStatus}
                                                className="w-full py-5 px-5 text-white bg-primary border-primary border-2 rounded-lg">Approve Withdrawal Status</Button>
                                    }
                                </div>
                                <Tabs type="card" size="large" className="mt-10 w-full">
                                    <Tabs.TabPane key={1} tab="Account Information">
                                        <div className="px-4 md:px-10 py-5 pb-20">
                                            <AgentBasicInfo content={props.agentData} />
                                        </div>
                                    </Tabs.TabPane>
                                    <Tabs.TabPane key={2} tab="Wallet History">
                                        {/* <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mt-10">
                                            <TransactionPill data={{
                                                title: "Total Amount",
                                                description: userTransactionData?.TotalAmount?.toString() ? userTransactionData?.TotalAmount : "0.00"
                                            }} />
                                            <TransactionPill data={{
                                                title: "Total Amount Successful",
                                                description: userTransactionData?.TotalAmountSuccessful?.toString() ? userTransactionData?.TotalAmountSuccessful : "0.00"
                                            }} />
                                            <TransactionPill data={{
                                                title: "Failed Transactions",
                                                description: userTransactionData?.FailTransaction?.toString() ? userTransactionData?.FailTransaction : "0.00"
                                            }} />
                                        </div> */}
                                        {/* <div className="flex items-start flex-col w-[100%] gap-8">
                                            <Tabs type="card" size="large" className="mt-5">
                                                <Tabs.TabPane key={"inner1"} tab="Wallet History"> */}
                                        <SubAgentTransactionTable walletId={props.agentData?.wallet?._id} refreshCount={refreshCount} />
                                        {/* </Tabs.TabPane> */}
                                        {/* </Tabs> */}
                                        {/* </div> */}
                                    </Tabs.TabPane>
                                    <Tabs.TabPane key={3} tab="Transaction History">
                                        <SubAgentTotalTransactionTable walletId={props.agentData?.wallet?._id} userId={props.agentData?._id} refreshCount={refreshCount} />
                                    </Tabs.TabPane>
                                </Tabs>
                            </div>
                            :
                            <div className="empty-icon">
                                <div>
                                    <Image src={EmptyIcon} alt="empty icon" width={0} height={0} className="w-[15%] mx-auto mb-5" />
                                    <p>SubAgent wallet has not been activated yet</p>
                                </div>
                            </div>
                    }
                </div>
            </div>
            <Modal open={displayWithdrawModal} onCancel={toggleDisplayWithdrawModal} footer={null}>
                <div className="pt-5 mb-5">
                    <h3 className="font-bold text-center text-xl mb-10">Defund Sub-Agent Wallet</h3>
                </div>
                <form action="" onSubmit={completePaymentWithdrawal} autoComplete="false">
                    <div className="mb-5">
                        <h5 className="text-base">Amount</h5>
                        <TextField.Input type="tel" name="amount" value={withdrawalFormInput.amount} className="outline-none px-2 text-sm rounded-lg"
                            onChange={handleFormInput} />
                    </div>
                    {/* <div>
                        <h5 className="text-base">Description</h5>
                        <TextField.TextArea rows={4} name="description" value={withdrawalFormInput.description} className="outline-none px-2 py-2 text-sm rounded-lg"
                            onChange={handleTextAreaInput} />
                    </div> */}

                    <div className="mt-10">
                        <Button isLoading={loadingWithdrawalButton} className="w-full">Complete Defund</Button>
                    </div>
                </form>
            </Modal>
            <Modal open={displayFundModal} onCancel={toggleDisplayFundWalletModal} footer={null}>
                <div className="pt-5 mb-5">
                    <h3 className="font-bold text-center text-xl mb-10">Credit Sub-Agent Wallet</h3>
                </div>
                <form action="" onSubmit={completeFundWalletWithdrawal} autoComplete="false">
                    <div className="mb-5">
                        <h5 className="text-base">Amount</h5>
                        <TextField.Input type="tel" name="amount" value={fundFormInput.amount} className="outline-none px-2 text-sm rounded-lg"
                            onChange={handleFundWalletFormInput} />
                    </div>
                    {/* <div>
                        <h5 className="text-base">Description</h5>
                        <TextField.TextArea rows={4} name="description" value={fundFormInput.description} className="outline-none px-2 py-2 text-sm rounded-lg"
                            onChange={handleFundWalletTextAreaInput} />
                    </div> */}

                    <div className="mt-10">
                        <Button isLoading={isLoadingFundUser} className="w-full">Complete Fund Wallet</Button>
                    </div>
                </form>
            </Modal>

            <Modal open={displayTransferModal} onCancel={() => setDisplayTransferModal(false)} footer={null}>
                <div className="md:w-[80%] mx-auto pt-10">
                    <h3 className="font-bold text-center text-xl mb-10">Fund Agent Wallet</h3>
                    <TransferToWallet status="agent" accNum={props?.agentData?.wallet?.accountNumber} firstName={props.agentData.firstName}
                        lastName={props.agentData.lastName} closeAction={closeTransferModal} hideDescription={true} />
                    {/* <p className="text-center mb-5 text-base md:w-[80%] mx-auto">Copy the account number below and transfer funds from any bank.</p>
                    <div className="mb-8 bg-[#F2F2F2] px-5 h-[12rem] rounded-[8px] flex flex-col items-center justify-center">
                        <p className="text-lg mb-5">{capitalizeText(props.agentData?.wallet?.bankName ? props.agentData?.wallet?.bankName : "")}</p>
                        <h2 className="text-4xl font-black mb-5">{props.agentData?.wallet?.accountNumber ? props.agentData?.wallet?.accountNumber : ""}</h2>
                        <p className="text-lg">{capitalizeText(props.agentData?.wallet?.accountName ? props.agentData?.wallet?.accountName : "")}</p>
                    </div>
                    <button onClick={copyToClipboard} className="bg-primary text-white rounded-lg py-4 w-full">Copy Account Number</button> */}
                </div>
            </Modal>

            {/* <Modal footer={null} open={payWithWalletModal} onClose={closeWalletModal} className="payment-modal">
                <div>
                    <div className="modal-header">
                        <div className="pt-5 px-5 pb-2">
                            <div>
                                <h4 className="text-2xl mb-4 font-bold text-center">Complete Payment</h4>
                                <p className="text-center text-lg">You have {formatAmount(user?.wallet?.availableBalance ? user?.wallet?.availableBalance : "")} in your wallet balance.</p>
                            </div>
                        </div>
                    </div>
                    <div className="px-5 pb-0">
                        <div>
                            <div className="mt-10">
                                <p className="font-medium text-sm mb-2">Enter Transaction PIN</p>
                                <OTPInputBoxes updateOTP={updateOTPValue} count={4} value={userOTPValue} />
                            </div>
                            <div>
                                <div className="flex flex-col justify-center">
                                    <Button
                                        disabled={isWalletPaymentLoading}
                                        onClick={completePayment}
                                        className="w-full py-5 mt-10 self-center"
                                        variant="contained"
                                    >
                                        {isWalletPaymentLoading ? `Please wait...` : `Complete Payment`}
                                    </Button>
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
                </div>
            </Modal > */}
        </div>
    )
}

export default ViewSubAgent;
import { GlobalActionContext } from "@/context/GlobalActionContext";
import { useFetchBankList } from "@/utils/apiHooks/consultants/useFetchBankList"
import { useVerifyBankList } from "@/utils/apiHooks/consultants/useVerifyBankLIst"
import { useContext, useEffect, useState } from "react";
import { Checkbox, Modal, Radio, Select, Spin } from "antd";
import { request, RequestConfig } from "@/utils/request";
import { TextField } from "@/components/input/InputText";
import { useAddConsultant } from "@/utils/apiHooks/consultants/useAddConsultant";
import Button from "../buttons";
import { useCompleteTransfer } from "@/utils/apiHooks/agents/useCompleteTransfer";
import { OTPInputBoxes } from "../auth/OTPInput";
import { useWithdrawWallet } from "@/utils/apiHooks/agents/subagents/useWithdrawWallet";
import { useGetAgents } from "@/utils/apiHooks/agents/useGetAgents";
import { useRefreshWallet } from "@/utils/apiHooks/profile/useRefreshWallet";


interface BankListInterface {
    id?: number,
    code?: string,
    name?: string,
    label: string,
    value: string
}

interface PropType {
    openModal?: boolean
    closeModal?: () => void
    userData?: any
    hideDescription?: boolean
    closeAction?: () => void
    updateAgentData: (props: any) => void
}

const DefundWalletModal = (props: PropType) => {

    const { isLoading: isLoadingWithdrawUser, error: userWithdrawError, data: userFetchedWithdrawData, withdrawWallet } = useWithdrawWallet();
    const { getAgentList, isLoading: loadingAgentSummary, error: errorSummary, data: dataSummary } = useGetAgents();
    const { isLoading: isLoadingWalletRefresh, error: userWalletRefreshError, data: userRefreshData, refreshWallet } = useRefreshWallet();


    const [userOTPValue, setUserOTPValue] = useState("");
    const [loadingCreditButton, setLoadingCreditButton] = useState<boolean>(false);
    const { showSnackBar } = useContext(GlobalActionContext);
    const [displayWalletPaymentInfo, setDisplayWalletPaymentInfo] = useState<boolean>(true);
    const [currentFetchState, setCurrentFetchState] = useState<boolean>(false);


    const [withdrawalFormInput, setWithdrawalFormInput] = useState({
        amount: "",
        description: ""
    })

    useEffect(() => {
        if (dataSummary?.Agents && currentFetchState) {
            props.updateAgentData(dataSummary?.Agents);
            setCurrentFetchState(false);
            showSnackBar({
                message: "Account defunded successfully",
                severity: 'success'
            })
            setLoadingCreditButton(false);
            setWithdrawalFormInput({
                amount: '',
                description: ''
            })
        }
    }, [dataSummary])
    useEffect(() => {
        if (userRefreshData?.found) {
            getAgentList({
                page: 1
            });
        }
    }, [userRefreshData])


    const fetchAgentTransDetail = () => {
        refreshWallet({
            providerCustomerId: props?.userData?.wallet?.providerCustomerId
        });
        setCurrentFetchState(true);
    }

    useEffect(() => {
        if (userFetchedWithdrawData) {
            fetchAgentTransDetail();

            // showSnackBar({
            //     message: userFetchedWithdrawData.message,
            //     severity: 'success'
            // })
            // let obj = {
            //     message: userFetchedWithdrawData.message,
            //     amount: +withdrawalFormInput.amount,
            //     transfersettlementSecondName: props.userData?.lastName,
            //     transfersettlementFirstName: props.userData?.firstName
            // }
            // localStorage.setItem("transferStatus", obj.message === "Transfer Queued Successfully" ? "queue" : "success");
            // localStorage.setItem("transferMessage", obj.message);
            // localStorage.setItem("transferAmount", String(obj.amount));
            // localStorage.setItem("transferKeyWord", "from");
            // localStorage.setItem("transfersettlementFirstName", obj.transfersettlementFirstName);
            // localStorage.setItem("transfersettlementSecondName", obj.transfersettlementSecondName);
            // window.location.href = "/agents/summary";
        }
    }, [userFetchedWithdrawData])

    useEffect(() => {
        if (userWithdrawError) {
            showSnackBar({
                message: userWithdrawError,
                severity: 'error'
            })
            setLoadingCreditButton(false);
        }
    }, [userWithdrawError])
    useEffect(() => {
        if (userWalletRefreshError) {
            showSnackBar({
                message: userWalletRefreshError,
                severity: 'error'
            })
        }
    }, [userWalletRefreshError]);

    const updateOTPValue = (e: string) => {
        setUserOTPValue(e);
    }

    const closeWalletModal = () => {
        setWithdrawalFormInput({
            amount: "",
            description: ""
        })
        setUserOTPValue("");
        if (props.closeModal) props.closeModal();
        setDisplayWalletPaymentInfo(true);
    }

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
        let { amount, description } = withdrawalFormInput;
        if (amount.length) {
            withdrawWallet({
                userId: props.userData?._id,
                amount: +withdrawalFormInput.amount,
                description: withdrawalFormInput.description
            });
            setLoadingCreditButton(true);
        } else {
            showSnackBar({
                message: "Please fill in all fields",
                severity: 'error'
            })
        }
        // if (handleFormInput)
        // }
    }

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

    return (
        <div>
            <Modal open={props.openModal} onCancel={closeWalletModal} footer={null}>
                <div className="pt-5 mb-5">
                    <h3 className="font-bold text-center text-xl mb-10">Defund Sub-Agent Wallet</h3>
                </div>
                <form action="" onSubmit={completePaymentWithdrawal} autoComplete="false">
                    <div className="mb-5">
                        <h5 className="text-base">Amount</h5>
                        <TextField.Input type="tel" name="amount" value={withdrawalFormInput.amount} className="outline-none px-2 text-sm rounded-lg"
                            onChange={handleFormInput} />
                    </div>
                    {
                        props.hideDescription ? '' :
                            <div>
                                <h5 className="text-base">Description</h5>
                                <TextField.TextArea rows={4} name="description" value={withdrawalFormInput.description} className="outline-none px-2 py-2 text-sm rounded-lg"
                                    onChange={handleTextAreaInput} />
                            </div>
                    }
                    <div className="mt-10">
                        <Button isLoading={loadingCreditButton} className="w-full">Complete Defund</Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default DefundWalletModal;
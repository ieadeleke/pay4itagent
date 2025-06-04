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
import { useRefreshWallet } from "@/utils/apiHooks/profile/useRefreshWallet";
import { useGetAgentsSummary } from "@/utils/apiHooks/agents/useGetAgentSummary";
import { useGetAgents } from "@/utils/apiHooks/agents/useGetAgents";
import { useAddNewLoan } from "@/utils/apiHooks/agents/useAddLoan";
import dayjs from 'dayjs';
import { useRepayHalfLoanRequests } from "@/utils/apiHooks/agents/useLoanRepayPartPayment";


interface BankListInterface {
    id?: number,
    code?: string,
    name?: string,
    label: string,
    value: string
}

interface PropType {
    openModal: boolean
    loanId: string
    // accNum?: string
    // status?: string
    // firstName?: string
    // lastName?: string
    // hideDescription?: boolean
    // agent: any
    // updateloanData: (props: any) => void
    closeAction: () => void
}

const LoanPartPaymentModal = (props: PropType) => {

    const { isLoading, data, error, repayHalfLoanRequest } = useRepayHalfLoanRequests();

    const [loadingLoanButton, setLoadingLoanButton] = useState<boolean>(false);
    const { showSnackBar } = useContext(GlobalActionContext);
    const [loanData, setLoanData] = useState<any>({
        amount: "",
    })

    const updateFormData = (e: any) => {
        setLoanData({
            ...loanData,
            [e.target.name]: e.target.value
        })
    }

    const closeModal = () => {
        props.closeAction();
        setLoanData({
            amount: ""
        });
        setLoadingLoanButton(false);
    }

    useEffect(() => {
        if (data) {
            showSnackBar({
                message: `${loanData.amount} paid successfully`,
                severity: 'success'
            })
            closeModal();
            window.location.reload();
        }
    }, [data])

    useEffect(() => {
        if (error) {
            showSnackBar({
                message: error,
                severity: 'error'
            })
            setLoadingLoanButton(false);
        }
    }, [error])

    const handleLoanRequest = () => {
        if (!loanData.amount.length) {
            return showSnackBar({
                message: "Please enter amount to repay",
                severity: 'error'
            })
        }
        const newDate = dayjs().add(1, 'day');
        repayHalfLoanRequest({
            amount: loanData.amount,
            loanId: props.loanId
        })
        setLoadingLoanButton(true);
    }

    return (
        <div>
            <Modal open={props.openModal} onCancel={closeModal} footer={null}>
                <div>
                    <h3 className="font-bold text-center text-xl mb-10">Request Float</h3>

                    <div className="form-group mb-5">
                        <div className="flex justify-between">
                            <div>
                                <h1>Amount</h1>
                            </div>
                        </div>
                        <TextField.Input
                            onChange={updateFormData} name="amount" value={loanData.amount}
                            className="outline-none px-2 rounded-lg" />
                    </div>
                    <div>
                        <Button isLoading={loadingLoanButton} onClick={handleLoanRequest} className="w-full block mb-5 py-5 text-white rounded-lg">Continue</Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default LoanPartPaymentModal;
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


interface BankListInterface {
    id?: number,
    code?: string,
    name?: string,
    label: string,
    value: string
}

interface PropType {
    openModal: boolean
    // accNum?: string
    // status?: string
    // firstName?: string
    // lastName?: string
    // hideDescription?: boolean
    // agent: any
    // updateAgentData: (props: any) => void
    closeAction: () => void
}

const RequestLoanModal = (props: PropType) => {

    const { isLoading, data, error, addNewLoanRequest } = useAddNewLoan();

    const [loadingLoanButton, setLoadingLoanButton] = useState<boolean>(false);
    const { showSnackBar } = useContext(GlobalActionContext);
    const [agentData, setAgentData] = useState<any>({
        amount: "",
    })

    const updateFormData = (e: any) => {
        setAgentData({
            ...agentData,
            [e.target.name]: e.target.value
        })
    }

    const closeModal = () => {
        props.closeAction();
        setAgentData({
            amount: ""
        });
        setLoadingLoanButton(false);
    }

    useEffect(() => {
        if (data) {
            showSnackBar({
                message: "Float requested successfully",
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
        if (!agentData.amount.length) {
            return showSnackBar({
                message: "Please enter float request amount",
                severity: 'error'
            })
        }
        const newDate = dayjs().add(1, 'day');
        addNewLoanRequest({
            loanAmount: agentData.amount,
            endDate: newDate.format('YYYY-MM-DD')
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
                            onChange={updateFormData} name="amount" value={agentData.amount}
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

export default RequestLoanModal;
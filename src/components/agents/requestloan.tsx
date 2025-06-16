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
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button as DateButton } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


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
    const [date, setDate] = useState<Date>()
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
            // window.location.reload();
            window.location.href = "/wallet?activekey=2";
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
            endDate: date
        })
        setLoadingLoanButton(true);
    }

    useEffect(() => {
        console.log(date)
    },[date])

    return (
        <div>
            <Modal open={props.openModal} onCancel={closeModal} footer={null}>
                <div className="loan-request relative">
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
                    <div className="form-group mb-5">
                        <div className="flex justify-between">
                            <div>
                                <h1>Loan Expiration Date</h1>
                            </div>
                        </div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <DateButton
                                    variant="outline"
                                    data-empty={!date}
                                    className="data-[empty=true]:text-muted-foreground outline-none py-8 w-full justify-start text-left font-normal"
                                >
                                    <CalendarIcon />
                                    {date ? format(date, "yyyy-MM-dd") : <span>Pick a date</span>}
                                </DateButton>
                            </PopoverTrigger>
                            <PopoverContent className="loan-popover w-auto p-0">
                                <Calendar mode="single" selected={date} onSelect={setDate} />
                            </PopoverContent>
                        </Popover>
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
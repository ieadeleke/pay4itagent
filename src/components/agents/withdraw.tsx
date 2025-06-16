import { GlobalActionContext } from "@/context/GlobalActionContext";
import { useFetchBankList } from "@/utils/apiHooks/consultants/useFetchBankList"
import { useVerifyBankList } from "@/utils/apiHooks/consultants/useVerifyBankLIst"
import { useContext, useEffect, useState } from "react";
import { Checkbox, Radio, Select, Spin } from "antd";
import { request, RequestConfig } from "@/utils/request";
import { TextField } from "@/components/input/InputText";
import { useWithdrawFromBank } from "@/utils/apiHooks/consultants/useWithdrawFromBank";
import Button from "../buttons";
import { OTPInputBoxes } from "../auth/OTPInput";


interface BankListInterface {
    id?: number,
    code?: string,
    name?: string,
    label: string,
    value: string
}

interface WithdrawalProps {
    closeAction?: () => void
}

const WithdrawToBank = (props: WithdrawalProps) => {

    const { isLoading, data, error, withdrawFromBank } = useWithdrawFromBank();
    const { isLoading: isLoadingBankList, data: fetchBankListData, error: fetchBankListError, fetchBankList } = useFetchBankList();
    const { isLoading: isLoadingVerifyDataList, data: verifyBankDataData, error: VerifyBankDataError, verifyBankData } = useVerifyBankList();

    const [bankData, setBankData] = useState<BankListInterface[]>([]);
    const [loadAccountVerificationData, setLoadAccountVerificationData] = useState(false);
    const [userOTPValue, setUserOTPValue] = useState("");
    const [loadingCreditButton, setLoadingCreditButton] = useState<boolean>(false);
    const { showSnackBar } = useContext(GlobalActionContext);
    const [displayWalletPaymentInfo, setDisplayWalletPaymentInfo] = useState<boolean>(true);

    const [consultantData, setConsultantData] = useState<any>({
        amount: "",
        settlementAccountNumber: "",
        settlementBankName: "",
        settlementAccountName: "",
        settlementAccountCBNCode: "",
        description: "", sortCode: ""
    })

    const fetchAllBankList = async () => {
        let allBanks = await fetchBankList();
    }
    useEffect(() => {
        if (fetchBankListError) {
            showSnackBar({
                message: fetchBankListError,
                severity: 'error'
            })
        }
    }, [fetchBankListError]);
    useEffect(() => {
        if (VerifyBankDataError) {
            showSnackBar({
                message: VerifyBankDataError,
                severity: 'error'
            })
        }
    }, [VerifyBankDataError]);

    useEffect(() => {
        if (fetchBankListData) {
            let bankList: any[];
            bankList = fetchBankListData;
            let dataBar: any[] = [];
            if (bankList.length) {
                bankList.map((data: any, index: number) => {
                    let obj = {
                        key: index,
                        value: `${data.name}----${data.code}`,
                        label: data.name
                    }
                    dataBar.push(obj);
                })
            }
            setBankData(dataBar);
        }
    }, [fetchBankListData])

    useEffect(() => {
        fetchAllBankList();
    }, [])

    useEffect(() => {
        if (data) {
            showSnackBar({
                message: data.message,
                severity: 'success'
            })
            let obj = {
                message: data.message,
                amount: consultantData?.amount,
                settlementAccountNumber: consultantData?.settlementAccountNumber,
                description: consultantData?.description
            }
            localStorage.setItem("transferStatus", obj.message === "Transfer Queued Successfully" ? "queue" : "success");
            localStorage.setItem("transferMessage", obj.message);
            localStorage.setItem("transferAmount", obj.amount);
            localStorage.setItem("transfersettlementAccountNumber", obj.settlementAccountNumber);
            localStorage.setItem("transferdescription", obj.description);
            window.location.href = "/wallet/summary";
        }
    }, [data])
    useEffect(() => {
        if (error) {
            showSnackBar({
                message: error,
                severity: 'error'
            })
            setLoadingCreditButton(false);
        }
    }, [error])

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
            if (verificationData.message === "success") {
                setConsultantData({
                    ...consultantData, sortCode: bankName,
                    settlementAccountName: verificationData?.banks?.account?.accountName
                })
            } else {
                showSnackBar({
                    message: verificationData.message,
                    severity: 'error'
                })
                setConsultantData({
                    ...consultantData,
                    sortCode: bankName,
                    settlementAccountName: ""
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

    const completeUserBankWithdrawal = () => {
        let { amount,
            settlementAccountNumber, sortCode,
            settlementBankName, description } = consultantData
        if ((settlementAccountNumber.length) && (settlementBankName.length) && (amount.length)) {
            let formData = {
                amount, accountNumber: settlementAccountNumber, accountName: settlementBankName, description, sortCode, pin: userOTPValue
            }
            withdrawFromBank(formData);
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

    const handleCurrentView = () => {
        let { amount,
            settlementAccountNumber, sortCode,
            settlementBankName, description } = consultantData
        if ((!settlementAccountNumber.length) || (!settlementBankName.length) || (!amount.length)) {
            return showSnackBar({
                message: "Please enter all fields",
                severity: 'error'
            })
        }
        setDisplayWalletPaymentInfo(!displayWalletPaymentInfo);
    }

    const closeWalletModal = () => {
        setUserOTPValue("");
        if (props.closeAction) props.closeAction();
        setConsultantData({
            amount: "",
            settlementAccountNumber: "",
            settlementBankName: "",
            settlementAccountName: "",
            settlementAccountCBNCode: "",
            description: "", sortCode: ""
        })
        setDisplayWalletPaymentInfo(true);
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
                            onChange={updateFormData} name="amount"
                            className="outline-none px-2 rounded-lg" />
                    </div>
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
                        {consultantData.settlementAccountName.length ? <p className="text-sm text-[#6DB674] uppercase">{consultantData.settlementAccountName}</p> : ""}
                    </div>
                    <div className="form-group mb-5">
                        <h1>Settlement Bank Name</h1>
                        <Select onChange={updateBankData} className="border-[#E2E8F0] border rounded-lg" style={{ height: "4rem", display: "block", width: "100%" }}
                            showSearch filterOption={(input, option) =>
                                (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
                            }
                            options={bankData}>
                        </Select>
                    </div>
                    <div className="form-group mb-5">
                        <h1>Description</h1>
                        <TextField.TextArea rows={4}
                            onChange={updateFormData} name="description"
                            className="outline-none px-2 rounded-lg" />
                    </div>
                    <div>
                        <Button onClick={handleCurrentView} className="w-full block py-5 text-white rounded-lg">Continue</Button>
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
                                <Button isLoading={loadingCreditButton} onClick={completeUserBankWithdrawal} className="w-full block py-5 text-white rounded-lg">Click here to Transfer</Button>
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

export default WithdrawToBank;

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Transaction } from "@/models/transactions";
import { forwardRef, useContext, useImperativeHandle, useState } from "react";
import { formatDate } from "@/utils/formatters/formatDate";
import { formatAmount } from "@/utils/formatters/formatAmount";
import Button from "@/components/buttons";
import { GlobalActionContext } from "@/context/GlobalActionContext";

type TransactionTabType = {
    metadata?: {
        originatorAccountName?: string
    }
    createdAt: string
    amount: number
    balance_after: number
    balance_before: number
    category: string
    currency: string
    description: string
    reference: string
    status: string
    total: number
    type: string
    walletId: string,
    reprocessPayment?: () => void
}

type TransactionDetailsPayload = {
    data: TransactionTabType;
};

type TransactionDetailsProps = {
    reprocessPayment?: () => void
    reversePayment?: () => void
};

export type TransactionDetailsRef = {
    open: (payload: TransactionDetailsPayload) => void;
    close?: () => void;
};

type DetailItemProps = {
    data: {
        title: string,
        value: string
    }
}

const DetailItem = (props: DetailItemProps) => {
    return <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-left text-gray-600">
            {props.data.title}
        </Label>
        <Input id="name" disabled value={props.data.value} className="col-span-3" />
    </div>
}

export const TransactionDetails = forwardRef<
    TransactionDetailsRef,
    TransactionDetailsProps
>((props, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const [transaction, setTransaction] = useState<TransactionTabType>();
    const { showSnackBar } = useContext(GlobalActionContext);

    useImperativeHandle(ref, () => ({
        open(payload: TransactionDetailsPayload) {
            setTransaction(payload.data);
            setIsVisible(true);
        },
        close() {
            closeModal();
        },
    }));

    function closeModal() {
        setIsVisible(false);
    }

    function handlePrintReceipt() {
        showSnackBar({
            message: "Cannot print receipt",
            severity: 'error'
        })
        // if (transaction) {
        //     // window.open(transaction.NotificationDetails.ReceiptNumber, "_blank")
        // } else {
        //     set
        // }
    }

    function handleGenerateReceipt() {
        if (transaction) {
            // const url = `https://usepay4it.com/payment/collection?tx_reference=${transaction.paymentRef}`
        }
    }

    return (
        <Dialog open={isVisible} onOpenChange={setIsVisible}>
            {transaction && <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-scroll no-scrollbar">
                <DialogHeader>
                    <DialogTitle>Transaction Info</DialogTitle>
                    <DialogDescription>Full details summary</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <DetailItem data={{
                        title: "Date",
                        value: formatDate(transaction?.createdAt)
                    }} />
                    <DetailItem data={{
                        title: "Category",
                        value: transaction.category
                    }} />
                    <DetailItem data={{
                        title: "Balance Before",
                        value: formatAmount(transaction.balance_before)
                    }} />
                    <DetailItem data={{
                        title: "Amount Paid",
                        value: formatAmount(transaction.amount)
                    }} />
                    <DetailItem data={{
                        title: "Balance After",
                        value: formatAmount(transaction.balance_after)
                    }} />
                    <DetailItem data={{
                        title: "Payment Status",
                        value: transaction.status
                    }} />
                    <DetailItem data={{
                        title: "Payment Type",
                        value: transaction.type
                    }} />
                    <DetailItem data={{
                        title: "Payment Description",
                        value: transaction.description
                    }} />
                    {
                        transaction?.category === "NIP_CREDIT" &&
                        <DetailItem data={{
                            title: "Sender",
                            value: transaction?.metadata?.originatorAccountName || ''
                        }} />
                    }
                </div>
                <DialogFooter className="gap-4">
                    {/* <Button variant="outlined" onClick={handlePrintReceipt} type="submit">Print Receipt</Button> */}

                    {/* {transaction.paymentDetails && transaction.paymentDetails.data.status == 'successful' ? <Button variant="outlined" onClick={handlePrintReceipt} type="submit">Print Receipt</Button> : <Button variant="outlined" onClick={handleGenerateReceipt} type="submit">Generate Receipt</Button>} */}
                    {/* <Button onClick={props.reprocessPayment} type="submit">Reprocess Payment</Button> */}
                    {/* {
                        transaction?.status?.toLowerCase() === "pending" &&
                        <Button onClick={() => {
                            props.reversePayment && props.reversePayment();
                            closeModal();
                        }} type="submit" variant="outlined">Reverse Payment</Button>
                    }                    
                    {
                        transaction?.status?.toLowerCase() === "pending" &&
                        <Button onClick={() => {
                            props.reprocessPayment && props.reprocessPayment();
                            closeModal();
                        }} type="submit" variant="outlined">Reprocess Payment</Button>
                    } */}
                    <Button onClick={closeModal} type="submit">Done</Button>
                </DialogFooter>
            </DialogContent>}
        </Dialog>
    );
});

const formatSubaccountDetails = (details: string) => {
    switch (details) {
        case "account_number": return "Account Number";
        case "account_bank": return "Bank";
        case "transaction_charge": return "Amount"
        default: return ""
    }
}

TransactionDetails.displayName = "TransactionDetails"
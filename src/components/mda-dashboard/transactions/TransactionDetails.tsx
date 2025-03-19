
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
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { formatDate } from "@/utils/formatters/formatDate";
import { formatAmount } from "@/utils/formatters/formatAmount";
import Button from "@/components/buttons";
import { Dropdown } from "antd";
import Link from "next/link";
import { Receipt } from "lucide-react";
import type { MenuProps } from 'antd';

type TransactionDetailsPayload = {
    data: Transaction;
};

type TransactionDetailsProps = {};

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
>((_, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const [transaction, setTransaction] = useState<Transaction>();
    const [receiptBox, setReceiptBox] = useState<MenuProps["items"]>([]);

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
        if (transaction) {
            {
                transaction?.NotificationDetails?.ReceiptNumber?.length ?
                    window.open(transaction?.NotificationDetails?.ReceiptNumber, "_blank")
                    :
                    window.open(transaction?.NotificationDetails?.Receipt[0], "_blank")
            }
        }
    }

    function handlePrintReceiptWithUrl(url: string): void {
        if (url) {
            let mainUrl = `${url}`
            {
                window.open(mainUrl, "_blank")
            }
        }
    }

    useEffect(() => {
        if (transaction) {
            if (transaction?.NotificationDetails?.Receipt && transaction?.NotificationDetails?.Receipt.length) {
                let datum: any = [];
                transaction?.NotificationDetails?.Receipt.forEach((receipt, index) => {
                    datum.push({
                        key: index,
                        label: (
                            <Button variant="text" className="px-6 py-0" onClick={() => handlePrintReceiptWithUrl(receipt)} type="submit">Print {index + 1}</Button>
                            // <Dropdown
                            //     menu={{
                            //         items: [
                            //             {
                            //                 key: `${index}-1`,
                            //                 label: (
                            //                     <Button
                            //                         variant="text"
                            //                         className="px-6 py-0"
                            //                         onClick={() => handlePrintReceiptWithUrl(receipt, "csv")}
                            //                         type="submit"
                            //                     >
                            //                         Download as CSV
                            //                     </Button>
                            //                 ),
                            //             },
                            //             {
                            //                 key: `${index}-2`,
                            //                 label: (
                            //                     <Button
                            //                         variant="text"
                            //                         className="px-6 py-0"
                            //                         onClick={() => handlePrintReceiptWithUrl(receipt, "pdf")}
                            //                         type="submit"
                            //                     >
                            //                         Download as PDF
                            //                     </Button>
                            //                 ),
                            //             },
                            //         ],
                            //     }}
                            //     placement="topLeft"
                            //     getPopupContainer={(triggerNode) =>
                            //         (triggerNode.parentNode as HTMLElement) || document.body
                            //     }
                            // >
                            //     <Button
                            //         variant="text"
                            //         className="px-6 py-0"
                            //         type="submit"
                            //     >
                            //         Print {index + 1}
                            //     </Button>
                            // </Dropdown>
                        )
                        // label: (
                        //     <Button variant="text" className="px-6 py-0" onClick={() => handlePrintReceiptWithUrl(receipt)} type="submit">Print {index + 1}</Button>
                        // ),
                        // children: [
                        //     {
                        //         key: `${index}-1`,
                        //         label: (
                        //             <Button variant="text" className="px-6 py-0" onClick={() => handlePrintReceiptWithUrl(receipt)} type="submit">Download as CDS</Button>
                        //         ),
                        //         // {triggerNode => {
                        //         //     // Ensure it's returning an HTMLElement, fallback to document.body if null
                        //         //     return (triggerNode.parentNode as HTMLElement) || document.body;
                        //         // }}
                        //         popupContainer: (triggerNode: { parentNode: HTMLElement; }) => (triggerNode.parentNode as HTMLElement) || document.body,
                        //         popupClassName: "custom-popup",
                        //         popupOffset: [0, 4],
                        //     },
                        //     {
                        //         key: `${index}-2`,
                        //         label: (
                        //             <Button variant="text" className="px-6 py-0" onClick={() => handlePrintReceiptWithUrl(receipt)} type="submit">Download as PDF</Button>
                        //         ),
                        //         popupContainer: (triggerNode: { parentNode: HTMLElement; }) => (triggerNode.parentNode as HTMLElement) || document.body,
                        //         popupClassName: "custom-popup",
                        //         popupOffset: [0, 4]
                        //     }
                        // ]
                    })
                })
                setReceiptBox(datum);
            }
        }
    }, [transaction])

    return (
        <Dialog open={isVisible} onOpenChange={setIsVisible}>
            {transaction && <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-scroll no-scrollbar">
                <DialogHeader>
                    <DialogTitle>Transaction Info</DialogTitle>
                    <DialogDescription>Full details summary</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <DetailItem data={{
                        title: "Payer Name",
                        value: transaction.PayerName
                    }} />
                    <DetailItem data={{
                        title: "Agency Name",
                        value: transaction.AgencyName ? transaction.AgencyName : transaction?.Webguid?.length ? transaction?.Webguid[0]?.AgencyName : ""
                    }} />
                    <DetailItem data={{
                        title: "Amount Paid",
                        value: formatAmount(transaction.amountPaid)
                    }} />
                    <DetailItem data={{
                        title: "Revenue Name",
                        value: transaction.RevName ? transaction.RevName : transaction?.Webguid?.length ? transaction?.Webguid[0]?.RevName : ""
                    }} />
                    {/* <DetailItem data={{
                        title: "Revenue Code",
                        value: transaction.RevenueCode
                    }} /> */}
                    <DetailItem data={{
                        title: "Payment Reference",
                        value: transaction.paymentRef
                    }} />
                    <DetailItem data={{
                        title: "Transaction Date",
                        value: formatDate(transaction.createdAt)
                    }} />
                </div>

                {transaction.paymentDetails && <div className="flex flex-col">
                    <p className="font-semibold text-black">Payment Info</p>
                    <div className="grid gap-4 py-4">
                        <DetailItem data={{
                            title: "Currency",
                            value: transaction.paymentDetails.data.currency
                        }} />
                        <DetailItem data={{
                            title: "Payment Method",
                            value: transaction.paymentDetails.data.auth_model
                        }} />
                        <DetailItem data={{
                            title: "Channel Reference",
                            value: transaction.paymentDetails.data.flw_ref
                        }} />
                        <DetailItem data={{
                            title: "Revenue Code",
                            value: transaction.RevenueCode
                        }} />
                        <DetailItem data={{
                            title: "Transaction Refenrence",
                            value: transaction.paymentDetails.data.tx_ref
                        }} />
                    </div>
                </div>}

                {(transaction.paymentDetails && transaction.paymentDetails.data.card) && <div className="flex flex-col">
                    <p className="font-semibold text-black">Card Info</p>
                    <div className="grid gap-4 py-4">
                        <DetailItem data={{
                            title: "First 6 Digits",
                            value: transaction.paymentDetails.data.card.first_6digits
                        }} />
                        <DetailItem data={{
                            title: "Last 6 Digits",
                            value: transaction.paymentDetails.data.card.last_4digits
                        }} />
                        <DetailItem data={{
                            title: "Country",
                            value: transaction.paymentDetails.data.card.country
                        }} />
                        <DetailItem data={{
                            title: "Card Type",
                            value: transaction.paymentDetails.data.card.type
                        }} />
                    </div>
                </div>}

                {transaction.paymentDetails && <div className="flex flex-col">
                    <p className="font-semibold text-black">Customer Info</p>
                    <div className="grid gap-4 py-4">
                        <DetailItem data={{
                            title: "Name",
                            value: transaction.paymentDetails.data.customer.name
                        }} />
                        <DetailItem data={{
                            title: "Email",
                            value: transaction.paymentDetails.data.customer.email
                        }} />
                        <DetailItem data={{
                            title: "Phone Number",
                            value: transaction.paymentDetails.data.customer.phone_number
                        }} />
                    </div>
                </div>}

                {transaction.paymentDetails && <div className="flex flex-col">
                    <p className="font-semibold text-black">Customer Info</p>
                    <div className="grid gap-4 py-4">
                        <DetailItem data={{
                            title: "Name",
                            value: transaction.paymentDetails.data.customer.name
                        }} />
                        <DetailItem data={{
                            title: "Email",
                            value: transaction.paymentDetails.data.customer.email
                        }} />
                        <DetailItem data={{
                            title: "Phone Number",
                            value: transaction.paymentDetails.data.customer.phone_number
                        }} />
                    </div>
                </div>}

                {transaction.subaccounts && <div className="flex flex-col">
                    <p className="font-semibold text-black">Settlements</p>
                    <div className="grid gap-4 py-4">
                        {transaction.subaccounts.map((account) => {
                            return <div key={account.id} className="flex flex-col gap-2 border-b pb-8">
                                <DetailItem data={{
                                    title: "Account Number",
                                    value: account.account_number
                                }} />
                                <DetailItem data={{
                                    title: "Sort Code",
                                    value: account.account_bank
                                }} />
                                <DetailItem data={{
                                    title: "Amount",
                                    value: formatAmount(account.transaction_charge)
                                }} />
                            </div>
                        })}
                    </div>
                </div>}
                <DialogFooter className="gap-4">
                    {
                        transaction?.NotificationDetails?.ReceiptNumber?.length ?
                            <Button variant="outlined" onClick={handlePrintReceipt} type="submit">Print Receipt</Button>
                            :
                            transaction?.NotificationDetails?.Receipt?.length ?
                                <>
                                    <Dropdown
                                        menu={{
                                            items: receiptBox,
                                        }}
                                        placement="bottom"
                                        getPopupContainer={triggerNode => {
                                            // Ensure it's returning an HTMLElement, fallback to document.body if null
                                            return (triggerNode.parentNode as HTMLElement) || document.body;
                                        }}
                                    >
                                        <div>
                                            <Button variant="outlined" type="submit">Print Receipt</Button>
                                        </div>
                                    </Dropdown>
                                    {/* <Button variant="outlined" onClick={() => handlePrintMultipleReceipt(0)} type="submit">Print First Receipt</Button>
                                <Button variant="outlined" onClick={() => handlePrintMultipleReceipt(1)} type="submit">Print Second Receipt</Button> */}
                                </>
                                : ""
                    }

                    {/* <Button variant="outlined" onClick={handlePrintReceipt} type="submit">Print Receipt</Button> */}
                    {/* {transaction.paymentDetails && transaction.paymentDetails.data.status == 'successful' ? <Button variant="outlined" onClick={handlePrintReceipt} type="submit">Print Receipt</Button> : <Button variant="outlined" onClick={handleGenerateReceipt} type="submit">Generate Receipt</Button>} */}
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
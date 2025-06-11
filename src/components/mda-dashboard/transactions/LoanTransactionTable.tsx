import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import { TransactionDetails, TransactionDetailsRef } from "./WalleTransDetails";
import { GlobalActionContext } from "@/context/GlobalActionContext";
import { convertDateToFormat, convertDateToSecondFormat, convertToDate } from "@/utils/data/getDefaultDate";
import { formatAmount } from "@/utils/formatters/formatAmount";
import { IoFilter } from "react-icons/io5";
import { LoadingOutlined } from '@ant-design/icons';

import { Collapse, Dropdown, MenuProps, Modal, Radio, RadioChangeEvent, Select, Space, Spin } from "antd";

import dayjs from "dayjs";
import { useGetLoanRequests } from "@/utils/apiHooks/agents/useGetLoanRequests";
import { formatDateWithoutTime } from "@/utils/formatters/formatDate";
import Button from "@/components/buttons";
import { useCancelLoanRequests } from "@/utils/apiHooks/agents/useCancelLoan";
import { LoadingModal } from "@/components/states/LoadingModal";
import Loader from "@/components/layouts/loader";
import { useRepayLoanRequests } from "@/utils/apiHooks/agents/useRepayLoan";
import { useRepayHalfLoanRequests } from "@/utils/apiHooks/agents/useLoanRepayPartPayment";
import LoanPartPaymentModal from "@/components/agents/loanPartPayment";


type TransactionTableProps = {
    walletId?: string;
};

export const LoanRequestTable = (props: TransactionTableProps) => {

    const { isLoading, error, data, getAllRequests } = useGetLoanRequests();
    const { error: cancelLoanError, data: cancelLoanData, cancelLoanRequest } = useCancelLoanRequests();

    const { error: repayLoanError, data: repayLoanData, repayLoanRequest } = useRepayLoanRequests();
    const { error: repayHalfLoanError, data: repayHalfLoanData, repayHalfLoanRequest } = useRepayHalfLoanRequests();


    const [page, setPage] = useState<number>(1);
    const [count, setCount] = useState<number>(1);
    const [filterEnabled, setFilterEnabled] = useState(false);
    const transactionDetailsRef = useRef<TransactionDetailsRef>(null);

    const [currentSelectedTransaction, setCurrentSelectedTransaction] = useState<any>({
        _id: ""
    });
    const { showSnackBar } = useContext(GlobalActionContext);
    const [filteredTransactions, setFilteredTransactions] = useState<any>([]);
    const [totalTransactions, setTotalTransactions] = useState<any>([]);
    const [loadPage, setLoadPage] = useState<boolean>(false);
    const [loadHistory, setLoadHistory] = useState<boolean>(false);
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [halfPaymentModalDisplay, setHalfPaymentModalDisplay] = useState<boolean>(false);


    useEffect(() => {
        getAllRequests({
            status: statusFilter
        });
        setLoadHistory(true);
    }, [statusFilter])

    useEffect(() => {
        if (data?.fetched) {
            setLoadHistory(false);
            setFilteredTransactions(data.loanRequests);
            setTotalTransactions(data.loanRequests);
        }
    }, [data])


    useEffect(() => {
        if (error) {
            showSnackBar({
                severity: 'error',
                message: error
            })
            setLoadHistory(false);
        }
    }, [error])

    const handleLoanFilter = (key: string) => {
        let filterTable = [];
        if (key === 'all') {
            filterTable = totalTransactions;
        } else {
            totalTransactions.filter((transaction: any) => {
                if (transaction.status.toLowerCase() === key) {
                    filterTable.push(transaction);
                }
            })
        }
        setFilteredTransactions(filterTable);
    }
    const items: MenuProps['items'] = [
        {
            key: 'all',
            label: <Button className="bg-transparent py-3 h-max text-black px-6" onClick={() => handleLoanFilter('all')}>All</Button>,
        },
        {
            key: 'active',
            label: <Button className="bg-transparent py-3 h-max text-black px-6" onClick={() => handleLoanFilter('active')}>Active</Button>,
        },
        {
            key: 'cancelled',
            label: <Button className="bg-transparent py-3 h-max text-black px-6" onClick={() => handleLoanFilter('cancelled')}>Cancelled</Button>,
        },
        {
            key: 'pending',
            label: <Button className="bg-transparent py-3 h-max text-black px-6" onClick={() => handleLoanFilter('pending')}>Pending</Button>,
        }
    ];

    // const handleDateChange = (dates: any, dateStrings: any) => {
    //         getAllRequests({

    //         });
    //         setFilterEnabled(true);
    //     }
    // };

    // cancel loan request
    const handleLoanRequestCancellation = (loanId: string) => {
        cancelLoanRequest({
            loanId
        });
        setLoadPage(true);
    }

    const handleCompleteLoanRequestPayment = (loanId: string) => {
        repayLoanRequest({
            loanId
        });
        setLoadPage(true);
    }

    const handleHalfLoanRequestPayment = (loanId: string) => {
        repayHalfLoanRequest({
            loanId,
            amount: 0
        });
        setLoadPage(true);
    }


    useEffect(() => {
        if (cancelLoanData?.fetched) {
            showSnackBar({
                severity: 'success',
                message: 'Transaction cancelled successfully'
            })
            setLoadPage(false);
            window.location.reload();
        }
    }, [cancelLoanData])

    useEffect(() => {
        if (repayHalfLoanData?.fetched) {
            showSnackBar({
                severity: 'success',
                message: 'Amount repaid successfully'
            })
            setLoadPage(false);
            window.location.reload();
        }
    }, [repayHalfLoanData])

    useEffect(() => {
        if (repayLoanData?.fetched) {
            showSnackBar({
                severity: 'success',
                message: 'Float liquidated successfully'
            })
            setLoadPage(false);
            window.location.reload();
        }
    }, [repayLoanData])


    useEffect(() => {
        if (cancelLoanError) {
            showSnackBar({
                severity: 'error',
                message: cancelLoanError
            })
            setLoadPage(false);
        }
    }, [cancelLoanError])

    useEffect(() => {
        if (repayHalfLoanError) {
            showSnackBar({
                severity: 'error',
                message: repayHalfLoanError
            })
            setLoadPage(false);
        }
    }, [repayHalfLoanError])
    useEffect(() => {
        if (repayLoanError) {
            showSnackBar({
                severity: 'error',
                message: repayLoanError
            })
            setLoadPage(false);
        }
    }, [repayLoanError])

    const toggleHalfLoanPaymentModal = () => {
        setHalfPaymentModalDisplay(!halfPaymentModalDisplay);
    }

    return (
        <Spin spinning={loadPage} indicator={<LoadingOutlined spin />}>
            <div className="flex flex-col gap-4 pt-1 pb-8 px-4">
                {/* <TransactionDetails ref={transactionDetailsRef} reprocessPayment={handleReprocessPayment} reversePayment={handleReversePayment} /> */}
                <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-0 justify-end">
                    <div className="py-3 px-5 border-2 border-[#EFEFEF] w-max flex items-center border-solid gap-5 cursor-pointer">
                        <Dropdown
                            menu={{ items }}
                            placement="bottomLeft"
                        >
                            <Space>
                                Transaction Status: <IoFilter className="text-2xl" />
                            </Space>
                        </Dropdown>
                    </div>
                </div>
                {
                    loadHistory ?
                        <Loader />
                        :
                        <div className="">
                            <div className="hidden md:block">
                                <Table>
                                    <TableHeader className="bg-primary rounded-xl">
                                        <TableRow>
                                            <TableHead className="font-black text-white rounded-tl-xl">Date</TableHead>
                                            <TableHead className="font-black text-white">Float Amount</TableHead>
                                            <TableHead className="font-black text-white">Interest</TableHead>
                                            <TableHead className="font-black text-white">Repayment Amount</TableHead>
                                            <TableHead className="font-black text-white">Amount to pay</TableHead>
                                            <TableHead className="font-black text-white">End Date</TableHead>
                                            <TableHead className="font-black text-white">Status</TableHead>
                                            <TableHead className="font-black text-white rounded-tr-xl">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    {
                                        filteredTransactions.map((item: any, index: any) => (
                                            <>
                                                <TableBody onClick={() => {
                                                    setCurrentSelectedTransaction(item);
                                                    // showTransactionDetails(item);
                                                }} key={index} className="bg-[#FAFAFA] mb-5 rounded-2xl cursor-pointer">
                                                    <TableRow>
                                                        <TableCell className="text-left">{formatDateWithoutTime(item.createdAt)}</TableCell>
                                                        <TableCell className="text-left">{formatAmount(item?.loanAmount)}</TableCell>
                                                        <TableCell className="text-left">{formatAmount(item?.interestAmount)}</TableCell>
                                                        <TableCell className="text-left">{formatAmount(item?.repaymentAmount)}</TableCell>
                                                        <TableCell className="text-left">{formatAmount(+item?.repaymentAmount - +item?.amountPaid)}</TableCell>
                                                        <TableCell className="text-left">{formatDateWithoutTime(item?.endDate)}</TableCell>
                                                        {/* <TableCell>
                                                            <p className={`py-3 px-4 w-max ${item.status === "active" ? "bg-blue-200" : item.status === "pending" ? "bg-yellow-100" : "bg-red-100"} rounded-lg text-left`}>{item.status}</p>
                                                        </TableCell> */}
                                                        <TableCell>
                                                            <p className={`py-3 px-4 w-max ${item.status === "completed" ? 'bg-[#C9F2F0]' : item.status === "active" ? "bg-blue-200" : item.status === "pending" ? "bg-yellow-100" : "bg-red-100"} rounded-lg text-left`}>{item.status}</p>
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                item.status === 'active' ?
                                                                    <div className="flex items-center gap-4">
                                                                        <Button onClick={() => handleCompleteLoanRequestPayment(item._id)} className="text-xs w-max block py-3 h-max px-5 border-solid border-primary border-2 bg-transparent text-primary font-black text-sm">Repay Full Float</Button>
                                                                        <Button onClick={toggleHalfLoanPaymentModal} className="text-xs w-max block py-3 h-max px-5 border-solid border-primary border-2 bg-transparent text-primary font-black text-sm">Repay Partially</Button>
                                                                    </div>
                                                                    :
                                                                    item.status === 'pending' ?
                                                                        <Button onClick={() => handleLoanRequestCancellation(item._id)} className="text-xs w-max block py-3 h-max px-5 border-solid border-primary border-2 bg-transparent text-primary font-black text-sm">Cancel Loan</Button>
                                                                        : ''
                                                            }
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </>
                                        ))
                                    }
                                </Table>
                            </div>
                            <div className="block md:hidden">
                                <Collapse defaultActiveKey={['0']}>
                                    {
                                        filteredTransactions.map((item: any, index: any) => (
                                            <Collapse.Panel header={`${formatAmount(item?.loanAmount)} ${item.type} transaction on ${formatDateWithoutTime(item.createdAt)}`} key={index}>
                                                <ul>
                                                    <li className="flex justify-between items-center mb-2">
                                                        <p className="text-sm">Date:</p>
                                                        <p className="text-sm">{formatDateWithoutTime(item.createdAt)}</p>
                                                    </li>
                                                    <li className="flex justify-between items-center mb-2">
                                                        <p className="text-sm">Category:</p>
                                                        <p className="text-sm">{item.category}</p>
                                                    </li>
                                                    <li className="flex justify-between items-center mb-2">
                                                        <p className="text-sm">Amount:</p>
                                                        <p className="text-sm">{formatAmount(item?.loanAmount)}</p>
                                                    </li>
                                                    <li className="flex justify-between items-center mb-2">
                                                        <p className="text-sm">Status:</p>
                                                        <p className={`py-3 px-4 text-sm w-max ${item.status === "success" ? "bg-blue-200" : item.status === "pending" ? "bg-yellow-100" : "bg-red-100"} rounded-lg text-center`}>{item.status}</p>
                                                    </li>
                                                    {/* <li className="flex justify-between items-center mb-2">
                                                    <p className="text-sm">Type:</p>
                                                    <p className={`py-3 px-4 text-sm w-max ${item.type === "CREDIT" ? "bg-[#007C00] text-white" : "bg-red-600 text-white"} rounded-lg text-center`}>{item.type}</p>
                                                </li> */}
                                                </ul>
                                                <Button onClick={() => {
                                                    setCurrentSelectedTransaction(item);
                                                    // showTransactionDetails(item)
                                                }}
                                                    className="w-max py-3 h-max px-5 border-solid border-primary border-2 bg-transparent text-primary font-black text-sm">View Details</Button>
                                            </Collapse.Panel>
                                        ))
                                    }
                                </Collapse>
                            </div>
                            <div className="flex justify-center mt-10">
                                {/* <TablePagination
                                breakLabel="..."
                                nextLabel=">"
                                onPageChange={onPageChange}
                                pageRangeDisplayed={5}
                                currentPage={page - 1}
                                pageCount={Math.max(0, count / 20)}
                                className="flex gap-4"
                                nextClassName="text-gray-500"
                                previousClassName="text-gray-500"
                                pageClassName="flex w-8 h-7 bg-white justify-center items-center text-sm text-gray-500 rounded-sm outline outline-2 outline-gray-100 text-center"
                                activeClassName="!bg-primary text-white !outline-none"
                                previousLabel="<"
                                renderOnZeroPageCount={null}
                            /> */}
                            </div>
                            <div className="h-20"></div>
                            <LoanPartPaymentModal openModal={halfPaymentModalDisplay} closeAction={toggleHalfLoanPaymentModal} loanId={currentSelectedTransaction._id} />
                        </div>
                }
            </div>
        </Spin>
    );
};


function capitalizeFirstLetter(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}
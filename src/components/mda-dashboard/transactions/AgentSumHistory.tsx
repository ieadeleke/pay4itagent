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
import { CalendarIcon, DownloadIcon, Key } from "lucide-react";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import { Transaction } from "@/models/transactions";
import { TransactionDetails, TransactionDetailsRef } from "./AgentTransDetail";
import { useDownloadReport } from "@/utils/apiHooks/transactions/useDownloadReport";
import { GlobalActionContext } from "@/context/GlobalActionContext";
import { convertDateToFormat, convertDateToSecondFormat, convertToDate } from "@/utils/data/getDefaultDate";
import { TransactionStatus, TransactionStatusChip } from "./TransactionStatusChip";
import { formatAmount } from "@/utils/formatters/formatAmount";
import { formatDate, formatDateShort, formatDateWithoutTime } from "@/utils/formatters/formatDate";
import { CalendarRange, DateRange } from "@/components/calendar/CalendarRange";
import { IconButton } from "@/components/buttons/IconButton";
import Loading from "@/components/states/Loading";
import Button from "@/components/buttons";
import Error from "@/components/states/Error";
import { LoadingModal } from "@/components/states/LoadingModal";
import { TablePagination } from "@/components/pagination/TablePagination";
import EmptyResult from "@/components/layouts/empty";
import { FaAngleDown } from "react-icons/fa6";
import { Collapse, Dropdown, MenuProps, Modal, Radio, RadioChangeEvent, Select, Space, Spin } from "antd";
import { DatePicker, DatePickerInput } from "@carbon/react";
import { IoFilter } from "react-icons/io5";
import { FiDownload } from "react-icons/fi";
import { LoadingOutlined } from '@ant-design/icons';

import dayjs from "dayjs";
import { useFetchTranscations } from "@/utils/apiHooks/transactions/useFetchTransactions";
import { useFetchWalletTranscations } from "@/utils/apiHooks/transactions/useFetchWalletTransactions";
import { useGetAgentsTransactionHistory } from "@/utils/apiHooks/agents/useGetAgentsTransactionHistory";
import { useDownloadAgentReport } from "@/utils/apiHooks/transactions/useDownloadConsolidated";
import { useReversePayment } from "@/utils/apiHooks/agents/useReversePayment";
import { useReprocessPayment } from "@/utils/apiHooks/agents/useReprocessPayment";


type TransactionTabType = {
    PayerName?: string;
    PaymentChannel?: string
    createdAt: string
    amount: number
    amountPaid?: string
    balance_after: number
    balance_before: number
    category: string
    currency: string
    description: string
    reference: string
    status: string
    total: number
    AgencyName?: string
    RevName?: string
    type: string
    walletId: string
    Webguid?: {
        RevName: string
    }[]
    Status?: string
    TotalDue?: string
    mobile?: string,
    agent?: {
        firstName?: string,
        lastName?: string,
        userName?: string
    }
}

type TransactionTableProps = {
    walletId?: string;
    name: string;
    transactions: TransactionTabType[];
    isLoading?: boolean;
    error?: string | null;
    fetchData?: () => void,
    onPageChange?: (value: {
        selected: number;
    }) => void,
    page: number,
    count: number,
    loadHistory?: boolean
    dateRange?: {
        startDate: string,
        endDate: string
    },
    typeEnum?: any
    categoryEnum?: any
    onDateApplied?: (date: DateRange) => void
};

export const TransactionTable = (props: TransactionTableProps) => {
    const { transactions, dateRange } = props;
    const { isLoading: isDownloadReportLoading, error: downloadReportError, downloadReport, data: subAgentDownloadData } = useDownloadAgentReport();
    const { isLoading: loadingTransactionHistory, error: transactionHistoryError, data: walletData, getAgentTransactionHistory: fetchTransactionsByDateRange } = useGetAgentsTransactionHistory();

    const { isLoading, error, data, getAgentTransactionHistory } = useGetAgentsTransactionHistory();

    const { isLoading: loadingReversePaymentError, error: reversePaymentError, data: reversePaymentData, reReversePayment } = useReversePayment();
    const { isLoading: loadingReprocess, error: reprocessPaymentError, data: reprocessPaymentData, reProcessPayment } = useReprocessPayment();

    const [isDateModalOpen, setIsDateModalOpen] = useState(false);
    const [downloadFormat, setDownloadFormat] = useState("csv");
    const [filterEnabled, setFilterEnabled] = useState(false);
    const [pageCount, setPage] = useState<number>(0);
    const [loadPage, setLoadPage] = useState<boolean>(false);
    const [categoryEnum, setCategoryEnum] = useState({
        key: "", label: ""
    });
    const [typeEnum, setTypeEnum] = useState({
        key: "", label: ""
    });
    const transactionDetailsRef = useRef<TransactionDetailsRef>(null);
    const [date, setDate] = useState<DateRange>(dateRange ? {
        from: convertToDate(dateRange.startDate),
        to: convertToDate(dateRange.endDate),
    } : {
        from: new Date(),
        to: new Date(),
    });

    const [currentSelectedTransaction, setCurrentSelectedTransaction] = useState<any>({
        _id: "",
        paymentRef: ""
    });
    const { showSnackBar } = useContext(GlobalActionContext);

    const [currPage, setCurrPage] = useState(0);
    const [filteredTransactions, setFilteredTransactions] = useState<TransactionTabType[]>([]);
    const [transactionFilter, setTransactionFilter] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [selectedPerPage, setSelectedPerPage] = useState(20);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [defaultDate, setDefaultDate] = useState(dateRange ? [dateRange.startDate, dateRange.endDate] : [new Date(), new Date()]);

    useEffect(() => {
        if (walletData) {
            setFilteredTransactions(walletData.Transaction);
        }
    }, [walletData])

    useEffect(() => {
        if (props.page) {
            console.log(props.page)
            setCurrPage(props.page - 1);
        }
    }, [props.page])

    useEffect(() => {
        if (isLoading || loadingReversePaymentError || loadingReprocess) {
            setLoadPage(true);
        } else {
            setLoadPage(false);
        }
    }, [isLoading, loadingReversePaymentError, loadingReprocess])

    useEffect(() => {
        if (reprocessPaymentError) {
            showSnackBar({
                severity: 'error',
                message: reprocessPaymentError
            })
        }
    }, [reprocessPaymentError])


    useEffect(() => {
        if (reversePaymentData?.Wallet) {
            showSnackBar({
                severity: 'success',
                message: "Payment reversed successfully"
            })
            window.location.reload();
            // setFilteredTransactions(reversePaymentData.Transaction);
        }
    }, [reversePaymentData]);
    useEffect(() => {
        if (reprocessPaymentData?.data) {
            showSnackBar({
                severity: 'success',
                message: "Payment reprocessed successfully"
            })
            window.location.reload();
        }
    }, [reprocessPaymentData]);

    useEffect(() => {
        if (reversePaymentError) {
            showSnackBar({
                severity: 'error',
                message: reversePaymentError
            })
        }
    }, [reversePaymentError])

    const handleReversePayment = () => {
        reReversePayment({
            paymentRef: currentSelectedTransaction?.paymentRef
        });
    }

    const handleReprocessPayment = () => {
        reProcessPayment({
            paymentRef: currentSelectedTransaction?.paymentRef
        });
    }

    const formatDateRange = useMemo(() => {
        if (!date) return "Tap to filter by date range";
        const start = moment(date.from).format("MMM D, YYYY");
        const end = moment(date.to).format("MMM D, YYYY");
        return `From ${start} - ${end}`;
    }, [JSON.stringify(date)]);

    useEffect(() => {
        if (props.dateRange?.startDate && props.dateRange?.endDate) {
            setDefaultDate([dayjs(props.dateRange.startDate).format("YYYY-MM-DD"), dayjs(props.dateRange.endDate).format("YYYY-MM-DD")]);
        }
    }, [props.dateRange])

    useEffect(() => {
        setFilteredTransactions(transactions);
    }, [transactions])

    useEffect(() => {
        if (data?.Transaction && filterEnabled) {
            setPage(data.count);
            setFilteredTransactions(data?.Transaction);
        }
    }, [data])

    useEffect(() => {
        // props.onDateApplied?.(date)
    }, [date])

    function showTransactionDetails(transaction: TransactionTabType) {
        setCurrentSelectedTransaction(transaction);
        transactionDetailsRef.current?.open?.({
            data: transaction
        })
    }

    useEffect(() => {
        if (subAgentDownloadData) {
            // Create a blob from the response
            // Create a blob from the response
            const blob = downloadFormat === "csv" ? new Blob([subAgentDownloadData], { type: 'text/csv' }) : new Blob([subAgentDownloadData], { type: 'application/pdf' });

            // Create a download link and trigger the download
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = downloadFormat === "csv" ? 'account_transactions.csv' : 'account_transactions.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            if (typeof subAgentDownloadData == 'string') {
                showSnackBar({
                    severity: 'error',
                    message: "Failed to download report. Please try again"
                })
                // alert("Unprocessable entity")
            }
        }
    }, [subAgentDownloadData])

    useEffect(() => {
        if (transactionHistoryError) {
            showSnackBar({
                severity: 'error',
                message: transactionHistoryError
            })
        }
    }, [transactionHistoryError])


    useEffect(() => {
        if (transactionHistoryError) {
            showSnackBar({
                severity: 'error',
                message: transactionHistoryError
            })
        }
    }, [transactionHistoryError])


    useEffect(() => {
        if (transactionHistoryError) {
            showSnackBar({
                severity: 'error',
                message: transactionHistoryError
            })
        }
    }, [transactionHistoryError])

    useEffect(() => {
        if (downloadReportError) {
            showSnackBar({
                severity: 'error',
                message: downloadReportError
            })
        }
    }, [downloadReportError])

    function handleDownloadReport(format: string) {
        const dateRange = ({
            startDate: convertDateToSecondFormat(date.from),
            endDate: convertDateToSecondFormat(date.to ?? new Date()),
            format,
        });
        downloadReport(dateRange)
    }

    const onChangeStatusView = (e: string) => {
        // let val = e.target.value;
        let val = e;
        let arr = [] as TransactionTabType[];
        if (val === "all") {
            arr = transactions;
        } else {
            transactions.filter(transaction => {
                if (transaction.status === val) {
                    arr.push(transaction);
                }
            })
        }
        setTransactionFilter(val);
        setFilteredTransactions(arr);
    };
    const onChangeTransactionTypeView = (e: string) => {
        // let val = e.target.value;
        let val = e;
        let arr = [] as TransactionTabType[];
        if (val === "all") {
            arr = transactions;
        } else {
            transactions.filter(transaction => {
                if (transaction.type.toUpperCase() === val.toUpperCase()) {
                    arr.push(transaction);
                }
            })
        }
        setTransactionFilter(val);
        setFilteredTransactions(arr);
    };
    const onChangeTransactionDateView = (e: string) => {
        // let val = e.target.value;
        let val = e;
        let arr = [] as TransactionTabType[];
        if (val === "all") {
            arr = transactions;
        } else {
            transactions.filter(transaction => {
                if (transaction.type.toUpperCase() === val.toUpperCase()) {
                    arr.push(transaction);
                }
            })
        }
        setTransactionFilter(val);
        setFilteredTransactions(arr);
    };

    // useEffect(() => {
    //     if(filterReport) {
    //         setFilteredTransactions(filterReport);
    //     }
    // },[filterReport])

    // useEffect(() => {
    //     if(filterReportError) {
    //         showSnackBar({
    //             message: filterReportError,
    //             severity: 'error'
    //         })
    //     }
    // })

    const items: MenuProps['items'] = [
        categoryEnum, typeEnum
    ];
    const subtractDays = (date: Date, days: number): Date => {
        const result = new Date(date); // Create a copy of the date
        result.setDate(date.getDate() - days); // Subtract the days
        return result;
    };
    const menuProps = {
        items,
        // onClick: handleMenuClick,
    };

    const FetchTransactionByDateRange = (yesterday: Date | string, today: Date | string) => {
        getAgentTransactionHistory({
            page: String(props.page),
            startDate: typeof yesterday === "string" ? yesterday : convertDateToSecondFormat(yesterday),
            endDate: typeof today === "string" ? today : convertDateToSecondFormat(today),
        })
    }

    const handleDateChange = (dates: any, dateStrings: any) => {
        if (dates && dates.length === 2) {
            // Convert the start and end dates to dayjs
            const startDate = dayjs(dates[0]).format('YYYY-MM-DD');
            const endDate = dayjs(dates[1]).format('YYYY-MM-DD');

            // You can store these as a range in your state or handle them further
            getAgentTransactionHistory({
                startDate,
                endDate,
                page: String(currPage)
            });
            setDate({
                from: dayjs(dates[0]).toDate(),
                to: dayjs(dates[1]).toDate()
            });
            setFilterEnabled(true);
        }
    };

    const downloadOptionMenu = [
        {
            key: `1`,
            label: (
                <Button
                    variant="text"
                    className="px-6 py-0"
                    onClick={() => {
                        setDownloadFormat("csv")
                        handleDownloadReport("csv")
                    }}
                    type="submit"
                >
                    Download as CSV
                </Button>
            ),
        },
        {
            key: `2`,
            label: (
                <Button
                    variant="text"
                    className="px-6 py-0"
                    onClick={() => {
                        setDownloadFormat("pdf")
                        handleDownloadReport("pdf")
                    }}
                    type="submit"
                >
                    Download as PDF
                </Button>
            ),
        }]

    const onPageChange = (e: any) => {
        // onPageChange
        // if (props.onPageChange) props.onPageChange(e);
        setCurrPage(e?.selected);
        getAgentTransactionHistory({
            startDate: dayjs(date.from).format('YYYY-MM-DD'),
            endDate: dayjs(date.to).format('YYYY-MM-DD'),
            page: e?.selected + 1,
            perPage: selectedPerPage
        });
        setFilterEnabled(true);
    }

    const pageOptions = Array.from({ length: filterEnabled ? pageCount : props.count }, (_, index) => index + 1);

    const handlePerPageChange = (e: number) => {
        console.log(e)
        getAgentTransactionHistory({
            startDate: dayjs(date.from).format('YYYY-MM-DD'),
            endDate: dayjs(date.to).format('YYYY-MM-DD'),
            page: String(currPage),
            perPage: e
        });
        setFilterEnabled(true);
    }

    return (
        <Spin spinning={loadPage} indicator={<LoadingOutlined spin />}>
            <div className="flex flex-col gap-4 py-8 px-4">
                <TransactionDetails ref={transactionDetailsRef} reprocessPayment={handleReprocessPayment} reversePayment={handleReversePayment} />
                <LoadingModal isVisible={isDownloadReportLoading} />
                <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-0 justify-between">
                    <h1 className="text-xl font-bold">{props.name}</h1>
                    {
                        props.loadHistory ? <Spin indicator={<LoadingOutlined spin />} /> : ""
                    }
                    <div className="flex flex-col md:flex-row gap-5 md:items-end">
                        {/* <div className="py-3 px-5 border-2 border-[#EFEFEF] w-max flex items-center border-solid gap-5 cursor-pointer">
                            <Dropdown
                                menu={menuProps}
                                placement="bottomLeft"
                            >
                                <Space>
                                    Filter: <IoFilter className="text-2xl" />
                                </Space>
                            </Dropdown>
                        </div> */}
                        <div className="flex items-end gap-5">
                            <div>
                                <Select onChange={handlePerPageChange} className="py-4 border-2 border-black border-solid">
                                    {pageOptions.map((page) => (
                                        <option key={page} value={page}>
                                            {page}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                            <div>
                                <DatePicker datePickerType="range" onChange={handleDateChange} value={defaultDate}>
                                    <DatePickerInput id="date-picker-input-id-start" placeholder="mm/dd/yyyy" labelText="Start date" size="lg" />
                                    <DatePickerInput id="date-picker-input-id-finish" placeholder="mm/dd/yyyy" labelText="End date" size="lg" />
                                </DatePicker>
                            </div>
                            <div>
                                {/* <Dropdown
                                    menu={{
                                        items: downloadOptionMenu,
                                    }}
                                    placement="bottom"
                                > */}
                                <div
                                    onClick={() => {
                                        setDownloadFormat("csv")
                                        handleDownloadReport("csv")
                                    }} className="cursor-pointer bg-primary w-12 h-12 rounded-full flex items-center justify-center">
                                    <FiDownload className="text-white text-2xl" />
                                </div>
                                {/* </Dropdown> */}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="">
                    <div className="hidden md:block">
                        <Table>
                            <TableHeader className="bg-primary rounded-xl">
                                <TableRow>
                                    <TableHead className="font-black text-white rounded-tl-xl">Date</TableHead>
                                    <TableHead className="font-black text-white">Amount Paid</TableHead>
                                    <TableHead className="font-black text-white">Revenue Name</TableHead>
                                    <TableHead className="font-black text-white">Payer Name</TableHead>
                                    <TableHead className="font-black text-white">Payment Channel</TableHead>
                                    <TableHead className="font-black text-white">Agent Name</TableHead>
                                    <TableHead className="font-black text-white">Agent Username</TableHead>
                                    <TableHead className="font-black text-white">Status</TableHead>
                                    <TableHead className="font-black text-white rounded-tr-xl">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            {
                                filteredTransactions.map((item, index) => (
                                    <>
                                        <TableBody onClick={() => {
                                            showTransactionDetails(item)
                                        }} key={index} className="bg-[#FAFAFA] mb-5 rounded-2xl cursor-pointer">
                                            <TableRow>
                                                <TableCell className="text-left">{formatDateWithoutTime(item.createdAt)}</TableCell>
                                                <TableCell className="text-left">{item.amountPaid ? formatAmount(String(item?.amountPaid)) : ""}</TableCell>
                                                <TableCell className="text-left">{item?.Webguid?.length ? item?.Webguid[0]?.RevName : ""}</TableCell>
                                                <TableCell>
                                                    <p className="text-left">{item.PayerName}</p>
                                                </TableCell>
                                                <TableCell>
                                                    <p className="text-left">{item?.PaymentChannel}</p>
                                                </TableCell>
                                                <TableCell>
                                                    <p className="text-left">{item?.agent?.firstName} {item?.agent?.lastName}</p>
                                                </TableCell>
                                                <TableCell>
                                                    <p className="text-left">{item?.agent?.userName}</p>
                                                </TableCell>
                                                <TableCell>
                                                    <p className={`py-3 px-4 w-max ${item.Status === "Successful" ? "bg-blue-200" : item.status === "pending" ? "bg-yellow-100" : "bg-red-100"} rounded-lg text-left`}>{item.Status}</p>
                                                </TableCell>
                                                <TableCell><Button className="text-xs w-max block py-3 h-max px-5 border-solid border-primary border-2 bg-transparent text-primary font-black text-sm">View Details</Button></TableCell>
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
                                filteredTransactions.map((item, index) => (
                                    <Collapse.Panel header={`${item.amountPaid ? formatAmount(String(item?.amountPaid)) : ""} transaction on ${formatDateWithoutTime(item.createdAt)}`} key={index}>
                                        <ul>
                                            <li className="flex justify-between items-center mb-2">
                                                <p className="text-sm">Date:</p>
                                                <p className="text-sm">{formatDateWithoutTime(item.createdAt)}</p>
                                            </li>
                                            <li className="flex justify-between items-center mb-2">
                                                <p className="text-sm">Revenue Name:</p>
                                                <p className="text-sm text-right">{item.category}{item?.Webguid?.length ? item?.Webguid[0]?.RevName : ""}</p>
                                            </li>
                                            <li className="flex justify-between items-center mb-2">
                                                <p className="text-sm">Agent Full Name:</p>
                                                <p className="text-sm text-right">{item?.agent?.firstName} {item?.agent?.lastName}</p>
                                            </li>
                                            <li className="flex justify-between items-center mb-2">
                                                <p className="text-sm">Agent Username:</p>
                                                <p className="text-sm text-right">{item?.agent?.userName}</p>
                                            </li>
                                            <li className="flex justify-between items-center mb-2">
                                                <p className="text-sm">Amount Paid:</p>
                                                <p className="text-sm">{item?.amountPaid ? formatAmount(String(item?.amountPaid)) : ""}</p>
                                            </li>
                                            <li className="flex justify-between items-center mb-2">
                                                <p className="text-sm">Payer Name:</p>
                                                <p className="text-sm">{item?.PayerName}</p>
                                            </li>
                                            <li className="flex justify-between items-center mb-2">
                                                <p className="text-sm">Payment Channel:</p>
                                                <p className="text-sm">{item?.PaymentChannel}</p>
                                            </li>
                                            <li className="flex justify-between items-center mb-2">
                                                <p className="text-sm">Status:</p>
                                                <p className={`py-3 px-4 w-max ${item.Status === "Successful" ? "bg-blue-200" : item.status === "pending" ? "bg-yellow-100" : "bg-red-100"} rounded-lg text-left`}>{item.Status}</p>
                                            </li>
                                        </ul>
                                        <Button onClick={() => showTransactionDetails(item)}
                                            className="w-max py-3 h-max px-5 border-solid border-primary border-2 bg-transparent text-primary font-black text-sm">View Details</Button>
                                    </Collapse.Panel>
                                ))
                            }
                        </Collapse>
                    </div>
                    <div className="flex justify-center mt-10">
                        <TablePagination
                            breakLabel="..."
                            nextLabel=">"
                            onPageChange={(selected: any) => onPageChange(selected)}
                            pageRangeDisplayed={5}
                            currentPage={currPage}
                            pageCount={Math.max(0, (filterEnabled ? pageCount : props.count) / 20)}
                            // pageCount={1}
                            className="flex gap-4"
                            nextClassName="text-gray-500"
                            previousClassName="text-gray-500"
                            pageClassName="flex w-8 h-7 bg-white justify-center items-center text-sm text-gray-500 rounded-sm outline outline-2 outline-gray-100 text-center"
                            activeClassName="!bg-primary text-white !outline-none"
                            previousLabel="<"
                            renderOnZeroPageCount={null}
                        />
                    </div>
                    <div className="h-20"></div>
                </div>
                {props.isLoading ? <Loading /> : props.error && <Error onRetry={props.fetchData} message={props.error} />}
            </div>
        </Spin>
    );
};


function capitalizeFirstLetter(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}
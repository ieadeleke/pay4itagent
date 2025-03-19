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
import { CalendarIcon, DownloadIcon } from "lucide-react";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import { Transaction } from "@/models/transactions";
import { TransactionDetails, TransactionDetailsRef } from "./TransactionDetails";
import { LoadingOutlined } from '@ant-design/icons';
import { useDownloadReport } from "@/utils/apiHooks/transactions/useDownloadSubAgentReport";
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
import { Dropdown, MenuProps, Space, Spin, DatePicker as AntdDatePicker, Collapse } from "antd";
import { IoFilter } from "react-icons/io5";
import { DatePicker, DatePickerInput } from "@carbon/react";
import dayjs from "dayjs";
import { useFetchTotalTransactions } from "@/utils/apiHooks/agents/subagents/useFetchTotalTransactions";
import { FiDownload } from "react-icons/fi";
import { BASE_URL } from "@/utils/constants";


type TransactionTableProps = {
    walletId?: string;
    name: string;
    transactions: Transaction[];
    isLoading?: boolean;
    error?: string | null;
    fetchData?: () => void,
    onPageChange?: (value: {
        selected: number;
    }) => void,
    page: number,
    serviceCharge?: number,
    count: number,
    loadHistory?: boolean
    dateRange?: {
        startDate: string,
        endDate: string
    },
    userId: string,
    onDateApplied?: (date: DateRange) => void
};

export const TransactionTable = (props: TransactionTableProps) => {

    const { transactions, dateRange } = props;
    const { isLoading: isDownloadReportLoading, error: downloadReportError, downloadReport, data } = useDownloadReport();
    const { isLoading: isFetchLoading, error: fetchError, data: allTransactions, fetchTransactions, count: countTotalTransactions } = useFetchTotalTransactions()
    const transactionDetailsRef = useRef<TransactionDetailsRef>(null);

    const [page, setPage] = useState<number>(1);
    const [count, setCount] = useState<number>(1);
    const [filterByDate, setFilterByDate] = useState(false);
    const [downloadFormat, setDownloadFormat] = useState("csv");
    const [date, setDate] = useState<DateRange>(dateRange ? {
        from: convertToDate(dateRange.startDate),
        to: convertToDate(dateRange.endDate),
    } : {
        from: new Date(),
        to: new Date(),
    });
    const [defaultDate, setDefaultDate] = useState(dateRange ? [dateRange.startDate, dateRange.endDate] : [new Date(), new Date()]);
    const { showSnackBar } = useContext(GlobalActionContext)
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);


    useEffect(() => {
        if (props.dateRange?.startDate && props.dateRange?.endDate) {
            setDefaultDate([dayjs(props.dateRange.startDate).format("YYYY-MM-DD"), dayjs(props.dateRange.endDate).format("YYYY-MM-DD")]);
        }
    }, [props.dateRange])

    const formatDateRange = useMemo(() => {
        if (!date) return "Tap to filter by date range";
        const start = moment(date.from).format("MMM D, YYYY");
        const end = moment(date.to).format("MMM D, YYYY");
        return `From ${start} - ${end}`;
    }, [JSON.stringify(date)]);

    useEffect(() => {
        // props.onDateApplied?.(date)
    }, [date])

    function showTransactionDetails(transaction: Transaction) {
        transactionDetailsRef.current?.open?.({
            data: transaction
        })
    }

    useEffect(() => {
        if (data) {
            // Create a blob from the response
            const blob = downloadFormat === "csv" ? new Blob([data], { type: 'text/csv' }) : new Blob([data], { type: 'application/pdf' });

            // Create a download link and trigger the download
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = downloadFormat === "csv" ? 'account_transactions.csv' : 'account_transactions.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            if (typeof data == 'string') {
                alert("Unprocessable entity")
            }
        }
    }, [data])

    useEffect(() => {
        setPage(props.page);
        setCount(props.count);
        setFilteredTransactions(transactions);
    }, [transactions])

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
            userId: props?.userId ? props.userId : "",
            startDate: convertDateToSecondFormat(date.from),
            endDate: convertDateToSecondFormat(date.to ?? new Date()),
            format
        });
        // const url = `${BASE_URL}/v1/agent/transaction/DownloadReport?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;
        // window.open(url, "_blank");
        downloadReport(dateRange);
    }

    const items: MenuProps['items'] = [
        {
            key: 'status-all',
            label: 'All',
        },
        {
            key: 'status-Successful',
            label: 'Successful',
        },
        {
            key: 'status-Fail',
            label: 'Failed',
        },
        {
            key: 'status-Pending',
            label: 'Pending',
        }
        // {
        //   key: 'drop1',
        //   label: 'By Status',
        //   children: [
        //     {
        //       key: 'status-all',
        //       label: 'All',
        //     },
        //     {
        //       key: 'status-Successful',
        //       label: 'Successful',
        //     },
        //     {
        //       key: 'status-Fail',
        //       label: 'Failed',
        //     },
        //     {
        //       key: 'status-Pending',
        //       label: 'Pending',
        //     }
        //   ],
        // },
        // {
        //   key: 'drop3',
        //   label: 'Date',
        //   children: [
        //     {
        //       key: 'date-yesterday',
        //       label: 'Yesterday',
        //     },
        //     {
        //       key: 'date-week',
        //       label: 'A week ago',
        //     },
        //     {
        //       key: 'date-custom',
        //       label: 'Custom',
        //     }
        //   ],
        // },
    ];

    const onChangeStatusView = (e: string) => {
        // let val = e.target.value;
        let val = e;
        let arr = [] as Transaction[];
        if (val === "all") {
            arr = transactions;
        } else {
            transactions.filter(transaction => {
                if (transaction.Status === val) {
                    arr.push(transaction);
                }
            })
        }
        setFilteredTransactions(arr);
    };

    useEffect(() => {
        if (allTransactions && filterByDate && !isFetchLoading) {
            setFilteredTransactions(allTransactions);
        }
    }, [allTransactions])

    useEffect(() => {
        setCount(countTotalTransactions ? countTotalTransactions : 0);
    }, [countTotalTransactions])

    // useEffect(() => {
    //   if (count) {
    //     setTotalTrans(count);
    //   }
    // }, [count]);

    useEffect(() => {
        if (fetchError) {
            showSnackBar({
                message: fetchError,
                severity: 'error'
            })
        }
    }, [fetchError]);

    const FetchTransactionByDateRange = (yesterday: Date | string, today: Date | string) => {
        fetchTransactions({
            userId: props.userId,
            page: String(props.page),
            startDate: typeof yesterday === "string" ? yesterday : convertDateToSecondFormat(yesterday),
            endDate: typeof today === "string" ? today : convertDateToSecondFormat(today),
        })
        setFilterByDate(true);
    }

    const subtractDays = (date: Date, days: number): Date => {
        const result = new Date(date); // Create a copy of the date
        result.setDate(date.getDate() - days); // Subtract the days
        return result;
    };
    const handleMenuClick = (e: any) => {
        if (e.key.split("-")[0] === "status") {
            onChangeStatusView(e.key.split("-")[1]);
        } else {
            let today = new Date();
            if (e.key.split("-")[1] === "yesterday") {
                const yesterday: Date = subtractDays(today, 1);
                FetchTransactionByDateRange(yesterday, today);
                setDate({
                    ...date,
                    to: yesterday
                });
            } else if (e.key.split("-")[1] === "week") {
                const aweek: Date = subtractDays(today, 7);
                FetchTransactionByDateRange(aweek, today);
                setDate({
                    ...date,
                    to: aweek
                });
            } else {
            }
        }
    }
    const menuProps = {
        items,
        onClick: handleMenuClick,
    };

    const disableFutureDates = (current: dayjs.Dayjs) => {
        return current && current > dayjs().endOf("day");
    };

    const handleDateChange = (dates: any, dateStrings: any) => {
        if (dates && dates.length === 2) {
            // Convert the start and end dates to dayjs
            const startDate = dayjs(dates[0]).format('YYYY-MM-DD');
            const endDate = dayjs(dates[1]).format('YYYY-MM-DD');

            // You can store these as a range in your state or handle them further
            FetchTransactionByDateRange(startDate, endDate);
            setDate({
                from: dayjs(dates[0]).toDate(),
                to: dayjs(dates[1]).toDate()
            });
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

    function onPageChange(selectedItem: {
        selected: number;
    }) {
        fetchTransactions({
            userId: props.userId,
            page: String(selectedItem.selected + 1),
            startDate: convertDateToSecondFormat(date.from),
            endDate: convertDateToSecondFormat(date.to ?? new Date()),
        })
        setPage(selectedItem.selected + 1)
    }

    return (
        <Spin spinning={isFetchLoading} indicator={<LoadingOutlined spin />}>
            <div className="flex flex-col gap-4 pt-8 pb-0 px-4">
                <TransactionDetails ref={transactionDetailsRef} />
                <LoadingModal isVisible={isDownloadReportLoading} />
                <div className="flex flex-col md:flex-row md:items-end gap-5 md:gap-0 justify-between">
                    <h1 className="text-xl font-bold">{props.name}ee</h1>
                    {
                        props.loadHistory ? <Spin indicator={<LoadingOutlined spin />} /> : ""
                    }
                    <div className="flex flex-col md:flex-row gap-5 md:items-end">
                        <div className="py-3 px-5 pb-2 border-2 border-[#EFEFEF] w-max border-solid flex items-center gap-5 cursor-pointer">
                            <Dropdown
                                menu={menuProps}
                                placement="bottomLeft"
                            >
                                <Space>
                                    Filter: <IoFilter className="text-2xl" />
                                </Space>
                            </Dropdown>
                        </div>
                        <div className="flex items-end gap-5">
                            <div>
                                <div>
                                    <DatePicker datePickerType="range" onChange={handleDateChange} value={defaultDate}>
                                        <DatePickerInput id="date-picker-input-id-start" placeholder="mm/dd/yyyy" labelText={null} size="lg" />
                                        <DatePickerInput id="date-picker-input-id-finish" placeholder="mm/dd/yyyy" labelText={null} size="lg" />
                                    </DatePicker>
                                </div>
                            </div>
                            <div>
                                <Dropdown
                                    menu={{
                                        items: downloadOptionMenu,
                                    }}
                                    placement="bottom"
                                // getPopupContainer={triggerNode => {
                                //   // Ensure it's returning an HTMLElement, fallback to document.body if null
                                //   return (triggerNode.parentNode as HTMLElement) || document.body;
                                // }}
                                >
                                    <div className="cursor-pointer bg-primary w-12 h-12 rounded-full flex items-center justify-center">
                                        <FiDownload className="text-white text-2xl" />
                                    </div>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="">
                    <div className="hidden md:block">
                        <Table className="w-full">
                            <TableHeader className="bg-primary rounded-xl">
                                <TableRow>
                                    <TableHead className="font-black text-white rounded-tl-xl py-7">Transaction Date</TableHead>
                                    <TableHead className="font-black text-white">Name</TableHead>
                                    {/* <TableHead className="font-black text-white">Payment Method</TableHead> */}
                                    <TableHead className="font-black text-white">Amount</TableHead>
                                    {/* <TableHead className="font-black text-white">Agency</TableHead> */}
                                    <TableHead className="font-black text-white">Service Charge</TableHead>
                                    <TableHead className="font-black text-white">Status</TableHead>
                                    <TableHead className="font-black text-white rounded-tr-xl">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            {
                                filteredTransactions.map((item) => (
                                    <>
                                        <TableBody onClick={() => showTransactionDetails(item)} key={item.AgencyName} className="bg-[#FAFAFA] mb-5 rounded-2xl cursor-pointer">
                                            <TableRow>
                                                <TableCell>{formatDateWithoutTime(item.createdAt)}</TableCell>
                                                <TableCell>{item.PayerName}</TableCell>
                                                {/* <TableCell>{item.paymentDetails ? capitalizeFirstLetter(item.paymentDetails.data.payment_type) : "-"}</TableCell> */}
                                                <TableCell>{formatAmount(item.amountPaid)}</TableCell>
                                                {/* <TableCell>{item.AgencyName}</TableCell> */}
                                                <TableCell>{formatAmount(item?.serviceCharge ? +item?.serviceCharge : 0)}</TableCell>
                                                <TableCell>
                                                    <TransactionStatusChip status={item.Status} />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="">
                                                        <Button className="text-xs w-max py-3 h-max px-5 border-solid border-primary border-2 bg-transparent text-primary font-black text-sm">View Details</Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow >
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
                                    <Collapse.Panel header={`${formatAmount(item.amountPaid)} ${item.Status} transaction on ${formatDateWithoutTime(item.createdAt)}`} key={index}>
                                        <ul>
                                            <li className="flex justify-between items-center mb-2">
                                                <p className="text-sm">Date:</p>
                                                <p className="text-sm">{formatDateWithoutTime(item.createdAt)}</p>
                                            </li>
                                            <li className="flex justify-between items-center mb-2">
                                                <p className="text-sm">Payer Name:</p>
                                                <p className="text-sm">{item.PayerName}</p>
                                            </li>
                                            <li className="flex justify-between items-center mb-2">
                                                <p className="text-sm">Amount:</p>
                                                <p className="text-sm">{formatAmount(+item?.amountPaid)}</p>
                                            </li>
                                            <li className="flex justify-between items-center mb-2">
                                                <p className="text-sm">Service Charge:</p>
                                                <p className="text-sm">{formatAmount(item?.serviceCharge ? +item?.serviceCharge : 0)}</p>
                                            </li>
                                            <li className="flex justify-between items-center mb-2">
                                                <p className="text-sm">Status:</p>
                                                <TransactionStatusChip status={item.Status} />
                                            </li>
                                        </ul>
                                        <Button onClick={() => showTransactionDetails(item)}
                                            className="text-sm w-max py-2 h-max px-5 border-solid border-primary border-2 bg-transparent text-primary font-black text-sm">View Details</Button>
                                    </Collapse.Panel>
                                ))
                            }
                        </Collapse>
                    </div>
                    <div className="flex justify-center mt-10">
                        <TablePagination
                            breakLabel="..."
                            nextLabel=">"
                            onPageChange={onPageChange}
                            pageRangeDisplayed={5}
                            currentPage={page - 1}
                            pageCount={Math.max(0, count / 20)}
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
                </div>
                {props.isLoading ? <Loading /> : props.error && <Error onRetry={props.fetchData} message={props.error} />}
            </div >
        </Spin >
    );
};


function capitalizeFirstLetter(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}
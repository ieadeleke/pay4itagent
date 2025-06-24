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
import { AgentTransaction, Transaction } from "@/models/transactions";
import { useDownloadReport } from "@/utils/apiHooks/agents/subagents/useDownloadReport";
import { GlobalActionContext } from "@/context/GlobalActionContext";
import { convertDateToFormat, convertDateToSecondFormat, convertToDate } from "@/utils/data/getDefaultDate";
import { TransactionStatus, TransactionStatusChip } from "./TransactionStatusChip";
import { formatAmount } from "@/utils/formatters/formatAmount";
import { formatDate, formatDateShort } from "@/utils/formatters/formatDate";
import { CalendarRange, DateRange } from "@/components/calendar/CalendarRange";
import { IconButton } from "@/components/buttons/IconButton";
import Loading from "@/components/states/Loading";
import Button from "@/components/buttons";
import Error from "@/components/states/Error";
import { LoadingModal } from "@/components/states/LoadingModal";
import { TablePagination } from "@/components/pagination/TablePagination";
import EmptyResult from "@/components/layouts/empty";
import { Collapse, Dropdown, MenuProps, Modal, Radio, RadioChangeEvent, Select, Space, Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { DatePicker, DatePickerInput } from "@carbon/react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useFetchTransactionByDateRange } from "@/utils/apiHooks/agents/subagents/useFilterReport";
import { IoFilter } from "react-icons/io5";
import { FiDownload } from "react-icons/fi";
import dayjs from "dayjs";

type TransactionTableProps = {
    walletId: string;
    name: string;
    transactions: AgentTransaction[];
    isLoading?: boolean;
    error?: string | null;
    fetchData?: () => void,
    onPageChange?: (value: {
        selected: number;
    }) => void,
    page: number,
    count: number,
    loadHistory: boolean
    dateRange?: {
        startDate: string,
        endDate: string
    },
    typeEnum?: any
    categoryEnum?: any
    onDateApplied?: (date: DateRange) => void
};

export const AgentTransactionTable = (props: TransactionTableProps) => {

    const { transactions, dateRange } = props;
    const { isLoading: isDownloadReportLoading, error: downloadReportError, downloadReport, data } = useDownloadReport();
    const { isLoading: isFilterReportLoading, error: filterReportError, fetchTransactionsByDateRange, data: filterReport } = useFetchTransactionByDateRange();

    const [page, setPage] = useState<number>(1);
    const [count, setCount] = useState<number>(1);
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);
    const [filterEnabled, setFilterEnabled] = useState(false);
    const [stateSelectedType, setSelectedType] = useState("");
    const [stateSelectedCategory, setSelectedCategory] = useState("");
    const [categoryEnum, setCategoryEnum] = useState({
        key: "", label: ""
    });
    const [typeEnum, setTypeEnum] = useState({
        key: "", label: ""
    });
    const [isDateFilterModalOpen, setIsDateFilterModalOpen] = useState(false);
    const [defaultDate, setDefaultDate] = useState(dateRange ? [dateRange.startDate, dateRange.endDate] : [new Date(), new Date()]);


    const [displayHistoryModal, setDisplayHistoryModal] = useState(false);
    const [filteredTransactions, setFilteredTransactions] = useState<AgentTransaction[]>([]);
    const [transactionFilter, setTransactionFilter] = useState("all");

    const [currentTransactionData, setCurrentTransactionData] = useState<AgentTransaction>({
        createdAt: "",
        amount: 0,
        balance_after: 0,
        balance_before: 0,
        category: "",
        currency: "",
        description: "",
        reference: "",
        status: "",
        total: 0,
        type: "",
        walletId: ""
    });
    const [date, setDate] = useState<DateRange>(dateRange ? {
        from: convertToDate(dateRange.startDate),
        to: convertToDate(dateRange.endDate),
    } : {
        from: new Date(),
        to: new Date(),
    });
    const [filterDate, setFilterDate] = useState<DateRange>(dateRange ? {
        from: convertToDate(dateRange.startDate),
        to: convertToDate(dateRange.endDate),
    } : {
        from: new Date(),
        to: new Date(),
    });
    const { showSnackBar } = useContext(GlobalActionContext);

    let selectedType = "";
    let selectedCategory = "";

    useEffect(() => {
        setPage(props.page);
        setCount(props.count);
        setFilteredTransactions(transactions);
    }, [transactions])

    const formatDateRange = useMemo(() => {
        if (!date) return "Tap to filter by date range";
        const start = moment(date.from).format("MMM D, YYYY");
        const end = moment(date.to).format("MMM D, YYYY");
        return `From ${start} - ${end}`;
    }, [JSON.stringify(date)]);

    useEffect(() => {
        if (props.typeEnum) {
            let typeData = {
                key: "transiton",
                label: "Transaction Type",
                children: props.typeEnum.map((type: string, index: number) => ({
                    key: `${index}-${index}`,
                    label: <Button
                        variant="text"
                        className="px-6 py-2 h-[max] text-left"
                        onClick={() => {
                            type = type === "ALL" ? "" : type;
                            fetchTransactionsByDateRange({
                                walletId: props.walletId ? props.walletId : "",
                                startDate: convertDateToSecondFormat(date.from),
                                endDate: convertDateToSecondFormat(date.to ?? new Date()),
                                type: type,
                                category: selectedCategory
                            })
                            selectedType = type;
                            setSelectedType(type);
                            setFilterEnabled(true);
                        }}
                    >
                        {type?.split("_")?.join(" ")}
                    </Button>
                }))
            }
            setTypeEnum(typeData);
        }
    }, [props.typeEnum]);

    useEffect(() => {
        if (props.categoryEnum) {
            let typeData = {
                key: "category",
                label: "Category",
                children: props.categoryEnum.map((type: string, index: number) => ({
                    key: `${index}-${index}`,
                    label: <Button
                        variant="text"
                        className="px-6 py-2 h-[max] text-left"
                        onClick={() => {
                            type = type === "ALL" ? "" : type;
                            fetchTransactionsByDateRange({
                                walletId: props.walletId ? props.walletId : "",
                                startDate: convertDateToSecondFormat(date.from),
                                endDate: convertDateToSecondFormat(date.to ?? new Date()),
                                type: selectedType,
                                category: type
                            })
                            setFilterEnabled(true);
                            setSelectedCategory(type);
                            selectedCategory = type;
                        }}
                    >
                        {type?.split("_")?.join(" ")}
                    </Button>
                }))
            }
            setCategoryEnum(typeData);
        }
    }, [props.categoryEnum]);

    function onNewDateApplied(date: DateRange) {
        if (date) {
            setDate((prevDate) =>
                Object.assign({}, prevDate, {
                    from: date.from || new Date(),
                    to: date.to || new Date(),
                })
            );
        }
        props.onDateApplied?.(date)
        setIsDateModalOpen(false);
    }

    useEffect(() => {
        // props.onDateApplied?.(date)
    }, [date])

    useEffect(() => {
        if (data) {
            // Create a blob from the response
            const blob = new Blob([data], { type: 'text/csv' });

            // Create a download link and trigger the download
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = 'wallet_transactions.csv';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            if (typeof data == 'string') {
                alert("Unprocessable entity")
            }
        }
    }, [data])

    useEffect(() => {
        if (downloadReportError) {
            showSnackBar({
                severity: 'error',
                message: downloadReportError
            })
        }
    }, [downloadReportError])

    function handleDownloadReport() {
        const dateRange = ({
            walletId: props?.walletId ? props.walletId : "",
            startDate: convertDateToSecondFormat(date.from),
            endDate: convertDateToSecondFormat(date.to ?? new Date()),
            type: stateSelectedType,
            category: stateSelectedCategory
        });
        downloadReport(dateRange)
    }
    const toggleHistoryModal = () => {
        setDisplayHistoryModal(!displayHistoryModal)
    }
    const handleDisplayHistoryModal = (e: AgentTransaction) => {
        setCurrentTransactionData(e);
        toggleHistoryModal();
    }

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

    useEffect(() => {
        if (filterReport) {
            setCount(filterReport?.count ? +filterReport.count : 0);
            setFilteredTransactions(filterReport?.transactions ? filterReport.transactions : []);
        }
    }, [filterReport])

    useEffect(() => {
        if (filterReportError) {
            showSnackBar({
                message: filterReportError,
                severity: 'error'
            })
        }
    }, [filterReportError])

    useEffect(() => {
        if (props.dateRange?.startDate && props.dateRange?.endDate) {
            setDefaultDate([dayjs(props.dateRange.startDate).format("YYYY-MM-DD"), dayjs(props.dateRange.endDate).format("YYYY-MM-DD")]);
        }
    }, [props.dateRange])

    const FetchTransactionByDateRange = (yesterday: any, today: any) => {
        fetchTransactionsByDateRange({
            page: props.page,
            walletId: props?.walletId ? props.walletId : "",
            startDate: typeof yesterday === "string" ? yesterday : convertDateToSecondFormat(yesterday),
            endDate: typeof today === "string" ? today : convertDateToSecondFormat(today),
            type: stateSelectedType,
            category: stateSelectedCategory
        })
    }

    const items: MenuProps['items'] = [
        categoryEnum, typeEnum
    ];

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

    const menuProps = {
        items,
    };

    function onPageChange(selectedItem: {
        selected: number;
    }) {
        fetchTransactionsByDateRange({
            walletId: props.walletId ? props.walletId : "",
            startDate: convertDateToSecondFormat(date.from),
            endDate: convertDateToSecondFormat(date.to ?? new Date()),
            type: selectedType,
            category: selectedCategory,
            page: selectedItem.selected + 1
        })
        setPage(selectedItem.selected + 1)
    }

    return (
        <Spin spinning={isFilterReportLoading} indicator={<LoadingOutlined spin />}>
            <div className="flex flex-col gap-4 py-8 px-4 min-w-[100%]">
                <LoadingModal isVisible={isDownloadReportLoading} />
                <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-0 justify-between">
                    <div>
                        <h1 className="text-xl font-bold">{props.name}</h1>
                    </div>
                    {
                        props.loadHistory ? <Spin indicator={<LoadingOutlined spin />} /> : ""
                    }
                    <div className="flex flex-col md:flex-row gap-5 md:items-end">
                        <div className="py-3 px-5 border-2 border-[#EFEFEF] w-max flex items-center border-solid gap-5 cursor-pointer">
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
                                <DatePicker datePickerType="range" onChange={handleDateChange} value={defaultDate}>
                                    <DatePickerInput id="date-picker-input-id-start" placeholder="mm/dd/yyyy" labelText="Start date" size="lg" />
                                    <DatePickerInput id="date-picker-input-id-finish" placeholder="mm/dd/yyyy" labelText="End date" size="lg" />
                                </DatePicker>
                            </div>
                            <div>
                                <div onClick={handleDownloadReport} className="cursor-pointer bg-primary w-12 h-12 rounded-full flex items-center justify-center">
                                    <FiDownload className="text-white text-2xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div>
                    <div>
                        <Radio.Group onChange={onChangeRadio} value={transactionFilter}>
                            <Radio value="all">All</Radio>
                            <Radio value="success">Successful</Radio>
                            <Radio value="failed">Failed</Radio>
                            <Radio value="pending">Pending</Radio>
                        </Radio.Group>
                    </div>
                </div>
                <div>
                    <Popover
                        modal
                        open={isDateFilterModalOpen}
                        onOpenChange={setIsDateFilterModalOpen}
                    >
                        <PopoverTrigger className="flex-1">
                            <div className="flex flex-1 items-center gap-4 border py-2 px-3 -mx-2">
                                <p className="text-black text-start text-sm line-clamp-1 flex-1">
                                    {formatDateRange}
                                </p>

                                <CalendarIcon className="h-8 w-8 opacity-50 text-gray-600 bg-gray-300 p-2 rounded-full" />
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <CalendarRange
                                showOutsideDays={false}
                                onNewDateApplied={onNewFilterDateApplied}
                                dateRange={{
                                    from: date.from,
                                    to: date.to
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </div> */}
                </div>
                <div className="min-w-[100%]">
                    <div className="hidden md:block">
                        <Table className="min-w-[100%]">
                            <TableHeader className="bg-primary rounded-xl">
                                <TableRow>
                                    <TableHead className="text-white rounded-tl-xl">Date</TableHead>
                                    <TableHead className="text-white">Category</TableHead>
                                    <TableHead className="text-white">Amount</TableHead>
                                    <TableHead className="text-white">Balance After</TableHead>
                                    <TableHead className="text-white">Type</TableHead>
                                    <TableHead className="text-white">Status</TableHead>
                                    {/* <TableHead className="text-white">Description</TableHead> */}
                                    <TableHead className="text-white rounded-tr-xl">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            {
                                filteredTransactions.map((item, index) => (
                                    <>
                                        <TableBody key={index} className="bg-[#FAFAFA] mb-5 rounded-2xl cursor-pointer">
                                            <TableRow>
                                                <TableCell className="text-base">{formatDateShort(item?.createdAt ? item?.createdAt : "")}</TableCell>
                                                <TableCell className="text-base">{item.category}</TableCell>
                                                {/* <TableCell className="text-base">{item.paymentDetails ? capitalizeFirstLetter(item.paymentDetails.data.payment_type) : "-"}</TableCell> */}
                                                <TableCell className="text-base">{formatAmount(item.amount)}</TableCell>
                                                <TableCell className="text-base">{formatAmount(item.balance_after)}</TableCell>
                                                <TableCell className="text-base">
                                                    {
                                                        item.type === "CREDIT" ?
                                                            <div className="py-2 rounded-lg px-6 bg-green-100 text-center text-yellow-950">{item.type}</div>
                                                            :
                                                            <div className="py-2 rounded-lg px-6 bg-red-200 text-center text-red-900">{item.type}</div>
                                                    }
                                                </TableCell>
                                                <TableCell className="text-base">
                                                    {
                                                        item.status === "pending" ?
                                                            <div className="py-2 rounded-lg px-6 bg-yellow-100 text-center text-yellow-900">{item.status}</div>
                                                            : item.status === "success" ?
                                                                <div className="py-2 rounded-lg px-6 bg-blue-100 text-center text-yellow-950">{item.status}</div>
                                                                :
                                                                <div className="py-2 rounded-lg px-6 bg-red-200 text-center text-red-900">{item.status}</div>
                                                    }</TableCell>
                                                {/* <TableCell className="text-base">{item.description}</TableCell> */}
                                                <TableCell onClick={() => handleDisplayHistoryModal(item)}
                                                    className="text-base"><Button className="text-xs w-max mx-auto py-3 h-max px-5 border-solid border-primary border-2 bg-transparent text-primary text-sm">View Details</Button></TableCell>
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
                                    <Collapse.Panel header={`${formatAmount(item.amount)} ${item.type} transaction on ${formatDateShort(item.createdAt)}`} key={index}>
                                        <ul>
                                            <li className="flex justify-between items-center mb-2">
                                                <p className="text-sm">Date:</p>
                                                <p className="text-sm">{formatDateShort(item.createdAt)}</p>
                                            </li>
                                            <li className="flex justify-between items-center mb-2">
                                                <p className="text-sm">Category:</p>
                                                <p className="text-sm">{item.category}</p>
                                            </li>
                                            <li className="flex justify-between items-center mb-2">
                                                <p className="text-sm">Amount:</p>
                                                <p className="text-sm">{formatAmount(item.amount)}</p>
                                            </li>
                                            <li className="flex justify-between items-center mb-2">
                                                <p className="text-sm">Status:</p>
                                                {
                                                    item.status === "pending" ?
                                                        <div className="text-sm py-2 rounded-lg px-6 bg-yellow-100 text-yellow-900">{item.status}</div>
                                                        : item.status === "success" ?
                                                            <div className="text-sm py-2 rounded-lg px-6 bg-blue-100 text-yellow-950">{item.status}</div>
                                                            :
                                                            <div className="text-sm py-2 rounded-lg px-6 bg-red-200 text-red-900">{item.status}</div>
                                                }
                                            </li>
                                            <li className="flex justify-between items-center mb-2">
                                                <p className="text-sm">Type:</p>
                                                {
                                                    item.type === "CREDIT" ?
                                                        <div className="text-sm py-2 rounded-lg px-6 bg-green-100 text-yellow-950">{item.type}</div>
                                                        :
                                                        <div className="text-sm py-2 rounded-lg px-6 bg-red-200 text-red-900">{item.type}</div>
                                                }
                                            </li>
                                        </ul>
                                        <Button onClick={() => handleDisplayHistoryModal(item)}
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
                <Modal open={displayHistoryModal} onCancel={toggleHistoryModal} footer={null}>
                    <div className="grid gap-4 py-4">
                        <DetailItem data={{
                            title: "Date",
                            value: formatDate(currentTransactionData.createdAt)
                        }} />
                        <DetailItem data={{
                            title: "Category",
                            value: currentTransactionData.category
                        }} />
                        <DetailItem data={{
                            title: "Balance Before",
                            value: formatAmount(currentTransactionData.balance_before)
                        }} />
                        <DetailItem data={{
                            title: "Amount",
                            value: formatAmount(currentTransactionData.amount)
                        }} />
                        <DetailItem data={{
                            title: "Balance After",
                            value: formatAmount(currentTransactionData.balance_after)
                        }} />
                        <DetailItem data={{
                            title: "Type",
                            value: currentTransactionData.type
                        }} />
                        <DetailItem data={{
                            title: "Status",
                            value: currentTransactionData.status
                        }} />
                        <DetailItem data={{
                            title: "Description",
                            value: currentTransactionData.description
                        }} />
                        {
                            currentTransactionData?.category === "NIP_CREDIT" &&
                            <DetailItem data={{
                                title: "Sender",
                                value: currentTransactionData?.metadata?.originatorAccountName || ''
                            }} />
                        }
                    </div>
                </Modal>
            </div>
        </Spin>
    );
};


function capitalizeFirstLetter(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}
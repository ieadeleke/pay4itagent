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
import Loading from "../states/Loading";
import Error from "../states/Error";
import { LoadingModal } from "../states/LoadingModal";
import { GlobalActionContext } from "@/context/GlobalActionContext";
import Button from "../buttons";
import { formatAmount } from "@/utils/formatters/formatAmount";
import { formatDate } from "@/utils/formatters/formatDate";
import { TablePagination } from "../pagination/TablePagination";
import Link from "next/link";
import { AllAgentType } from "@/models/agents";
import { Collapse, Tabs } from "antd";
import { TransactionPill } from "../mda-dashboard/main/TransactionPill";
import { AgentTransactionHistory } from "../mda-dashboard/main/AgentTransHistory";

type WalletType = {
    accountName: string;
    accountNumber: string;
    bankName: string;
    phoneNumber: string;
    email: string;
    tier: string;
    type: string;
    maxBalance: number;
    dailyTransactionLimit: number;
}

type AgentTableProps = {
    name: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    mdaList: AllAgentType[];
    isLoading?: boolean;
    error?: string | null;
    fetchData?: () => void,
    onPageChange?: (value: {
        selected: number;
    }) => void,
    page: number,
    count: number,
    summaryData?: any
    handleClick: (e: any) => void
};

export const AgentTableList = (props: AgentTableProps) => {
    const { mdaList } = props;
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);
    const { showSnackBar } = useContext(GlobalActionContext);

    const handleClick = (e: any) => {
        props.handleClick(e);
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                <TransactionPill data={{
                    title: "All Transactions",
                    description: String(props?.summaryData?.AllTransaction)
                }} />
                <TransactionPill data={{
                    title: "Successful Transactions",
                    description: String(props?.summaryData?.SuccessfulTransaction)
                }} />
                <TransactionPill data={{
                    title: "Total Transacted Amount",
                    description: formatAmount(+props?.summaryData?.TotalAmount)
                }} />
                <TransactionPill data={{
                    title: "Failed Transactions",
                    description: String(props?.summaryData?.FailTransaction)
                }} />
            </div>
            <div className="mt-10">
                <Link className="bg-primary px-4 py-4 text-white rounded-lg" href="/agents/new">Add New Agent</Link>
            </div>
            {/* <div className="flex items-center justify-between mt-5">
                <h1 className="font-medium text-xl">{props.name}</h1>
            </div> */}
            <div className="mt-10">
                <Tabs type="card">
                    <Tabs.TabPane tab="Agent Transactions" key="1">
                        <AgentTransactionHistory />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={props.name} key="2">
                        <div className="px-5">
                            <div className="hidden md:block">
                                <Table>
                                    <TableHeader className="bg-primary rounded-xl">
                                        <TableRow>
                                            <TableHead className="text-white">Date Added</TableHead>
                                            <TableHead className="text-white">Name</TableHead>
                                            <TableHead className="text-white">Email Address</TableHead>
                                            <TableHead className="text-white">Phone Number</TableHead>
                                            <TableHead className="text-white">Verified</TableHead>
                                            <TableHead className="text-white"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    {mdaList.map((item, index) => (
                                        <TableBody key={index} className="bg-white cursor-pointer">
                                            <TableRow>
                                                <TableCell className="text-sm">{formatDate(item.createdAt)}</TableCell>
                                                <TableCell className="text-sm">{`${item.firstName} ${item.lastName}`}</TableCell>
                                                <TableCell className="text-sm">{item.email}</TableCell>
                                                <TableCell className="text-sm">{item.phoneNumber}</TableCell>
                                                <TableCell className="text-sm">{item?.wallet?.accountName ? <div className="w-3 h-3 rounded-full bg-[#00ff00]"></div> : <div className="w-3 h-3 rounded-full bg-[#ff0000]"></div>}</TableCell>
                                                <TableCell>
                                                    <div>
                                                        <button onClick={() => handleClick(item)}
                                                            className="block bg-transparent border-2 border-[#6A22B2] text-sm border-solid py-3 px-6 rounded-lg bg-gray-800">View Details</button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    ))}
                                </Table>
                            </div>
                            <div className="block md:hidden">
                                <Collapse defaultActiveKey={['0']}>
                                    {
                                        mdaList.map((item, index) => (
                                            <Collapse.Panel header={`${item.firstName} ${item.lastName} added on ${formatDate(item.createdAt)}`} key={index}>
                                                <ul>
                                                    <li className="flex justify-between items-center mb-2">
                                                        <p className="text-sm">Date:</p>
                                                        <p className="text-sm">{formatDate(item.createdAt)}</p>
                                                    </li>
                                                    <li className="flex justify-between items-center mb-2">
                                                        <p className="text-sm">Name:</p>
                                                        <p className="text-sm">{`${item.firstName} ${item.lastName}`}</p>
                                                    </li>
                                                    <li className="flex justify-between items-center mb-2">
                                                        <p className="text-sm">Email:</p>
                                                        <p className="text-sm">{item?.email}</p>
                                                    </li>
                                                    <li className="flex justify-between items-center mb-2">
                                                        <p className="text-sm">Phone number:</p>
                                                        <p className="text-sm">{item?.phoneNumber}</p>
                                                    </li>
                                                </ul>
                                                <Button onClick={() => handleClick(item)}
                                                    className="text-sm w-max py-2 h-max px-5 border-solid border-primary border-2 bg-transparent text-primary font-black text-sm">View Details</Button>
                                            </Collapse.Panel>
                                        ))
                                    }
                                </Collapse>
                            </div>

                            <div className="flex justify-center mb-20">
                                <TablePagination
                                    breakLabel="..."
                                    nextLabel=">"
                                    onPageChange={props.onPageChange}
                                    pageRangeDisplayed={5}
                                    currentPage={props.page - 1}
                                    pageCount={Math.max(0, props.count / 20)}
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
                            {props.isLoading ? <Loading /> : props.error && <Error onRetry={props.fetchData} message={props.error} />}
                        </div>
                    </Tabs.TabPane>
                </Tabs>
            </div>
        </div>
    );
};


function capitalizeFirstLetter(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}
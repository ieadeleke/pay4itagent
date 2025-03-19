import { DateRange } from "@/components/calendar/CalendarRange";
import { AgentTransaction, Transaction } from "@/models/transactions";
import { useFetchTransactions } from "@/utils/apiHooks/agents/subagents/useFetchTransactions";
import { convertDateToFormat, getDefaultDateAsString } from "@/utils/data/getDefaultDate";
import { useContext, useEffect, useState } from "react";
import EmptyIcon from "@/assets/images/list.png";
import Image from "next/image";
import { AgentTransactionTable } from "../AgentTransactionTable";
import { Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { GlobalActionContext } from "@/context/GlobalActionContext";
import { useFetchTotalTransactions } from "@/utils/apiHooks/agents/subagents/useFetchTotalTransactions";
import { TransactionTable } from "@/components/mda-dashboard/transactions/SubAgentTransactionTable";

type PropsType = {
    refreshCount?: number
    walletId: string
    userId: string
}

const SubAgentTotalTransactionTable = (props: PropsType) => {
    const { isLoading, error, data, fetchTransactions, count } = useFetchTotalTransactions();

    const [page, setPage] = useState<number>(1);
    const [date, setDate] = useState(getDefaultDateAsString());

    const [startDate, setStartDate] = useState(getDefaultDateAsString().startDate);
    const [endDate, setEndDate] = useState(getDefaultDateAsString().endDate);

    const [totalTrans, setTotalTrans] = useState<number>(0);
    const { showSnackBar } = useContext(GlobalActionContext);
    const [walletTransaction, setWalletTransaction] = useState<Transaction[]>([]);
    const [loadHistory, setLoadHistory] = useState(true);
    const [loadPageHistory, setLoadPageHistory] = useState(true);

    useEffect(() => {
        if (data) {
            if (data.length) {
                setWalletTransaction(data);
            }
        }
    }, [data]);

    useEffect(() => {
        setLoadPageHistory(isLoading);
        setLoadHistory(isLoading);
    }, [isLoading])

    useEffect(() => {
        if (count) {
            setTotalTrans(count);
        }
    }, [count]);

    useEffect(() => {
        if (error) {
            showSnackBar({
                message: error,
                severity: 'error'
            })
        }
    }, [error]);

    useEffect(() => {
        fetchTransactions({
            page: String(page),
            userId: props.userId,
            startDate: startDate,
            endDate: endDate
        })
    }, [props.userId]);
    useEffect(() => {
        function fetchData() {
            setLoadHistory(true);
            fetchTransactions({
                page: String(page),
                userId: props.userId,
                startDate: startDate,
                endDate: endDate
            })
        }
        if (props.walletId && props.refreshCount && props.refreshCount > 0) {
            fetchData();
        }
    }, [props.refreshCount])

    function onDateApplied(date: DateRange) {
        setDate({
            startDate: convertDateToFormat(date.from),
            endDate: convertDateToFormat(date.to ?? new Date()),
        });
    }

    function onPageChange(selectedItem: {
        selected: number;
    }) {
        setPage(selectedItem.selected)
    }

    return (
        <div>
            {
                !loadPageHistory ?
                    walletTransaction.length ?
                        <div>
                            <TransactionTable walletId={props.walletId} count={totalTrans} page={page} onPageChange={onPageChange} userId={props.userId}
                                dateRange={date} onDateApplied={onDateApplied} name="Transaction History" transactions={walletTransaction} loadHistory={loadHistory} />
                        </div>
                        :
                        <div className="flex items-center justify-center">
                            <div className="empty-icon" style={{ height: "20rem" }}>
                                <div>
                                    <Image src={EmptyIcon} alt="empty icon" width={0} height={0} className="w-[15%] mx-auto mb-5" />
                                    <p>Sub Agent has not carried out any transaction yet</p>
                                </div>
                            </div>
                        </div>
                    :
                    <div className="mt-10">
                        <p>Loading Transaction History <Spin indicator={<LoadingOutlined />} /></p>
                    </div>
            }
        </div>
    )
}

export default SubAgentTotalTransactionTable;
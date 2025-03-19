// import { TransactionTable } from "../transactions/WalletTransactionTable";
import { TransactionTable } from "../transactions/AgentSumHistory";
import { DateRange } from "@/components/calendar/CalendarRange";
import { convertDateToFormat, getDefaultDateAsString } from "@/utils/data/getDefaultDate";
import { useContext, useEffect, useState } from "react";
import { useFetchTranscations } from "@/utils/apiHooks/transactions/useFetchTransactions";
import EmptyResult from "@/components/layouts/empty";
import { useFetchWalletTranscations } from "@/utils/apiHooks/transactions/useFetchWalletTransactions";
import { Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { WalletTransactionType } from "@/models/transactions";
import { useGetAgentsTransactionHistory } from "@/utils/apiHooks/agents/useGetAgentsTransactionHistory";
import { GlobalActionContext } from "@/context/GlobalActionContext";

type TransactionHistoryProps = {
}

export const AgentTransactionHistory = (props: TransactionHistoryProps) => {
    const [date, setDate] = useState(getDefaultDateAsString());
    const [count, setCount] = useState<number>(0);
    const [agentTransList, setAgentTransList] = useState<any>([]);
    const { getAgentTransactionHistory: getAgentHistory, isLoading: loadingAgentHistory, error: errorHistory, data: dataHistory } = useGetAgentsTransactionHistory();
    const [page, setPage] = useState(0);
    const [loadHistory, setLoadHistory] = useState(true);
    const [historyCount, setHistoryCount] = useState<number>(0);
    const [contentData, setContentData] = useState<WalletTransactionType[]>([]);
    const [loadPageHistory, setLoadPageHistory] = useState(true);

    const { showSnackBar } = useContext(GlobalActionContext);

    useEffect(() => {
        function fetchData() {
            getAgentHistory({
                ...date,
                page: String(page + 1)
            });
        }
        fetchData();
    }, [page])

    useEffect(() => {
        setLoadPageHistory(loadingAgentHistory);
    }, [loadingAgentHistory])

    useEffect(() => {
        if (errorHistory) {
            showSnackBar({
                severity: "error",
                message: errorHistory,
            });
            // setLoadHistory(false);
        }
    }, [errorHistory])
    useEffect(() => {
        setLoadHistory(loadingAgentHistory);
    }, [loadingAgentHistory])
    useEffect(() => {
        if (dataHistory) {
            setCount(dataHistory.count);
            setHistoryCount(dataHistory?.count);
            setContentData(dataHistory.Transaction);
            // setLoadHistory(false);
        }
    }, [dataHistory])

    function onDateApplied(date: DateRange) {
        setDate({
            startDate: convertDateToFormat(date.from),
            endDate: convertDateToFormat(date.to ?? new Date()),
        });
    }

    function onPageChange(selectedItem: {
        selected: number;
    }) {
        setPage(selectedItem.selected + 1)
    }

    return <div className="min-h-[400px]">
        {
            !loadPageHistory ?
                contentData?.length ?
                    <TransactionTable count={count} page={page} onPageChange={onPageChange} isLoading={loadHistory}
                        dateRange={date} error={errorHistory} onDateApplied={onDateApplied} name="Agent Transaction History" transactions={contentData} loadHistory={loadHistory} />
                    :
                    <EmptyResult summary="No transaction yet" />
                :
                <Spin indicator={<LoadingOutlined spin />} />
        }
    </div>
}
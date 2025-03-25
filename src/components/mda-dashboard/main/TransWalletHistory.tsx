import { TransactionTable } from "../transactions/WalletTransactionTable";
import { DateRange } from "@/components/calendar/CalendarRange";
import { convertDateToFormat, getDefaultDateAsString } from "@/utils/data/getDefaultDate";
import { useEffect, useState } from "react";
import { useFetchTranscations } from "@/utils/apiHooks/transactions/useFetchTransactions";
import EmptyResult from "@/components/layouts/empty";
import { useFetchWalletTranscations } from "@/utils/apiHooks/transactions/useFetchWalletTransactions";
import { Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { WalletTransactionType } from "@/models/transactions";

type TransactionHistoryProps = {
    refreshCount?: number
    walletId: string
}

export const TransactionHistory = (props: TransactionHistoryProps) => {
    const [date, setDate] = useState(getDefaultDateAsString());
    const { isLoading, error, data, fetchTransactions, count } = useFetchWalletTranscations();
    // const { isLoading, error, data, fetchTransactions, count } = useFetchWalletTranscations();
    const [page, setPage] = useState(0);
    const [loadHistory, setLoadHistory] = useState(true);
    const [contentData, setContentData] = useState<WalletTransactionType[]>([]);
    const [loadPageHistory, setLoadPageHistory] = useState(true);
    const [categoryEnum, setCategoryEnum] = useState({});
    const [typeEnum, setTypeEnum] = useState({});

    useEffect(() => {
        if (!isLoading) {
            setLoadPageHistory(false);
            setLoadHistory(false);
        };
    }, [isLoading])
    useEffect(() => {
        if (data?.Transaction?.length) {
            let category = ["ALL"];
            let newCat = category.concat(data?.categoryEnum);
            console.log(newCat)
            setCategoryEnum(newCat);
            let type = ["ALL"];
            let newType = type.concat(data?.typeEnum);
            console.log(newType)
            setTypeEnum(newType);
            // setTypeEnum(data?.typeEnum);
            setContentData(data?.Transaction);
        }
    }, [data])
    useEffect(() => {
        function fetchData() {
            setLoadHistory(true);
            fetchTransactions({
                walletId: props.walletId,
                ...date,
                page: page + 1
            });
        }
        if (props.walletId) {
            fetchData();
        }
    }, [props.refreshCount])
    useEffect(() => {
        function fetchData() {
            fetchTransactions({
                walletId: props.walletId,
                ...date,
                page: page + 1
            });
        }
        if (props.walletId) {
            fetchData();
        }
    }, [page, props.walletId])

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

    return <div className="min-h-[400px]">
        {
            !loadPageHistory ?
                contentData?.length ?
                    <TransactionTable walletId={props.walletId} count={count} page={page} onPageChange={onPageChange} isLoading={isLoading} typeEnum={typeEnum} categoryEnum={categoryEnum}
                        dateRange={date} error={error} onDateApplied={onDateApplied} name="Wallet Transaction History" transactions={contentData} loadHistory={loadHistory} />
                    :
                    <EmptyResult summary="No transaction yet" />
                :
                <Spin indicator={<LoadingOutlined spin />} />
        }
    </div>
}
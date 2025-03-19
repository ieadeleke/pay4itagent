import { DateRange } from "@/components/calendar/CalendarRange";
import EmptyResult from "@/components/layouts/empty";
import DashboardLayout from "@/components/mda-dashboard/layout";
import { TransactionTable } from "@/components/mda-dashboard/transactions/TransactionTable";
import { Transaction } from "@/models/transactions";
import { useFetchTranscations } from "@/utils/apiHooks/transactions/useFetchTransactions";
import { useFetchTransactionsByReference } from "@/utils/apiHooks/transactions/useFetchTransactionsByReference";
import { convertDateToFormat, getDefaultDateAsString } from "@/utils/data/getDefaultDate";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';

export default function Transactions() {
    const { isLoading: isFetchLoading, error: fetchError, data: allTransactions, fetchTransactions, count } = useFetchTranscations()
    const { isLoading: isReferenceLoading, error: referenceError, fetchTransactionsByReference, data: searchTransactions } = useFetchTransactionsByReference()
    const [date, setDate] = useState(getDefaultDateAsString())
    const router = useRouter()
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const queryReference = router.query.reference as string | undefined
    const [searchWord, setSearchWord] = useState(queryReference);
    const [page, setPage] = useState(1);

    const isLoading = useMemo(() => isFetchLoading || isReferenceLoading, [isFetchLoading, isReferenceLoading])

    const error = useMemo(() => fetchError || referenceError, [fetchError, referenceError])

    function fetchData() {
        if ((searchWord ?? "")?.trim().length > 0) {
            return fetchTransactionsByReference({
                reference: searchWord!!,
                page: page
            })
        }
        fetchTransactions({
            ...date,
            page: page
        })
    }

    useEffect(() => {
        setTransactions(allTransactions)
    }, [allTransactions.length])

    useEffect(() => {
        setSearchWord(queryReference)
    }, [queryReference])

    useEffect(() => {
        setTransactions(searchTransactions)
    }, [searchTransactions.length])

    useEffect(() => {
        setSearchWord(queryReference);
    }, [queryReference]);

    useEffect(() => {
        fetchData()
    }, [searchWord, page])

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

    return <DashboardLayout navTitle="Transactions">
        <div className="flex flex-col py-16 min-h-[80vh]">
            <div className="bg-white border border-gray-200 rounded-xl px-3 md:px-8 p-8">
                {(searchWord ?? "").trim().length > 0 && <h1>Showing results for <span className="font-bold">"{searchWord}"</span></h1>}
                {
            isLoading ?
                <Spin indicator={<LoadingOutlined spin />} />
                :
                    transactions.length ?
                        <TransactionTable onPageChange={onPageChange} page={page} count={count} dateRange={date} fetchData={fetchData} onDateApplied={onDateApplied} isLoading={isLoading} error={error} transactions={transactions} name="Transaction History" serviceCharge={0} />
                        :
                        <EmptyResult summary="No transactions yet" />
                }
            </div>
        </div>
    </DashboardLayout>
}
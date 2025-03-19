import { TransactionTable } from "../transactions/TransactionTable"
import { DateRange } from "@/components/calendar/CalendarRange"
import { convertDateToFormat, getDefaultDateAsString } from "@/utils/data/getDefaultDate"
import { useEffect, useState } from "react"
import { useFetchTranscations } from "@/utils/apiHooks/transactions/useFetchTransactions"
import EmptyResult from "@/components/layouts/empty"
import { useFetchWalletTranscations } from "@/utils/apiHooks/transactions/useFetchWalletTransactions"

export const TransactionHistory = () => {
    const [date, setDate] = useState(getDefaultDateAsString())
    const { isLoading, error, data, fetchTransactions, count } = useFetchTranscations();
    const [page, setPage] = useState(0)

    useEffect(() => {
        function fetchData() {
            fetchTransactions({
                ...date,
                page: page + 1
            });
        }
        fetchData()
    }, [page])

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
            data.length ?
                <TransactionTable count={count} page={page} onPageChange={onPageChange} isLoading={isLoading} dateRange={date} error={error} onDateApplied={onDateApplied} name="Transaction History" transactions={data} />
                :
                <EmptyResult summary="No transaction yet" />
        }
    </div>
}
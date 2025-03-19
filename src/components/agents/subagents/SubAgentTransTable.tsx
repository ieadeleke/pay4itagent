import { DateRange } from "@/components/calendar/CalendarRange";
import { AgentTransaction, Transaction } from "@/models/transactions";
import { useFetchTransactions } from "@/utils/apiHooks/agents/subagents/useFetchTransactions";
import { convertDateToFormat, convertDateToSecondFormat, getDefaultDateAsString } from "@/utils/data/getDefaultDate";
import { useContext, useEffect, useState } from "react";
import EmptyIcon from "@/assets/images/list.png";
import Image from "next/image";
import { AgentTransactionTable } from "../AgentTransactionTable";
import { Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { GlobalActionContext } from "@/context/GlobalActionContext";

type PropsType = {
    refreshCount: number
    walletId: string
}

const SubAgentTransactionTable = (props: PropsType) => {
    const { isLoading, error, data, fetchTransactions, count } = useFetchTransactions();

    const [page, setPage] = useState<number>(1);
    const [date, setDate] = useState(getDefaultDateAsString());
    const [totalTrans, setTotalTrans] = useState<number>(0);
    const { showSnackBar } = useContext(GlobalActionContext);
    const [walletTransaction, setWalletTransaction] = useState<AgentTransaction[]>([]);
    const [loadHistory, setLoadHistory] = useState(true);
    const [enumField, setEnumField] = useState([]);
    const [loadPageHistory, setLoadPageHistory] = useState(true);
    const [typeEnum, setTypeEnum] = useState({});
    const [categoryEnum, setCategoryEnum] = useState({});

    useEffect(() => {
        if (data?.transaction) {
            setWalletTransaction(data?.transaction);
            let categoryArr = ["ALL"];
            let newCatArr = categoryArr.concat(data?.categoryEnum);
            setCategoryEnum(newCatArr);
            let typeArr = ["ALL"];
            let newTypeArr = typeArr.concat(data?.typeEnum);
            setTypeEnum(newTypeArr);
        }
    }, [data]);

    useEffect(() => {
        // if (!isLoading) {
        setLoadPageHistory(isLoading);
        setLoadHistory(isLoading);
        // };
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
            page,
            walletId: props.walletId,
            ...date,
        })
    }, [props.walletId]);
    useEffect(() => {
        function fetchData() {
            setLoadHistory(true);
            fetchTransactions({
                page,
                walletId: props.walletId,
                ...date,
            })
        }
        if (props.walletId && props.refreshCount && props.refreshCount > 0) {
            fetchData();
        }
    }, [props.refreshCount])

    function onDateApplied(date: DateRange) {
        setDate({
            startDate: convertDateToSecondFormat(date.from),
            endDate: convertDateToSecondFormat(date.to ?? new Date()),
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
                loadPageHistory ?
                    <div className="mt-10">
                        <p>Loading Transaction History <Spin indicator={<LoadingOutlined />} /></p>
                    </div>
                    :
                    walletTransaction.length ?
                        <div>
                            <AgentTransactionTable walletId={props.walletId} count={totalTrans} page={page} onPageChange={onPageChange} typeEnum={typeEnum} categoryEnum={categoryEnum}
                                dateRange={date} onDateApplied={onDateApplied} name="Wallet Transaction History" transactions={walletTransaction} loadHistory={loadHistory} />
                        </div>
                        :
                        <div className="empty-icon" style={{ height: "20rem" }}>
                            <div>
                                <Image src={EmptyIcon} alt="empty icon" width={0} height={0} className="w-[15%] mx-auto mb-5" />
                                <p>Sub Agent has not carried out any transaction yet</p>
                            </div>
                        </div>
            }
        </div>
    )
}

export default SubAgentTransactionTable;
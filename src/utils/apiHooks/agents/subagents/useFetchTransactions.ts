import { useState } from "react";
import { useApi } from "../../index";
import { SubAgentTransactionHistoryParams, SubAgentTransactionHistoryResponse } from "@/utils/services/agents/types";
import { AgentService } from "@/utils/services/agents";
import { AgentTransaction, Transaction } from "@/models/transactions";

interface DataInterface {
    transaction: AgentTransaction[]
    typeEnum: any
    categoryEnum: any
}

export const useFetchTransactions = () => {
    const [data, setData] = useState<DataInterface>({
        typeEnum: [],
        categoryEnum: [],
        transaction: []
    });
    const [enumField, setEnumField] = useState<any>([]);
    const { isLoading, error, execute } = useApi()
    const [count, setCount] = useState<number | undefined>(0);

    async function fetchTransactions(params: SubAgentTransactionHistoryParams) {
        setData({
            typeEnum: [],
            transaction: [],
            categoryEnum: []
        });
        const response = await execute(async () => await AgentService().getSubAgentTransactionHistory(params));
        if (response) {
            setData({
                transaction: response.transactions,
                typeEnum: response.typeEnum,
                categoryEnum: response.categoryEnum
            });
            setEnumField(response.typeEnum);
            setCount(response?.count);
        }
    }

    return { isLoading, error, data, fetchTransactions, count }
}
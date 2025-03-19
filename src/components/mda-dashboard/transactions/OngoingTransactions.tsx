import { CheckIcon, MoreHorizontal } from "lucide-react"

const TransactionItem = () => {

    return <div className="flex items-center gap-4">
        <div className="p-2 bg-green-50 rounded-xl">
            <CheckIcon className="text-green-500" />
        </div>

        <div className="flex-1">
            <p>Payment from <span>#0199</span></p>
            <p className="text-xs text-gray-500">Dec 23, 04:00 PM</p>
        </div>

        <p className="font-semibold">#400.00</p>
    </div>
}

export const OngoingTransaction = () => {

    return <div className="flex flex-col">
        <div className="flex items-center">
            <h2 className="font-medium text-xl">On-going Transaction</h2>
            <div className="flex-1" />
            <div className="hover:bg-gray-100 p-2 cursor-pointer rounded-full -mr-2">
                <MoreHorizontal className="text-gray-500" />
            </div>
        </div>

        <div className="flex flex-col mt-4 gap-4">
            <TransactionItem />
            <TransactionItem />
            <TransactionItem />
        </div>
    </div>

}
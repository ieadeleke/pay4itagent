import { formatAmount } from "@/utils/formatters/formatAmount"
import { CircleDollarSign } from "lucide-react"

type RevenuePillProps = {
    name: string,
    value: string
}
export const RevenuePill = (props: RevenuePillProps) => {
    return <div className="flex flex-col h-64 bg-white justify-center rounded-3xl border border-gray-200">
        <div className="flex flex-col px-12 gap-8">
            <div className="self-start p-3 bg-gray-200 rounded-lg">
                <CircleDollarSign className="text-blue-500" />
            </div>
            <div className="flex flex-col">
                <h1 className="text-gray-500">{props.name}</h1>
                <p className="font-bold text-2xl">&#8358;{formatAmount(props.value)}</p>
            </div>
        </div>
    </div>
}
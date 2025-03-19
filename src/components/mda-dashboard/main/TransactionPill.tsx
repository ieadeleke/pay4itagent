import { ArrowRightToLine } from "lucide-react";
import { formatAmount } from "@/utils/formatters/formatAmount";

type TransactionPillProps = {
    data: {
        title: string,
        description: string | number
    }
}

export const TransactionPill = (props: TransactionPillProps) => {
    return <div className="flex flex-col card-message justify-center rounded-3xl">
        <div className="flex flex-col px-8 py-8 gap-4">
            <div className="self-start p-3 bg-white rounded-lg">
                <ArrowRightToLine className="text-black blended-arrow" />
            </div>
            <h1 className="">{props.data.title}</h1>
            {
                typeof props.data.description !== "undefined" ?
                    <p className="font-bold text-xl">{typeof props.data.description === "string" ? props.data.description : formatAmount(props.data.description)}</p>
                    :
                    ""
            }
        </div>
    </div>
}
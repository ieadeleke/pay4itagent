import Image from "next/image";
import EmptyIcon from "@/assets/images/list.png";
import Link from "next/link";

interface EmptyIconInterface {
    summary: string;
    displayLink?: boolean;
    linkTitle?: string;
    link?: string;
}

const EmptyResult = (props: EmptyIconInterface) => {
    return (
        <div>
            <div className="empty-icon">
                <div>
                    <Image src={EmptyIcon} alt="empty icon" width={0} height={0} className="w-[15%] mx-auto mb-5" />
                    <p>{props.summary}</p>
                    {
                        props.link ?
                            <div className="mt-5">
                                <Link href={props.link} className="rounded-lg text-xs w-max mx-auto py-3 h-max px-5 border-solid border-primary border-2 bg-transparent 
          text-primary font-black text-sm block">{props.linkTitle}</Link>
                            </div>
                            :
                            ""
                    }
                </div>
            </div>
        </div>
    )
}
export default EmptyResult;
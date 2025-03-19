import { TextField } from "@/components/input/InputText";
import { useEffect } from "react";

interface AgentInfoInterface {
    content: {
        userName: string,
        firstName: string,
        lastName: string,
        phoneNumber: string,
        email: string,
        wallet: {
            accountNumber: string,
            bankName: string,
            accountName: string
        }
    }
}

const AgentBasicInfo = (props: AgentInfoInterface) => {
    return (
        <div>
            <div className="flex flex-col md:grid grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                    <h1>User name</h1>
                    <TextField.Input value={props?.content?.userName} disabled placeholder="e.g John" className="outline-none px-2 rounded-lg" />
                </div>
                {
                    props?.content?.wallet?.accountNumber ?
                        <>
                            <div className="flex flex-col gap-2">
                                <h1>Account number</h1>
                                <TextField.Input value={props?.content?.wallet?.accountNumber} disabled placeholder="e.g John" className="outline-none px-2 rounded-lg" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h1>Account name</h1>
                                <TextField.Input value={props?.content?.wallet?.accountName} disabled placeholder="e.g John" className="outline-none px-2 rounded-lg" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h1>Bank name</h1>
                                <TextField.Input value={props?.content?.wallet?.bankName} disabled placeholder="e.g John" className="outline-none px-2 rounded-lg" />
                            </div>
                        </> : <div></div>}
                <div className="flex flex-col gap-2">
                    <h1>First name</h1>
                    <TextField.Input value={props?.content?.firstName} disabled placeholder="e.g John" className="outline outline-gray-100 px-2 rounded-lg" />
                </div>
                <div className="flex flex-col gap-2">
                    <h1>Last name</h1>
                    <TextField.Input value={props?.content?.lastName} disabled placeholder="e.g Doe" className="outline outline-gray-100 px-2 rounded-lg" />
                </div>
                <div className="flex flex-col gap-2">
                    <h1>Phone number</h1>
                    <TextField.Input disabled value={props?.content?.phoneNumber} className="outline-none px-2 rounded-lg" />
                </div>
                <div className="flex flex-col gap-2">
                    <h1>Email address</h1>
                    <TextField.Input disabled value={props?.content?.email} className="outline-none px-2 rounded-lg" />
                </div>
            </div>
        </div>
    )
}

export default AgentBasicInfo;
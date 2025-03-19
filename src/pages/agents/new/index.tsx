'use client';

import DashboardLayout from "@/components/mda-dashboard/layout";
import { NetworkRequestContainer } from "@/components/states/NetworkRequestContainer";
import { GlobalActionContext } from "@/context/GlobalActionContext";
import { useContext, useEffect, useState } from "react";

import Button from "@/components/buttons";
import { RegularTextInput } from "@/components/input/RegularTextInput";
import { useAddAgents } from "@/utils/apiHooks/agents/useAddNewAgent";

interface AddNewAgentInterface {
    firstName: string;
    email: string;
    lastName: string;
    userName: string;
    phoneNumber: string
}

export default function AgentsDashboard() {

    const { addnewAgent, isLoading, error, data } = useAddAgents();
    const { showSnackBar } = useContext(GlobalActionContext);

    const [newUserData, setNewUserData] = useState<AddNewAgentInterface>({
        firstName: "",
        email: "",
        lastName: "",
        userName: "",
        phoneNumber: ""
    });

    useEffect(() => {
        if (data) {
            showSnackBar({
                severity: "success",
                message: "Agent added successfully",
            });
            window.location.reload();
        }
    }, [data]);

    useEffect(() => {
        if (error) {
            showSnackBar({
                severity: "error",
                message: error,
            });
        }
    }, [error]);

    const uploadNewAgentData = () => {
        let { firstName, lastName, email, userName, phoneNumber } = newUserData;
        if (firstName.length && lastName.length && email.length && userName.length && phoneNumber.length) {
            addnewAgent(newUserData);
        } else {
            showSnackBar({
                severity: "error",
                message: "Please fill all fields",
            });
        }
    }

    const updateAgentFormField = (e: any) => {
        setNewUserData({
            ...newUserData,
            [e.target.name]: e.target.value
        })
    }

    return <DashboardLayout>
        <div>
            <div className="flex flex-col px-4 py-8 gap-8">
                <div>
                    <div className="flex flex-col justify-center gap-5">
                        <div className="w-full md:w-[50%] mx-auto bg-white p-10 md-px-10 rounded-[16px]">
                            <div className="mb-10 text-center">
                                <h3 className="font-bold text-xl">Add New Agent</h3>
                            </div>
                            <div className="grid grid-cols-2 mb-5 gap-2">
                                <div>
                                    <h4 className="text-sm">First name</h4>
                                    <RegularTextInput onChange={updateAgentFormField} value={newUserData.firstName} name="firstName" className="text-xs py-7" />
                                </div>
                                <div>
                                    <h4 className="text-sm">Last name</h4>
                                    <RegularTextInput onChange={updateAgentFormField} value={newUserData.lastName} name="lastName" className="text-xs py-7" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="mb-5">
                                    <h4 className="text-sm">Email</h4>
                                    <RegularTextInput onChange={updateAgentFormField} value={newUserData.email} name="email" className="text-xs py-7" />
                                </div>
                                <div className="mb-5">
                                    <h4 className="text-sm">Phone number</h4>
                                    <RegularTextInput onChange={updateAgentFormField} value={newUserData.phoneNumber} name="phoneNumber" className="text-xs py-7" />
                                </div>
                            </div>
                            <div className="mb-5">
                                <h4 className="text-sm">Username</h4>
                                <RegularTextInput onChange={updateAgentFormField} value={newUserData.userName} name="userName" className="text-xs py-7" />
                            </div>
                            <div className="mt-10">
                                <Button className="px-5 h-[4rem] w-full" onClick={uploadNewAgentData}
                                    isLoading={isLoading}>Add New Agent</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </DashboardLayout>
}
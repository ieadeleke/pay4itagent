'use client';

import DashboardLayout from "@/components/mda-dashboard/layout";
import { useContext, useEffect, useState } from "react";
import { Modal, Tabs, Checkbox, Divider } from "antd";
import { RegularTextInput } from "@/components/input/RegularTextInput";
import Button from "@/components/buttons";
import { GlobalActionContext } from "@/context/GlobalActionContext";
import { useGetAgents } from "@/utils/apiHooks/agents/useGetAgents";
import { AgentTableList } from "@/components/agents/AgentTable";
// import { useSuspendAgents } from "@/utils/apiHooks/agents/useSuspendAgent";
// import { useUnSuspendAgents } from "@/utils/apiHooks/agents/useUnSuspendAgent";
// import { useFreezeAgent } from "@/utils/apiHooks/agents/useFreezeAgent";
// import { useUnfreezeAgent } from "@/utils/apiHooks/agents/useUnfreezeAgent";
// import { useUpgradeWallet } from "@/utils/apiHooks/agents/useUpgradeWallet";
import ViewAgentData from "@/components/agents/ViewTable";
import ViewSubAgent from "@/components/agents/subagents/ViewSubAgent";
import { capitalizeText } from "@/utils/formatters/capitalizeText";
import { useGetAgentsSummary } from "@/utils/apiHooks/agents/useGetAgentSummary";
import { useGetAgentsTransactionHistory } from "@/utils/apiHooks/agents/useGetAgentsTransactionHistory";
import { AllAgentType } from "@/models/agents";

interface WalletInterface {
    accountName: string;
    accountNumber: string;
    bankName: string;
    phoneNumber: string;
    email: string;
    tier: string;
    type: string;
    maxBalance: number;
    dailyTransactionLimit: number;
}

interface SelectedAgentInterface {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    wallet?: WalletInterface;
    createdAt: string;
    isActive: boolean;
}
interface selectedAgentConsultantInterface {
    _id: string
    DoNotChargeUserForTransactionFee: boolean;
    MDA: string;
    RevenueCode: string;
    RevenueName: string;
    SplittingPercentageForConsultant: string;
    allowPartialPayment: boolean;
    approve: boolean;
    chargeUserForAllTransactionFee: boolean;
    chargeUserForOnlySystemTransactionFee: boolean;
    createdAt: string;
    email: string;
    maxServiceCharge: number;
    maxServiceChargeStatus: boolean;
    minServiceCharge: number;
    name: string;
    settlementAccountCBNCode: string;
    settlementAccountName: string;
    settlementAccountNumber: string;
    settlementBankName: string;
    takeServiceChargeFromGovtCut: boolean
}

export default function Agents() {

    const [mdaList, setMDAList] = useState<any>([]);
    const { getAgentList, isLoading, error, data } = useGetAgents();
    const { getAgentSummary, isLoading: loadingAgentSummary, error: errorSummary, data: dataSummary } = useGetAgentsSummary();

    // const { suspendAgent, isLoading: loadingSuspendAgent, error: suspendAgentError, data: suspendAgentData } = useSuspendAgents();
    // const { unSuspendAgent, isLoading: loadingUnSuspendAgent, error: unSuspendAgentError, data: unSuspendAgentData } = useUnSuspendAgents();

    // const { freezeAgent, isLoading: loadingfreezeAgentData, error: freezeAgentError, data: freezeAgentData } = useFreezeAgent();
    // const { UnfreezeAgent, isLoading: loadingUnFreezeAgentData, error: unFreezeAgentError, data: unFreezeAgentData } = useUnfreezeAgent();

    // const { upgradeWallet, isLoading: loadingUpgradeAgentData, error: upgradeAgentError, data: upgradeAgentWalletData } = useUpgradeWallet();


    // const { approveConsultant, isLoading: isLoadingConsultant, error: errorConsultant, data: dataConsultant } = useApproveMDA();
    // const { disableSpliting, isLoading: loadingDisableSpliting, error: errorDisableSpliting, data: dataDisableSpliting } = useDisableMDASplitting();
    // const { allowSplitting, isLoading: isLoadingSplitting, error: errorSplitting, data: dataSplitting } = useAllowMDASplitting();
    const [page, setPage] = useState(1);
    const [count, setCount] = useState<number>(0);
    const [summaryData, setSummaryData] = useState({});
    const [historyCount, setHistoryCount] = useState<number>(0);
    const [openDisplayModal, setOpenDisplayModal] = useState<boolean>(false);
    const [displayConsultantViewMode, setDisplayConsultantViewMode] = useState<boolean>(false);
    const { showSnackBar } = useContext(GlobalActionContext);
    const [viewAgentsList, setViewAgentsList] = useState<boolean>(true);

    const [selectedAgent, setSelectedAgent] = useState<SelectedAgentInterface>({
        _id: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        createdAt: "",
        isActive: true
    });
    const [selectedAgentConsultant, setSelectedAgentConsultant] = useState<selectedAgentConsultantInterface>({
        _id: "",
        DoNotChargeUserForTransactionFee: false,
        MDA: "",
        RevenueCode: "",
        RevenueName: "",
        SplittingPercentageForConsultant: "",
        allowPartialPayment: false,
        approve: false,
        chargeUserForAllTransactionFee: true,
        chargeUserForOnlySystemTransactionFee: false,
        createdAt: "",
        email: "",
        maxServiceCharge: 0,
        maxServiceChargeStatus: true,
        minServiceCharge: 0,
        name: "",
        settlementAccountCBNCode: "",
        settlementAccountName: "",
        settlementAccountNumber: "",
        settlementBankName: "",
        takeServiceChargeFromGovtCut: true
    });

    function fetchData() {
        getAgentList({
            page
        });
        getAgentSummary();
    }

    useEffect(() => {
        if (data) {
            setCount(data.count);
            setMDAList(data.Agents);
        }
    }, [data])

    useEffect(() => {
        if (dataSummary) {
            setSummaryData(dataSummary);
        }
    }, [dataSummary])
    useEffect(() => {
        if (errorSummary) {
            showSnackBar({
                severity: "error",
                message: errorSummary,
            });
        }
    }, [errorSummary])

    // // suspend user starts
    // useEffect(() => {
    //     if (suspendAgentData) {
    //         showSnackBar({
    //             severity: "success",
    //             message: "Agent suspended successfully",
    //         });
    //         window.location.reload();
    //     }
    // }, [suspendAgentData])
    // useEffect(() => {
    //     if (suspendAgentError) {
    //         showSnackBar({
    //             severity: "error",
    //             message: suspendAgentError,
    //         });
    //     }
    // }, [suspendAgentError])
    // // suspend user ends
    // // unsuspend user starts
    // useEffect(() => {
    //     if (unSuspendAgentData) {
    //         showSnackBar({
    //             severity: "success",
    //             message: "Agent unsuspended successfully",
    //         });
    //         window.location.reload();
    //     }
    // }, [unSuspendAgentData])
    // useEffect(() => {
    //     if (unSuspendAgentError) {
    //         showSnackBar({
    //             severity: "error",
    //             message: unSuspendAgentError,
    //         });
    //     }
    // }, [unSuspendAgentError])
    // // suspend user ends

    // // suspend user starts
    // useEffect(() => {
    //     if (freezeAgentData) {
    //         showSnackBar({
    //             severity: "success",
    //             message: "Agent frozen successfully",
    //         });
    //         window.location.reload();
    //     }
    // }, [freezeAgentData])
    // useEffect(() => {
    //     if (freezeAgentError) {
    //         showSnackBar({
    //             severity: "error",
    //             message: freezeAgentError,
    //         });
    //     }
    // }, [freezeAgentError])
    // // suspend user ends
    // // unsuspend user starts
    // useEffect(() => {
    //     if (unFreezeAgentData) {
    //         showSnackBar({
    //             severity: "success",
    //             message: "Agent wallet unfrozen successfully",
    //         });
    //         window.location.reload();
    //     }
    // }, [unFreezeAgentData])
    // useEffect(() => {
    //     if (unFreezeAgentError) {
    //         showSnackBar({
    //             severity: "error",
    //             message: unFreezeAgentError,
    //         });
    //     }
    // }, [unFreezeAgentError])
    // // suspend user ends
    // // upgrade Wallet starts

    // useEffect(() => {
    //     if (upgradeAgentWalletData) {
    //         showSnackBar({
    //             severity: "success",
    //             message: "Agent wallet upgraded successfully",
    //         });
    //         window.location.reload();
    //     }
    // }, [upgradeAgentWalletData])
    // useEffect(() => {
    //     if (upgradeAgentError) {
    //         showSnackBar({
    //             severity: "error",
    //             message: upgradeAgentError,
    //         });
    //     }
    // }, [upgradeAgentError])

    // useEffect(() => {
    //     if (dataConsultant) {
    //         showSnackBar({
    //             severity: "success",
    //             message: "Consultant approved successfully",
    //         });
    //         window.location.reload();
    //     }
    // }, [dataConsultant])

    // useEffect(() => {
    //     if (errorDisableSpliting) {
    //         showSnackBar({
    //             severity: "error",
    //             message: errorDisableSpliting,
    //         });
    //     }
    // }, [errorDisableSpliting])
    // useEffect(() => {
    //     if (dataDisableSpliting) {
    //         showSnackBar({
    //             severity: "success",
    //             message: "Consultant splitting disabled successfully",
    //         });
    //         window.location.reload();
    //     }
    // }, [dataDisableSpliting])

    // useEffect(() => {
    //     if (errorSplitting) {
    //         showSnackBar({
    //             severity: "error",
    //             message: errorSplitting,
    //         });
    //     }
    // }, [errorSplitting])
    // useEffect(() => {
    //     if (dataSplitting) {
    //         showSnackBar({
    //             severity: "success",
    //             message: "Consultant splitting enabled successfully",
    //         });
    //         window.location.reload();
    //     }
    // }, [dataSplitting])

    useEffect(() => {
        fetchData();
    }, [page]);

    function onPageChange(selectedItem: {
        selected: number;
    }) {
        setPage(selectedItem.selected + 1)
    }

    const toggleDisplayModal = () => {
        setOpenDisplayModal(!openDisplayModal);
    }
    const toggleConsultantDisplayModal = () => {
        setDisplayConsultantViewMode(!displayConsultantViewMode);
    }

    const toggleViewAgentList = () => {
        setViewAgentsList(!viewAgentsList);
    }

    const handleMDASelection = (e: any) => {
        setSelectedAgent(e);
        setViewAgentsList(false)
        // toggleDisplayModal();
    }
    const handleMDAConsultantSelection = (e: any) => {
        setSelectedAgentConsultant(e);
        toggleConsultantDisplayModal();
    }

    // const handleApproveConsultant = () => {
    //     approveConsultant({
    //         MDAConsultantId: selectedAgentConsultant._id
    //     });
    // }

    // const handleSuspendAgent = () => {
    //     suspendAgent({
    //         userId: selectedAgent._id
    //     });
    // }

    // const handleUnSuspendAgent = () => {
    //     unSuspendAgent({
    //         userId: selectedAgent._id
    //     });
    // }

    // const handleFreezeAgent = () => {
    //     freezeAgent({
    //         accountNumber: selectedAgent.wallet?.accountNumber ? selectedAgent.wallet.accountNumber : ""
    //     });
    // }

    // const handleUnfreezeAgent = () => {
    //     UnfreezeAgent({
    //         accountNumber: selectedAgent.wallet?.accountNumber ? selectedAgent.wallet.accountNumber : ""
    //     });
    // }

    // const handleDisableSplittingConsultant = () => {
    //     disableSpliting({
    //         MDAId: selectedAgent._id
    //     });
    // }

    // const handleAllowSplittingConsultant = () => {
    //     allowSplitting({
    //         MDAId: selectedAgent._id
    //     });
    // }

    // const handleFundWallet = () => {
    //     disableSpliting({
    //         MDAId: selectedAgent._id
    //     });
    // }

    // const handleUpgradeWallet = (data: string) => {
    //     upgradeWallet({
    //         accountNumber: selectedAgent.wallet?.accountNumber ? selectedAgent.wallet.accountNumber : "",
    //         tier: data
    //     });
    // }

    const handleAgentDataFromTable = (props: AllAgentType[]) => {
        setMDAList(props);
    }

    return (
        <DashboardLayout>
            <>
                <>
                    <div className="flex flex-col px-4 py-8 gap-8">
                        <div>
                            {
                                viewAgentsList ?
                                    <AgentTableList name="List of Agents" mdaList={mdaList} isLoading={isLoading} error={error} page={page} summaryData={summaryData}
                                        count={count} handleClick={handleMDASelection} firstName={""} lastName={""} phoneNumber={""} onPageChange={onPageChange} updateAgentData={handleAgentDataFromTable} />
                                    :
                                    <ViewSubAgent agentID={selectedAgent._id} agentData={selectedAgent} viewAction={toggleViewAgentList} />
                            }
                        </div>
                    </div>
                </>
                <Modal onCancel={toggleDisplayModal} footer={null} open={openDisplayModal}>
                    <Tabs type="card">
                        <Tabs.TabPane tab="Agent Details" key="item-1">
                            <div>
                                <ViewAgentData agent={selectedAgent} />
                                {/* <div className="mt-10 flex gap-5">
                                    {
                                        selectedAgent.isActive ?
                                            <Button className="px-5 bg-danger" isLoading={loadingSuspendAgent} onClick={handleSuspendAgent}>Suspend Consultant</Button>
                                            :
                                            <Button className="px-5 bg-primay" isLoading={loadingUnSuspendAgent} onClick={handleUnSuspendAgent}>Unsuspend Consultant</Button>
                                    }
                                    {
                                        selectedAgent?.wallet?.accountNumber ?
                                            selectedAgent?.wallet?.tier === "TIER_1" ?
                                                <Button className="px-5" variant="outlined" isLoading={loadingUpgradeAgentData} onClick={() => handleUpgradeWallet("Tier_2")}>Upgrade Wallet to Tier 2</Button>
                                                :
                                                <Button className="px-5" variant="outlined" isLoading={loadingUpgradeAgentData} onClick={() => handleUpgradeWallet("TIER_1")}>Downgrade Wallet to Tier 1</Button>
                                            : ""}
                                </div>
                                <Divider />
                                <div className="flex gap-5">
                                    {
                                        selectedAgent?.wallet?.accountNumber ?
                                            <Button className="px-5" variant="outlined" isLoading={loadingfreezeAgentData} onClick={handleFreezeAgent}>Freeze Wallet</Button>
                                            :
                                            ""
                                    }
                                </div> */}
                            </div>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Agent Wallet Details" key="item-2">
                            {
                                selectedAgent.wallet?.accountName ?
                                    <div>
                                        <div className="grid grid-cols-2 gap-5">
                                            <div>
                                                <p className="text-md">Account name:</p>
                                                <RegularTextInput type="text" disabled className="text-xs"
                                                    value={selectedAgent.wallet.accountName} />
                                            </div>
                                            <div>
                                                <p className="text-md">Account number:</p>
                                                <RegularTextInput type="text" disabled className="text-xs"
                                                    value={selectedAgent.wallet.accountNumber} />
                                            </div>
                                            <div>
                                                <p className="text-md">Bank name:</p>
                                                <RegularTextInput type="text" disabled className="text-xs"
                                                    value={selectedAgent.wallet.bankName} />
                                            </div>
                                            <div>
                                                <p className="text-md">Daily Transaction Limit:</p>
                                                <RegularTextInput type="text" disabled className="text-xs"
                                                    value={selectedAgent.wallet.dailyTransactionLimit} />
                                            </div>
                                            <div>
                                                <p className="text-md">Max Balance:</p>
                                                <RegularTextInput type="text" disabled className="text-xs"
                                                    value={selectedAgent.wallet.maxBalance} />
                                            </div>
                                            <div>
                                                <p className="text-md">Tier:</p>
                                                <RegularTextInput type="text" disabled className="text-xs"
                                                    value={selectedAgent.wallet.tier} />
                                            </div>
                                            <div>
                                                <p className="text-md">Type:</p>
                                                <RegularTextInput type="text" disabled className="text-xs"
                                                    value={selectedAgent.wallet.type} />
                                            </div>
                                        </div>
                                        <div className="mt-10 flex gap-5">
                                            {/* <Button className="px-5 bg-danger" isLoading={loadingSuspendAgent} onClick={handleSuspendAgent}>Suspend Consultant</Button> */}
                                            {/* <Button className="px-5" isLoading={isLoadingConsultant} onClick={handleApproveConsultant}>Approve Consultant</Button> */}
                                        </div>
                                        <Divider />
                                        <div className="flex gap-5">
                                            {/* <Button className="px-5" variant="outlined" isLoading={isLoadingConsultant} onClick={handleApproveConsultant}>Fund Customer Wallet</Button>
                                            <Button className="px-5" variant="outlined" isLoading={isLoadingConsultant} onClick={handleApproveConsultant}>View Wallet Transaction</Button>
                                            <Button className="px-5" variant="outlined" isLoading={isLoadingConsultant} onClick={handleApproveConsultant}>Upgrade Wallet</Button> */}
                                        </div>
                                    </div>
                                    :
                                    <p>Account has not been verified yet</p>
                            }
                        </Tabs.TabPane>
                    </Tabs>
                </Modal>

            </>
        </DashboardLayout>
    );
}
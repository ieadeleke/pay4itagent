import { Input } from "antd";
import { useContext, useEffect, useState } from "react";
import DashboardLayout from "@/components/mda-dashboard/layout";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { RegularTextInput } from "@/components/input/RegularTextInput";
import { InputProps } from "@/components/input/InputText";
import Button from "@/components/buttons";
import GlobalContext from "@/context/GlobalContext";
import { HarmonizeReference } from "@/models/reference";
import { PaymentLayout } from "@/components/layout/payment-layout";
import { useVerifyHarmonizeReference } from "@/utils/apiHooks/charge/useVerifyHarmonizeReference";
import HarmonizePaymentContent from "@/components/payment/HarmonizePaymentContent";
import { GlobalActionContext } from "@/context/GlobalActionContext";
import axios from "axios";
import AuthToken from "@/utils/AuthToken";
import { logOut } from "@/utils/auth/logout";
import Router from "next/router";
import { errorHandler } from "@/utils/errorHandler";



type FileUploadParams = {
    file: File;
    url: string;
};

export default function Settings() {

    const {
        data: reference,
        isLoading,
        error,
        verifyReference,
    } = useVerifyHarmonizeReference();

    const router = useRouter();
    const [tx_reference, setTXReference] = useState("");
    const [billReference, setBillReference] = useState("");
    const [data, setData] = useState<HarmonizeReference>();
    const { showSnackBar } = useContext(GlobalActionContext);
    // const tx_referenceParams = useSearchParams().get("tx_reference") ? useSearchParams().get("tx_reference") : useSearchParams().get("ref");
    const paramMeter = useSearchParams();
    const tx_referenceParams = paramMeter.get("tx_reference") || paramMeter.get("ref");
    const mdaParams = useSearchParams().get("mda");

    useEffect(() => {
        if (error) {
            showSnackBar({ severity: "error", message: error });
        }
    }, [error]);

    useEffect(() => {
        if (reference) {
            setData(reference);
        }
    }, [reference]);

    // useEffect(() => {
    //     if (tx_referenceParams) {
    //         let param = tx_referenceParams.slice(0, 4) === "REF=" ? tx_referenceParams.slice(4) : tx_referenceParams;
    //         if (param) {
    //             setTXReference(param);
    //         }
    //         if (param) {
    //             verifyReference({
    //                 reference: param as string,
    //             });
    //         }
    //     }
    // }, [tx_referenceParams, mdaParams]);

    const verifyUserPaymentRef = async (key: string) => {
        let param = key.slice(0, 4) === "REF=" ? key.slice(4) : key;
        // try {
        //     const token = AuthToken().retrieveToken()
        //     const data = await axios.post("https://usepay4it.com/api/v1/agent/payment/HarmonizeBillValidation", {
        //         reference: key
        //     }, {
        //         headers: {
        //             "Authorization": token ? `Bearer ${token}` : undefined
        //         }
        //     });
        //     console.log(data)
        //     // setData(data.data);
        // } catch (err: any) {
        //     // const parsedError = errorHandler(err)
        //     // if (parsedError.status == 401) {
        //     //     logOut()
        //     //     Router.push("/login")
        //     // } else {
        //     //     showSnackBar({ severity: "error", message: parsedError?.message });
        //     // }
        // }
        verifyReference({
            reference: param as string,
        });
    }

    // useEffect(() => {
    //     if (billReference) {
    //         let param = billReference.slice(0, 4) === "REF=" ? billReference.slice(4) : billReference;
    //         // if (param) {
    //         //     setTXReference(param);
    //         // }
    //         if (param) {
    //             verifyReference({
    //                 reference: param as string,
    //             });
    //         }
    //     }
    // }, [billReference]);

    function submitReference() {
        if (tx_reference.trim().length == 0) {
            return alert("Reference ID can't be empty");
        }
        // setBillReference(tx_reference);
        verifyUserPaymentRef(tx_reference);
        // router.push(`/payment/harmonize?tx_reference=${tx_reference}`);
    }

    return <DashboardLayout navTitle="Make Payment">
        <div className="flex flex-col py-16 min-h-[80vh]">
            {data ? (
                <HarmonizePaymentContent data={data} tx_reference={tx_reference} />
            ) : (
                <div className="mx-auto md:w-[50%]">
                    <label htmlFor="" className="text-base font-black">Enter your reference ID</label>
                    <Input onChange={(evt) => setTXReference(evt.target.value.trim())} className="py-5" />
                    <Button
                        onClick={submitReference} isLoading={isLoading}
                        className="bg-primary text-white w-full py-6 mt-5 rounded-lg">Make Payment</Button>
                </div>
            )}
        </div>
    </DashboardLayout>
}
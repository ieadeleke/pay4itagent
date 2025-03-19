import { request } from "../../request"
import { HarmonizeReference, Reference } from "@/models/reference"
import { HarmonizedPaymentNotificationResponse, InitiateHarmonizedPaymentParams, InitiateHarmonizedPaymentResponse, InitiatePaymentParams, InitiatePaymentWithUpperLinkResponse, MakePaymentParams, MakePaymentResponse, PaymentNotificationParams, PrintReceiptParams, UpperLinkPaymentNotificationParams, UpperLinkPaymentNotificationResponse, VerifyHarmonizeReferenceParams, VerifyReferenceParams } from "./types"


export function ChargeService() {

    async function verifyReference(payload: VerifyReferenceParams) {
        const data = await request({
            path: `v1/mda/ReferenceVerification`,
            method: "PUT",
            body: payload
        })
        return data as Reference
    }

    async function verifyHarmonizeReference(
        payload: VerifyHarmonizeReferenceParams
    ) {
        const data = await request({
            path: `v1/agent/payment/HarmonizeBillValidation`,
            body: payload,
            method: "POST",
        });
        return data as HarmonizeReference;
    }
    async function verifySingleReference(
        payload: VerifyHarmonizeReferenceParams
    ) {
        const data = await request({
            path: `v1/agent/payment/SingleBillValidation`,
            body: payload,
            method: "POST",
        });
        return data as Reference;
    }

    async function initiateHarmonizedPayment(
        payload: InitiateHarmonizedPaymentParams
    ) {
        const data = await request({
            path: `v1/abc/HarmonizedInitiatePayment`,
            body: payload,
            method: "POST",
        });
        return data as InitiateHarmonizedPaymentResponse;
    }

    async function initiateSinglePayment(
        payload: InitiateHarmonizedPaymentParams
    ) {
        const data = await request({
            path: `v1/abc/HarmonizedInitiatePayment`,
            body: payload,
            method: "POST",
        });
        return data as InitiateHarmonizedPaymentResponse;
    }

    async function makePayment(payload: MakePaymentParams) {
        const data = await request({
            path: `v1/abc/Payment`,
            method: "POST",
            body: payload
        })
        return data as MakePaymentResponse
    }

    async function printReceipt(payload: PrintReceiptParams) {
        const data = await request({
            path: `v1/abc/ReceiptPrint`,
            method: "POST",
            body: payload
        })
        return data as Reference
    }

    async function initiatePayment(payload: InitiatePaymentParams) {
        const data = await request({
            path: `v1/mda/InitiatePayment`,
            method: "POST",
            body: payload
        })
        return data as InitiatePaymentWithUpperLinkResponse
    }

    async function paymentNotification(payload: PaymentNotificationParams) {
        const data = await request({
            path: `v1/mda/PaymentNotification`,
            method: "POST",
            body: payload
        })
        return data as UpperLinkPaymentNotificationResponse
    }

    async function harmonizeWalletNotification(
        payload: any
    ) {
        const data = await request({
            path: `v1/agent/payment/HarmonizedWalletPaymentNotification`,
            body: payload,
            method: "POST",
        });
        return data as HarmonizedPaymentNotificationResponse;
    }
    async function singleBillWalletNotification(
        payload: any
    ) {
        const data = await request({
            path: `v1/agent/payment/SingleBillPaymentNotification`,
            body: payload,
            method: "POST",
        });
        return data as HarmonizedPaymentNotificationResponse;
    }

    return {
        verifyReference,
        makePayment,
        printReceipt,
        initiatePayment,
        paymentNotification,
        verifyHarmonizeReference,
        harmonizeWalletNotification,
        initiateHarmonizedPayment,
        initiateSinglePayment,
        singleBillWalletNotification,
        verifySingleReference
    }
}
import { request } from "@/utils/request"
import { AddConsultantType, BankDataVerification, BankDataVerificationResponse, BankListResponse, EditConsultantType, GetSingleConsultantType } from "./types/index";
import { ApiResponse } from "@/models";

export function ConsultantService() {

    async function addConsultant(params: AddConsultantType) {
        const data = await request({
            path: `v1/agent/BankTransfer`,
            method: "POST",
            body: params
        })
        return data;
    }

    async function editConsultant(params: EditConsultantType) {
        const data = await request({
            path: `v1/mdaConsultant/UpdateConsultant`,
            method: "PUT",
            body: params
        })
        return data;
    }

    async function getConsultants(params: string) {
        const data = await request({
            path: `v1/mdaConsultant/ViewConsultants`,
            method: "GET",
            body: params
        })
        return data;
    }
    async function getSingleConsultant(params: GetSingleConsultantType) {
        const data = await request({
            // path: `v1/mdaConsultant/GetMDAWithConsultant`,
            path: `v1/mdaConsultant/ViewConsultant`,
            method: "PUT",
            body: params
        })
        return data;
    }

    async function fetchBankList() {
        const data = await request({
            path: `v1/wallet/BankList`,
            method: "GET"
        })
        return data as BankListResponse;
    }

    async function verifyBankData(params: BankDataVerification) {
        const data = await request({
            path: `v1/wallet/AccountDetails`,
            method: "POST",
            body: params
        })
        return data as ApiResponse;
    }

    return {
        addConsultant,
        fetchBankList,
        verifyBankData,
        getConsultants,
        getSingleConsultant,
        editConsultant
    }
}
import { request } from "@/utils/request"
import { ActivateAgentWalletParams, ActivateAgentWalletResponse, FetchProfileResponse, RefreshAgentWalletParams, RefreshAgentWalletResponse, SetAgentPinParams, SetAgentPinResponse, UpdateProfileParams, UpdateProfileResponse } from "./types"
import { ApiResponse } from "@/models"
import { Profile } from "@/models/profile"

export function ProfileService() {

    async function getUser() {
        const data = await request({
            path: `v1/agent/GetAuthProfile`,
            method: "GET"
        })
        return data as FetchProfileResponse;
    }

    async function activateAgentWallet(params: ActivateAgentWalletParams) {
        const data = await request({
            path: `v1/agent/ActivateUserWallet`,
            method: "POST",
            body: params
        })
        return data as ActivateAgentWalletResponse;
    }

    async function refreshAgentWallet(params: RefreshAgentWalletParams) {
        const data = await request({
            path: `v1/wallet/RefreshWallet`,
            method: "POST",
            body: params
        })
        return data as RefreshAgentWalletResponse;
    }

    async function setNewUserPin(params: SetAgentPinParams) {
        const data = await request({
            path: `v1/agent/SetWalletPin`,
            method: "POST",
            body: params
        })
        return data as SetAgentPinResponse;
    }

    async function updateProfile(params: UpdateProfileParams) {
        const formData = new FormData()
        formData.append("firstName", params.firstName);
        formData.append("lastName", params.lastName);
        // if (params.image) {
        //     formData.append('image', params.image)
        // }
        // Object.entries(params).forEach(([key, value]) => {
        //     if (key != 'image') {
        //         formData.append(key, value)
        //     }
        // })
        const response = await request({
            path: `v1/agent/UpdateProfile`,
            method: "PUT",
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response as UpdateProfileResponse
    }

    return {
        getUser,
        updateProfile,
        activateAgentWallet,
        refreshAgentWallet,
        setNewUserPin
    }
}
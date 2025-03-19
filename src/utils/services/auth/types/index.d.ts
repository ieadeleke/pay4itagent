import { Profile } from "@/models/profile"
import { ApiResponse } from "../../types"

export type SignUpParams = {
    name: string,
    email: string,
    password: string
}

export type VerifySignUpParams = {
    email: string,
    activationCode: string
}

export type LoginParams = {
    identifier: string,
    password: string
}

export type ResetPasswordParams = {
    receivedChannel: string
}

export type ChangePasswordParams = {
    oldPassword: string,
    newPassword: string
}

export type ConfirmResetPasswordParams = {
    receivedChannel: string,
    activationCode: string,
    newPassword: string
}

export type SignUpResponseParams = ApiResponse & {

}

export type LoginResponseParams = ApiResponse & {
    profile: Profile,
    token: string
}
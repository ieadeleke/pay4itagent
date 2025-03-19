import UserContext from "@/context/UserContext"
import { Profile } from "@/models/profile";
import { useFetchUser } from "@/utils/apiHooks/profile/useFetchUser";
import { capitalizeText } from "@/utils/formatters/capitalizeText"
import { Dropdown } from "antd";
import Link from "next/link";
import { useContext, useEffect, useState } from "react"

export const Hero = () => {

    const { isLoading: isLoadingUser, error: userError, data: userFetchedData, fetchUser } = useFetchUser();

    const [userData, setUserData] = useState<Profile>({
        name: "",
        addedBy: "",
        email: "",
        firstName: "",
        isActive: false,
        lastName: "",
        loginCount: 0,
        loginDisabled: false,
        loginReTryTime: "",
        phoneNumber: "",
        userName: "",
        imgUrl: "",
        wallet: {
            _id: "",
            accountName: "",
            accountNumber: "",
            accountReference: "",
            availableBalance: 0,
            bankName: "",
            bookedBalance: 0,
            country: "",
            currency: "",
            dailyTransactionLimit: 0,
            email: "",
            maxBalance: 0,
            minBalance: 0,
            phoneNumber: "",
            previousBalance: 0,
            provider: "",
            providerCustomerId: "",
            status: "",
            tier: "",
            type: "",
            userId: "",
        }
    });

    useEffect(() => {
        if (userFetchedData) {
            setUserData(userFetchedData);
        }
    }, [userFetchedData]);

    useEffect(() => {
        fetchUser();
    }, [])

    const items = [
        {
            key: '1',
            label: (
                <Link href="/payment/single" className="bg-transparent py-3">
                    Single Bill
                </Link>
            ),
        },
        {
            key: '2',
            label: (
                <Link href="/payment/multiple" className="bg-transparent py-3">
                    Harmonized Bill
                </Link>
            ),
        }
    ]

    return <div className="flex flex-col h-64 justify-center rounded-3xl global-hero">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-5 px-8">
            <div>
                <h1 className="text-3xl mb-3 text-white font-bold leading-relaxed">Hello {capitalizeText(userData?.userName ? userData?.userName : "")},</h1>
                <p className="text-white">Welcome to your dashboard</p>
            </div>
            <div>
                <Dropdown
                    menu={{
                        items,
                    }}
                    placement="bottomLeft"
                >
                    <button className="bg-white px-8 py-3 text-base rounded-xl">Make Payment</button>
                </Dropdown>
            </div>
        </div>
    </div>
}
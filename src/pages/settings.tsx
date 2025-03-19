import { Avatar } from "@/components/images/Avatar";
import DashboardLayout from "@/components/mda-dashboard/layout";
import logo from '@/assets/images/lirs_logo.png'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EditProfile } from "@/components/mda-dashboard/settings/EditProfile";
import { UpdatePassword } from "@/components/mda-dashboard/settings/UpdatePassword";
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { useUpdateProfile } from "@/utils/apiHooks/profile/useUpdateProfile";
import { GlobalActionContext } from "@/context/GlobalActionContext";
import UserContext from "@/context/UserContext";
import { LoadingModal } from "@/components/states/LoadingModal";
import { SideInnerNav } from "@/components/mda-dashboard/layout/SideInnerNav";
import UserIcon from '@/assets/icons/user.svg';
import SettingsIcon from '@/assets/icons/ic_settings.svg';
import ActiveSettingsIcon from '@/assets/icons/settings_active.svg';
import APIIcon from '@/assets/icons/api.svg';
import ActiveAPIIcon from '@/assets/icons/api_active.svg';
import ActiveUserIcon from '@/assets/icons/user_active.svg';
import { capitalizeText } from "@/utils/formatters/capitalizeText";


type FileUploadParams = {
    file: File;
    url: string;
};

export default function Settings() {
    const { isLoading, data, error, updateProfile } = useUpdateProfile()
    const imageRef = useRef<HTMLInputElement>(null);
    const { user } = useContext(UserContext)
    const [selectedImage, setSelectedImage] = useState<FileUploadParams | null>(
        null
    );
    const { showSnackBar } = useContext(GlobalActionContext);
    const [currentDisplay, setCurrentDisplay] = useState<number>(0);

    useEffect(() => {
        if (data) {
            showSnackBar({
                message: "Successfully updated",
                severity: 'success'
            })
            location.href = location.href
        }
    }, [data])

    // useEffect(() => {
    //     if (selectedImage) {
    //         updateProfile({
    //             image: selectedImage.file
    //         })
    //     }
    // }, [selectedImage])

    useEffect(() => {
        if (error) {
            showSnackBar({
                message: error,
                severity: 'error'
            })
        }
    }, [error])

    async function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const url = URL.createObjectURL(file);
            setSelectedImage({ file, url });
        }
    }

    function openGallery() {
        imageRef.current?.click();
    }

    const updateCurrentDisplay = (e: number) => {
        setCurrentDisplay(e)
    }

    const displayListControl = [{
        title: "Profile",
        icon: <UserIcon />,
        active_icon: <ActiveUserIcon />,
        action: () => updateCurrentDisplay(0),
        active: currentDisplay === 0 ? true : false
    }, {
        title: "Password",
        icon: <SettingsIcon />,
        active_icon: <ActiveSettingsIcon />,
        action: () => updateCurrentDisplay(2),
        active: currentDisplay === 2 ? true : false
    }]

    return <DashboardLayout navTitle="Settings">
        <div className="flex flex-col py-16 min-h-[80vh]">
            {/* <input
                ref={imageRef}
                type="file"
                onChange={handleImageChange}
                style={{ display: "none" }}
                accept="image/*"
                multiple={false}
            /> */}
            <LoadingModal isVisible={isLoading} />
            <div className="bg-white">
                <div className="flex flex-col bg-primary h-32 rounded-tl-lg rounded-tr-lg"></div>
                {/* <div className="pb-4 px-5 pt-10">
                    <h1 className="font-semibold text-xl mb-2">{capitalizeText(user?.firstName)} {capitalizeText(user?.lastName)}</h1>
                    <p className="text-primary font-light">{user?.email}</p>
                </div> */}
                <div className="mt-20 pr-8 pb-8">
                    <div className="flex flex-col md:flex-row gap-5 h-[100%]">
                        <div className="md:w-[25%] h-[100%]">
                            <div>
                                <SideInnerNav listProps={displayListControl} />
                            </div>
                        </div>
                        <div className="bg-dange w-full md:border-l-2 border-[#efefef] pl-6 md:pl-10">
                            <div>
                                {
                                    currentDisplay === 0 ?
                                        <EditProfile />
                                        :
                                        <UpdatePassword />
                                }
                                {/* <NewConsultant /> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <Tabs defaultValue="edit-profile" className="mx-64">
                <TabsList>
                    <TabsTrigger value="edit-profile">
                        Edit Profile
                    </TabsTrigger>
                    <TabsTrigger value="keys">Credentials</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>

                <TabsContent value="edit-profile">
                    <EditProfile />
                </TabsContent>

                <TabsContent value="keys">
                    <Keys />
                </TabsContent>

                <TabsContent value="password">
                    <UpdatePassword />
                </TabsContent>

            </Tabs> */}
        </div>
    </DashboardLayout>
}
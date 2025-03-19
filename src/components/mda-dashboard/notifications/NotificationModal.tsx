
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import Button from "@/components/buttons";
import { BoxIcon } from "lucide-react";

type NotificationModalsPayload = {

};

type Notification = {
    title: string,
    description: string
}

type NotificationModalProps = {};

export type NotificationModalRef = {
    open: (payload: NotificationModalsPayload) => void;
    close?: () => void;
};

type DetailItemProps = {
    data: {
        title: string,
        value: string
    }
}

const DetailItem = (props: DetailItemProps) => {
    return <div className="flex items-center gap-4">
        <div className="p-2 border rounded-md">
            <BoxIcon className="text-gray-500" />
        </div>
        <div>
            <Label htmlFor="name" className="text-left">
                {props.data.title}
            </Label>
            <p className="text-gray-500 text-xs">{props.data.value}</p>
        </div>
        <div className="flex-1" />
        <Button variant="text">View Details</Button>
    </div>
}

export const NotificationModal = forwardRef<
    NotificationModalRef,
    NotificationModalProps
>((_, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        setNotifications([
            {
                title: "New Order!",
                description: "Order for item(No) on dd/mm/yy  and time"
            },
            {
                title: "Item Delivered",
                description: "Order for item(No) on dd/mm/yy  and time"
            },
            {
                title: "New Alert",
                description: "Notification alert Order for item(No) on dd/mm/yy  and time"
            }
        ])
    }, [])

    useImperativeHandle(ref, () => ({
        open(payload: NotificationModalsPayload) {
            setIsVisible(true);
        },
        close() {
            closeModal();
        },
    }));

    function closeModal() {
        setIsVisible(false);
    }

    function handlePrintReceipt() {

    }

    function handleGenerateReceipt() {

    }

    return (
        <Dialog open={isVisible} onOpenChange={setIsVisible}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-scroll no-scrollbar p-0">
                <DialogHeader className="bg-primary text-white p-4">
                    <DialogTitle>Notifications</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4 px-4">
                    {notifications.map((item) => <DetailItem key={item.title} data={{
                        title: item.title,
                        value: item.description
                    }} />)}
                </div>

                <DialogFooter className="gap-4 pb-4 px-4">
                    <Button variant="outlined" className="flex-1 h-12" onClick={closeModal} type="submit">Done</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
});

NotificationModal.displayName = "NotificationModal"
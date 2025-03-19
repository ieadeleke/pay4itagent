import React from "react";

import UserIcon from '@/assets/icons/user.svg';

interface ListPropsInterface {
    icon: any,
    title: string,
    action: Function,
    active: Boolean,
    active_icon: any
}

export const SideInnerNav = (props: { listProps: ListPropsInterface[] }) => {
    return (
        <div>
            <ul>
                {props.listProps.map((list, index) => (
                    <li onClick={() => list.action()} key={index} className={`cursor-pointer flex gap-6 py-5 px-4 mb-3 ${list.active ? "bg-[#6A22B21A] border-r-4 border-primary border-solid" : ""}`}>
                        {
                            list.active ?
                                list.active_icon :
                                list.icon
                        }
                        <p className={`${list.active ? "text-primary font-black" : ""}`}>{list.title}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}
import Image from "next/image";
import EmptyIcon from "@/assets/images/list.png";
import { LoadingOutlined } from '@ant-design/icons';
import Link from "next/link";
import { Spin } from "antd";

const Loader = () => {
    return (
        <div>
            <div className="w-full h-[5rem] flex items-center justify-center">
                <div>
                    <Spin className="" indicator={<LoadingOutlined style={{fontSize: '2.5rem'}} spin />} />
                </div>
            </div>
        </div>
    )
}
export default Loader;
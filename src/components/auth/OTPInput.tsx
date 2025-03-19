import { useEffect, useState } from "react"
import OtpInput from 'react-otp-input';

interface updateOTPValue {
    value: string | number
    updateOTP: any
    count?: number
}

export const OTPInputBoxes = (props: updateOTPValue) => {

    const [otp, setOtp] = useState('');

    const changeOTPValue = (e: any) => {
        setOtp(e);
        props.updateOTP(e);
    }

    useEffect(() => {
        setOtp(String(props.value));
    },[props.value])

    return <div className="otp-box">
        <OtpInput
            value={otp} inputType="password"
            onChange={changeOTPValue}
            numInputs={props.count ? props.count : 6}
            renderSeparator={<span>-</span>}
            renderInput={(props) => <input {...props} />}
        />
    </div>
}
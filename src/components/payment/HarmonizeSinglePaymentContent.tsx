import {
  InputProps,
  RegularTextInput,
} from "@/components/input/RegularTextInput";
import { cn } from "@/lib/utils";
import Button from "@/components/buttons";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useContext, useEffect, useMemo, useState } from "react";
import { isEmail } from "@/utils/validation/validation";
import { HarmonizeReference, Reference } from "@/models/reference";
import Pay4ItLogo from "@/assets/images/pay_4_it_logo.png";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { FLUTTERWAVE_LIVE_KEY, config, FLUTTERWAVE_TEST_KEY } from "@/utils/data/flutterwave.config";
import GlobalContext from "@/context/GlobalContext";
import { useInitiateHarmonizePayment } from "@/utils/apiHooks/charge/useInitiateHarmonizePaymentSingle";
import { useHarmonizeNotification } from "@/utils/apiHooks/useCompleteSingleWalletPayment";
import { generateUUID } from "@/utils/data/generateUUID";
import { LoadingOutlined } from '@ant-design/icons';
import { Checkbox, Modal, Spin, type CheckboxProps } from 'antd';
import { FaTrashCan, FaXmark } from "react-icons/fa6";
import { OTPInputBoxes } from "../auth/OTPInput";
import { GenerateReceipt } from "../charge/GenerateReceipt";
import { Divider } from "@/components/Divider";
import { formatAmount } from "@/utils/formatters/formatAmount";
import { GlobalActionContext } from "@/context/GlobalActionContext";
import UserContext from "@/context/UserContext";


const TextInput = ({ className, ...props }: InputProps) => (
  <RegularTextInput className={cn("w-full md:w-96", className)} {...props} />
);

type HarmonizePaymentContentProps = {
  tx_reference: string;
  data: Reference;
};

export default function HarmonizePaymentContent(
  props: HarmonizePaymentContentProps
) {
  const router = useRouter();
  const [formFields, setFormFields] = useState({
    tx_reference: "",
    mobile: "",
    email: "",
    wallet: false,
    userName: ""
  });
  const { showSnackBar } = useContext(GlobalActionContext);
  const {
    isLoading: isPaymentLoading,
    data,
    error: paymentError,
    initiatePaymentWithUpperlink,
  } = useInitiateHarmonizePayment();

  const {
    isLoading: isWalletPaymentLoading,
    data: completeWalletPaymentData,
    error: walletPaymentError,
    harmonizeWalletNotification,
  } = useHarmonizeNotification();
  // const tx_referenceParams = useSearchParams().get("tx_reference") ? useSearchParams().get("tx_reference") : useSearchParams().get("ref");
  const paramMeter = useSearchParams();
  const tx_referenceParams = paramMeter.get("tx_reference") || paramMeter.get("ref");

  const { user } = useContext(UserContext);
  const [txRef, setTxRef] = useState("");
  const [payWithWallet, setPayWithWallet] = useState(false);
  const [payWithWalletModal, setPayWithWalletModal] = useState(false);
  const [userOTPValue, setUserOTPValue] = useState("");
  const [collectUserOTP, setCollectUserOTP] = useState<boolean>(false);
  const [testPay, setTestPay] = useState<any>([]);
  const [walletReceiptBox, setWalletReceiptBox] = useState<any>([]);
  const [serviceCharge, setServiceCharge] = useState<number>(0);
  const [payWithAgentDetail, setPayWithAgentDetail] = useState<any>({});
  const [amountToPay, setAmountToPay] = useState("");
  const [transactionInfo, setTransactionInfo] = useState<any>({});

  const [displayPaymentContent, setDisplayPaymentContent] = useState<boolean>(true);

  useEffect(() => {
    if (data) {
      if (formFields.wallet) {
        setPayWithAgentDetail(data[0].agent);
        setCollectUserOTP(true);
      } else {
        completePayment();
      }
    }
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let randomKey = generateUUID();
    setTxRef(randomKey);
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const amount = props.data.AmountDue;

  // const calculatedServiceCharge = useMemo(() => {
  //   let charge = (props.data.settings.percentage * +(props.data.AmountDue) / 100);
  //   if (charge < props.data.settings.min) {
  //     setServiceCharge(props.data.settings.min);
  //   } else if (charge > props.data.settings.max) {
  //     setServiceCharge(props.data.settings.max);
  //   } else {
  //     setServiceCharge(charge);
  //   }
  // }, [props.data?.settings?.min, amount]); // eslint-disable-line react-hooks/exhaustive-deps

  const stampDuty = 50;

  const actualAmount = useMemo(
    () => {
      // return amount + stampDuty + calculatedServiceCharge;
      // return amount + stampDuty;
      return amount;
    },
    [amount]
  );// eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (completeWalletPaymentData) {
      // let senderName = props.data.bulkBill.PayerName;
      setPayWithWalletModal(false);
      setWalletReceiptBox(completeWalletPaymentData.Receipts);
      setDisplayPaymentContent(false);
      setTransactionInfo(completeWalletPaymentData);
      showSnackBar({ severity: "success", message: "Payment successful" });
      // let hrefRoute = `/payment/harmonize/generate-receipt?reference=${txRef}&billingReference=${billingReference}&senderName=${senderName}&amountPaid=${amountPaid}&ReceiptNumber=${ReceiptNumber}&payment_method=wallet`;
      // window.location.href = hrefRoute;
    }
  }, [completeWalletPaymentData]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleWalletModal = () => {
    if (!formFields.email.length || !formFields.mobile.length) {
      return showSnackBar({ severity: "error", message: "Please fill in all required fields" });
    }
    if (+amountToPay > +props.data.AmountDue.replaceAll(",", "")) {
      return showSnackBar({ severity: "error", message: "You can not pay more than due amount" });
    }
    // setFormFields({
    //   ...formFields,
    //   wallet: !formFields.wallet
    // })
    // setPayWithWallet(!payWithWallet);
    // setPayWithWalletModal(!payWithWalletModal);

    let randomKey = generateUUID();
    setTxRef(randomKey);
    setPayWithWalletModal(!payWithWalletModal);
    setCollectUserOTP(false);
    setUserOTPValue("");
    setFormFields((value) => ({
      ...value,
      userName: "",
      wallet: !formFields.wallet
    }))
  }

  const closeWalletModal = () => {
    let randomKey = generateUUID();
    setTxRef(randomKey);
    setFormFields({
      ...formFields,
      wallet: !formFields.wallet
    })
    setPayWithWalletModal(!payWithWalletModal);
    setCollectUserOTP(false);
    setUserOTPValue("");
    setFormFields((value) => ({
      ...value,
      userName: "",
    }))
  }

  function completePayment() {
    if (userOTPValue.length === 4) {
      harmonizeWalletNotification({
        ...props.data,
        reference: props.tx_reference,
        ...formFields,
        serviceCharge,
        PayerName: props.data.PayerName,
        amountPaid: amountToPay ? amountToPay : props.data.AmountDue,
        pin: userOTPValue
      })
    } else {
      showSnackBar({ severity: "error", message: "Please enter transaction pin" });
    }
  }
  // const publicKey = FLUTTERWAVE_LIVE_KEY;
  const publicKey = FLUTTERWAVE_TEST_KEY;
  // const payNow = useFlutterwave({
  //   ...config,
  //   public_key: publicKey,
  //   amount: actualAmount,
  //   // tx_ref: new Date().getTime().toString(),
  //   tx_ref: txRef,
  //   customer: {
  //     ...config.customer,
  //     id: formFields.tx_reference,
  //     name: props.data ? props.data.bulkBill.PayerName : "",
  //     email: formFields.email,
  //     phone_number: formFields.mobile,
  //   },
  //   customizations: props.data
  //     ? {
  //       title: props.data.bulkBill.State,
  //       description: `Payment for ${props.data.bulkBill.State}`,
  //       logo: Pay4ItLogo.src,
  //     }
  //     : config.customizations,
  // } as any);

  const isLoading = useMemo(() => isPaymentLoading, [isPaymentLoading]);

  const error = useMemo(() => paymentError, [paymentError]);

  useEffect(() => {
    if (error) {
      showSnackBar({ severity: "error", message: error });
    }
  }, [error]);// eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (walletPaymentError) {
      setPayWithWalletModal(false);
      // setFormFields({
      //   ...formFields,
      //   wallet: false
      // })
      setUserOTPValue("");
      showSnackBar({ severity: "error", message: walletPaymentError });
    }
  }, [walletPaymentError]);// eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (tx_referenceParams) {
      let param = tx_referenceParams.slice(0, 4) === "REF=" ? tx_referenceParams.slice(4) : tx_referenceParams;
      setFormFields((value) => ({
        ...value,
        tx_reference: param as string,
      }));
    }
  }, [tx_referenceParams]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (props.data) {
      setFormFields((value) => ({
        ...value,
        amount: props.data.AmountDue,
      }));
    }
  }, [props.data]); // eslint-disable-line react-hooks/exhaustive-deps

  function onSubmit(event: ChangeEvent<HTMLFormElement>) {
    event.preventDefault();
    handlePayNow();
  }

  function submitForm() {
    if (!isEmail(formFields.email)) {
      return alert("Invalid Email");
    } else if (formFields.mobile.length < 11) {
      return alert("Invalid Phone Number");
    }
    if (formFields.wallet) {
      if (!formFields.userName.length) {
        return alert("Please enter agent username")
      }
    }
    handlePayNow();
  }

  // useEffect(() => {
  //   let bp = [...props.data.bulkBill.Webguid];
  //   if (bp.length) {
  //     bp[0].AmountDue = "50";
  //   }
  //   setTestPay(bp)
  // }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handlePayNow() {
    // initiatePaymentWithUpperlink({
    //   Webguid: props.data.bulkBill.Webguid,
    //   // Webguid: testPay,
    //   email: formFields.email,
    //   mobile: formFields.mobile,
    //   wallet: formFields.wallet,
    //   userName: formFields.userName,
    //   PayerName: props.data.bulkBill.PayerName,
    //   paymentRef: txRef,
    //   ParentGUid: props.data.bulkBill.ParentGUid,
    //   TotalDue: props.data.AmountDue,
    // });
  }

  const isAmountEditable = false;

  const updateOTPValue = (e: string) => {
    setUserOTPValue(e);
  }

  useEffect(() => {
    let amountToUse = amount.replaceAll(",", "");
    setAmountToPay(amountToUse);
    let charge = (props.data.settings.percentage * +amountToUse / 100);
    if (charge < props.data.settings.min) {
      setServiceCharge(props.data.settings.min);
    } else if (charge > props.data.settings.max) {
      setServiceCharge(props.data.settings.max);
    } else {
      setServiceCharge(charge);
    }
  }, [amount])

  const updateAmountToPay = (e: any) => {
    let value = e.target.value;
    // Replace everything except digits and a single dot
    // value = value.replace(/[^0-9]./g, '');

    // // Allow only one dot in the value
    // const parts = value.split(".");
    // if (parts.length > 2) {
    //   value = parts[0] + "." + parts.slice(1).join("");
    // }

    let target = value;

    setAmountToPay(target);
    let charge = (props.data.settings.percentage * target / 100);
    if (target <= props.data.AmountDue.replaceAll(",", "")) {
      if (charge < props.data.settings.min) {
        setServiceCharge(props.data.settings.min);
      } else if (charge > props.data.settings.max) {
        setServiceCharge(props.data.settings.max);
      } else {
        setServiceCharge(charge);
      }
    }
  }

  return (
    <div className="flex flex-col py-10">
      {
        displayPaymentContent ?
          <div>
            <h1 className="font-bold text-2xl text-center">Revenue Collection</h1>
            <form className="flex flex-col gap-10">
              <div
                className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-3"
              >
                <div className="flex flex-col gap-2">
                  <p className="font-medium">Billing Reference *</p>
                  <TextInput className="h-[4rem]"
                    disabled
                    value={props.tx_reference}
                    placeholder=""
                  />
                </div>

                {/* <div className="flex flex-col gap-2">
                  <p className="font-medium">Agency Code *</p>
                  <TextInput className="h-[4rem]" disabled value={props.data.AgencyCode} placeholder="" />
                </div> */}

                <div className="flex flex-col gap-2">
                  <p className="font-medium">Total Amount*</p>
                  <TextInput className="h-[4rem]" disabled value={props.data.AmountDue} placeholder="" />
                </div>

                <div className="flex flex-col gap-2">
                  <p className="font-medium">{`Payer's Name *`}</p>
                  <TextInput className="h-[4rem]"
                    disabled
                    value={props.data.PayerName}
                    placeholder=""
                  />
                </div>

                {/* <div className="flex flex-col gap-2">
                  <p className="font-medium">Rev Code *</p>
                  <TextInput className="h-[4rem]" disabled value={props.data.RevenueCode} placeholder="" />
                </div> */}
                <div className="flex flex-col gap-2">
                  <p className="font-medium">Agency Name</p>
                  <TextInput className="h-[4rem]" disabled value={props.data.AgencyName} placeholder="" />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="font-medium">Revenue Name</p>
                  <TextInput className="h-[4rem]" disabled value={props.data.RevName} placeholder="" />
                </div>

                <div className="flex flex-col gap-2">
                  <p className="font-medium">Amount *</p>
                  <TextInput className="h-[4rem]"
                    inputMode="numeric"
                    disabled
                    value={props.data.AmountDue}
                    placeholder="Enter your amount"
                  />
                </div>
                {/* <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">Total Amount</p>
                    <p className="text-sm text-green-500">
                      Service charge: #
                      {calculatedServiceCharge.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      and stamp duty: #{stampDuty}
                    </p>
                  </div>
                  <TextInput className="h-[4rem]" disabled defaultValue={props.data.AmountDue} />
                </div> */}
              </div>
            </form>

            <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-3">
              <div className="flex flex-col gap-2">
                <p className="font-medium">Phone Number *</p>
                <TextInput className="h-[4rem]"
                  onChange={(event) =>
                    setFormFields((value) => ({
                      ...value,
                      mobile: event.target.value,
                    }))
                  }
                  inputMode="tel"
                  autoComplete="tel"
                  defaultValue={formFields.mobile}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="flex flex-col gap-2">
                <p className="font-medium">Email *</p>
                <TextInput className="h-[4rem]"
                  onChange={(event) =>
                    setFormFields((value) => ({
                      ...value,
                      email: event.target.value,
                    }))
                  }
                  inputMode="email"
                  autoComplete="email"
                  defaultValue={formFields.email}
                  placeholder="Enter your email"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <p className="font-medium">Amount to Pay</p>
                  <p className="text-base text-green-500">
                    Service charge: #{serviceCharge.toFixed(2)}
                  </p>
                </div>
                <TextInput className="h-[4rem]"
                  inputMode="numeric"
                  disabled
                  value={amountToPay}
                  placeholder="Enter your amount"
                />
                {/* <TextInput className="h-[4rem]" type="number" value={amountToPay} name="amountToPay"
                  onChange={updateAmountToPay} /> */}
              </div>
            </div>
            <div className="flex gap-4 flex-col-reverse md:gap-8 md:flex-row justify-center mt-10">
              <div>
                <Button
                  type="button"
                  disabled={isLoading}
                  onClick={toggleWalletModal}
                  className="w-full mb-5 h-auto py-5 mt-8 self-center"
                  variant="contained"
                >
                  {isLoading ? `Please wait...` : `Pay With Wallet Balance`}
                </Button>
              </div>
              {/* <Button
                  disabled={isLoading}
                  onClick={submitForm}
                  className="w-60 h-12 mt-8 self-center"
                  variant="contained"
                >
                  {isLoading ? `Please wait...` : `Online Payment`}
                </Button> */}
            </div>
          </div>
          :
          <div>
            {/* {harmonizeNotificationData.Receipts.map((receipt, index) => ( */}
            {
              walletReceiptBox?.length ?
                walletReceiptBox?.map((receipt: string, index: number) => (
                  <div className="space-y-10" key={index} >
                    <GenerateReceipt
                      isMultiple={
                        index !== walletReceiptBox - 1
                      }
                      data={{
                        amount: String(amountToPay),
                        url: receipt,
                        billingReference: txRef,
                        paymentTime: new Date().toString(),
                        senderName: props.data.PayerName,
                      }}
                    />
                    <Divider className="w-full h-[1px] bg-gray-200" />
                  </div>
                )) :
                <div>
                  <GenerateReceipt
                    // isMultiple={
                    //   index !== walletReceiptBox - 1
                    // }
                    data={{
                      amount: String(amountToPay),
                      url: transactionInfo?.ReceiptNumber,
                      billingReference: txRef,
                      paymentTime: new Date().toString(),
                      senderName: props.data.PayerName,
                    }}
                  />
                </div>
            }
          </div>
      }
      <Modal footer={null} open={payWithWalletModal} onClose={closeWalletModal} className="payment-modal">
        <div>
          <div className="modal-header">
            <div className="pt-5 px-5 pb-2">
              <div>
                <h4 className="text-2xl mb-4 font-bold text-center">Complete Payment</h4>
                <p className="text-center text-lg">You have {formatAmount(user?.wallet?.availableBalance ? user?.wallet?.availableBalance : "")} in your wallet balance.</p>
              </div>
            </div>
          </div>
          <div className="px-5 pb-2">
            <div>
              <div className="mt-10">
                <p className="font-medium text-sm mb-2">Enter Transaction PIN</p>
                <OTPInputBoxes updateOTP={updateOTPValue} count={4} value={userOTPValue} />
              </div>
              <div>
                <div className="flex flex-col justify-center">
                  <Button
                    disabled={isWalletPaymentLoading}
                    onClick={completePayment}
                    className="w-full py-5 mt-10 self-center"
                    variant="contained"
                  >
                    {isWalletPaymentLoading ? `Please wait...` : `Complete Payment`}
                  </Button>
                  <Button
                    onClick={closeWalletModal}
                    className="w-full py-5 self-center text-danger"
                    variant="text"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal >
    </div >
  );
}

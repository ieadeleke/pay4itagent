// import {
//     InputProps,
//     RegularTextInput,
//   } from "@/components/input/RegularTextInput";
//   import { cn } from "@/lib/utils";
//   import Button from "@/components/buttons";
//   import { useRouter, useSearchParams } from "next/navigation";
//   import { ChangeEvent, useContext, useEffect, useMemo, useState } from "react";
//   import { isEmail } from "@/utils/validation/validation";
//   import { Reference } from "@/models/reference";
//   import Pay4ItLogo from "@/assets/images/pay_4_it_logo.png";
//   import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
//   import {
//     FLUTTERWAVE_LIVE_KEY,
//     FLUTTERWAVE_TEST_KEY,
//     config,
//   } from "@/utils/data/flutterwave.config";
//   import GlobalContext from "@/context/GlobalContext";
//   import { Payment } from "@/models/payment";
//   import moment from "moment";
//   import { useInitiatePaymentWithUpperlink } from "@/utils/apiHooks/charge/useInitiatePaymentWithUpperlink";
  
//   const TextInput = ({ className, ...props }: InputProps) => (
//     <RegularTextInput className={cn("w-full md:w-96", className)} {...props} />
//   );
  
//   type PaymentContentProps = {
//     tx_reference: string;
//     mda?: string;
//     data: Reference;
//   };
  
//   interface PaymentPropInterface {
//     RevName: string;
//     PayerName: string;
//     AmountDue: string;
//     AgencyName: string;
//   }
  
//   export default function PaymentContent(props: PaymentContentProps) {
//     const router = useRouter();
//     const [formFields, setFormFields] = useState({
//       tx_reference: "",
//       phone: "",
//       email: "",
//       amount: "0",
//     });
//     const [isAboveLimit, setIsAboveLimit] = useState(false);
//     const [paymentData, setPaymentData] = useState<PaymentPropInterface>({
//       RevName: "",
//       PayerName: "",
//       AmountDue: "",
//       AgencyName: ""
//     });
//     const { showSnackBar } = useContext(GlobalContext);
//     const {
//       isLoading: isPaymentLoading,
//       data,
//       error: paymentError,
//       initiatePaymentWithUpperlink,
//     } = useInitiatePaymentWithUpperlink();
//     const callbackUrl = useSearchParams().get("callbackUrl");
//     const tx_referenceParams = useSearchParams().get("tx_reference");
  
//     useEffect(() => {
//       if (props.data) {
//         setPaymentData(props.data);
//       }
//     }, [props.data]);
  
//     useEffect(() => {
//       if (data) {
//         completePayment(data);
//       }
//     }, [data]);
  
//     const amount = useMemo(
//       () =>
//         isNaN(parseInt(formFields.amount))
//           ? 0
//           : parseInt(formatAmount(formFields.amount)),
//       [formFields.amount]
//     );
  
//     const calculatedServiceCharge = useMemo(() => {
//       if (props.data) {
//         const total = amount * (props.data.settings.percentage / 100);
  
//         if (props.data.maxAmountCharge) {
//           return Math.min(
//             props.data.settings.max,
//             Math.max(props.data.settings.min, total)
//           );
//         } else {
//           return Math.max(props.data.settings.min, total);
//         }
//       } else return 0;
//     }, [props.data?.settings?.min, amount]);
  
//     const stampDuty = 50;
  
//     // const serviceCharge = useMemo(() => {
//     //     if (props.data) {
//     //         if (props.data.ConsultantSubAccount) {
//     //             return 0
//     //         }
//     //         return calculatedServiceCharge
//     //     } else return 0;
//     // }, [props.data?.settings?.min, formFields.amount]);
  
//     const actualAmount = useMemo(
//       () => amount + stampDuty + calculatedServiceCharge,
//       [amount, calculatedServiceCharge]
//     );
  
//     function completePayment(data: Payment) {
//       payNow({
//         callback(data) {
//           closePaymentModal();
//           setTimeout(() => {
//             if (data.status == "successful" || data.status == "completed") {
//               router.push(
//                 `/payment/generate-receipt?reference=${data.tx_ref}&tx_id=${data.transaction_id
//                 }${props.mda ? `&mda=${props.mda}` : ""}${callbackUrl ? `&callbackUrl=${callbackUrl}` : ""
//                 }`
//               );
//             } else {
//               showSnackBar({
//                 severity: "error",
//                 message: `Could not complete transaction`,
//               });
//             }
//           }, 1000);
//         },
//         onClose() { },
//       });
//     }
  
//     const subAccounts = data?.subaccounts;
  
//     const publicKey = useMemo(() => {
//       if (!props.mda) {
//         return FLUTTERWAVE_LIVE_KEY;
//       } else if (props.mda.toLowerCase().includes("test")) {
//         return FLUTTERWAVE_TEST_KEY;
//       } else return FLUTTERWAVE_LIVE_KEY;
//     }, [props.mda]);
  
//     const payNow = useFlutterwave({
//       ...config,
//       public_key: publicKey,
//       amount: actualAmount,
//       tx_ref: data?.paymentRef ?? new Date().toISOString(),
//       customer: {
//         ...config.customer,
//         id: formFields.tx_reference,
//         name: props.data ? props.data.PayerName : "",
//         email: formFields.email,
//         phone_number: formFields.phone,
//       },
//       customizations: props.data
//         ? {
//           title: props.data.AgencyName,
//           description: `Payment for ${props.data.AgencyName}`,
//           logo: Pay4ItLogo.src,
//         }
//         : config.customizations,
//     } as any);
  
//     const isLoading = useMemo(() => isPaymentLoading, [isPaymentLoading]);
  
//     const error = useMemo(() => paymentError, [paymentError]);
  
//     useEffect(() => {
//       if (error) {
//         showSnackBar({ severity: "error", message: error });
//       }
//     }, [error]);
  
//     useEffect(() => {
//       if (tx_referenceParams) {
//         setFormFields((value) => ({
//           ...value,
//           tx_reference: tx_referenceParams as string,
//         }));
//       }
//     }, [tx_referenceParams]);
  
//     function formatAmount(amount: string) {
//       return parseInt(amount.replace(/,/g, ""), 10).toString();
//     }
  
//     useEffect(() => {
//       if (props.data) {
//         setFormFields((value) => ({
//           ...value,
//           amount: formatAmount(props.data.AmountDue),
//         }));
//       }
//     }, [props.data]);
  
//     useEffect(() => {
//       if (props.data) {
//         const { AmountDue } = props.data;
//         setIsAboveLimit(amount < 1 || amount > parseInt(formatAmount(AmountDue)));
//       }
//     }, [props.data, amount]);
  
//     function onSubmit(event: ChangeEvent<HTMLFormElement>) {
//       event.preventDefault();
//       handlePayNow();
//     }
  
//     function submitForm() {
//       if (!isEmail(formFields.email)) {
//         return alert("Invalid Email");
//       } else if (formFields.phone.length < 11) {
//         return alert("Invalid Phone Number");
//       }
//       handlePayNow();
//     }
  
//     function updateAmount(amount: string) {
//       setFormFields((value) => ({
//         ...value,
//         amount: amount.trim(),
//       }));
//     }
  
//     function handlePayNow() {
//       initiatePaymentWithUpperlink({
//         type: props.mda ? "mda" : "regular",
//         apiKey: props.mda,
//         AgencyCode: props.data.AgencyCode,
//         AgencyName: props.data.AgencyName,
//         PayerName: props.data.PayerName,
//         RevenueCode: props.data.RevenueCode,
//         reference: formFields.tx_reference,
//         OraAgencyRev: props.data.OraAgencyRev,
//         RevName: props.data.RevName,
//         amountPaid: amount,
//         email: formFields.email,
//         paymentRef: moment().unix().toString(),
//         mobile: formFields.phone,
//         serviceCharge: calculatedServiceCharge.toString(),
//         CbnCode: props.data.CbnCode,
//         Pid: props.data.Pid,
//         CreditAccount: props.data.CreditAccount,
//       });
//     }
  
//     const isAmountEditable = useMemo(() => !props.data.fixAmount, [props.data]);
  
//     const isValidAmount = useMemo(() => {
//       const { data } = props;
//       if (data.fixAmount) {
//         return amount == parseInt(formatAmount(data.AmountDue));
//       } else return true;
//     }, [props.data, amount]);
  
//     return (
//       <div className="flex flex-col">
//         <h1 className="font-bold text-2xl text-center">Revenue Collection</h1>
  
//         <form
//           onSubmit={onSubmit}
//           className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2"
//         >
//           <div className="flex flex-col gap-2">
//             <p className="font-medium">Billing Reference *</p>
//             <TextInput disabled value={formFields.tx_reference} placeholder="" />
//           </div>
  
//           <div className="flex flex-col gap-2">
//             <p className="font-medium">Agency Name *</p>
//             <TextInput disabled value={paymentData?.AgencyName} placeholder="" />
//           </div>
  
//           <div className="flex flex-col gap-2">
//             <p className="font-medium">Amount Due *</p>
//             <TextInput disabled value={paymentData?.AmountDue} placeholder="" />
//           </div>
  
//           <div className="flex flex-col gap-2">
//             <p className="font-medium">{`Payer's Name *`}</p>
//             <TextInput disabled value={paymentData?.PayerName} placeholder="" />
//           </div>
  
//           <div className="flex flex-col gap-2">
//             <p className="font-medium">Rev Name *</p>
//             <TextInput disabled value={paymentData?.RevName} placeholder="" />
//           </div>
  
//           <div className="flex flex-col gap-2">
//             <p className="font-medium">Amount *</p>
//             <TextInput
//               onChange={(event) => updateAmount(event.target.value)}
//               inputMode="numeric"
//               disabled={!isAmountEditable}
//               value={formFields.amount}
//               placeholder="Enter your amount"
//             />
  
//             {isAboveLimit ? (
//               <p className="text-sm text-red-500">
//                 Amount must be between 1 and {props.data.AmountDue}
//               </p>
//             ) : (
//               props.data.settings.addServiceCharge && (
//                 <p className="text-sm text-green-500">
//                   Service charge: #
//                   {calculatedServiceCharge.toLocaleString("en-US", {
//                     minimumFractionDigits: 2,
//                     maximumFractionDigits: 2,
//                   })}{" "}
//                   and stamp duty : #{stampDuty}
//                 </p>
//               )
//             )}
//           </div>
  
//           <div className="flex flex-col gap-2">
//             <p className="font-medium">Phone Number *</p>
//             <TextInput
//               onChange={(event) =>
//                 setFormFields((value) => ({
//                   ...value,
//                   phone: event.target.value,
//                 }))
//               }
//               inputMode="tel"
//               autoComplete="phone"
//               defaultValue={formFields.phone}
//               placeholder="Enter your phone number"
//             />
//           </div>
  
//           <div className="flex flex-col gap-2">
//             <p className="font-medium">Email *</p>
//             <TextInput
//               onChange={(event) =>
//                 setFormFields((value) => ({
//                   ...value,
//                   email: event.target.value,
//                 }))
//               }
//               inputMode="email"
//               defaultValue={formFields.email}
//               placeholder="Enter your email"
//             />
//           </div>
//         </form>
  
//         <Button
//           disabled={isLoading || !isValidAmount || isAboveLimit}
//           onClick={submitForm}
//           className="w-60 h-12 mt-8 self-center"
//           variant="contained"
//         >
//           {isLoading ? `Please wait...` : `Submit`}
//         </Button>
//       </div>
//     );
//   }
  
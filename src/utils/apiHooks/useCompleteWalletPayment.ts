import { useState } from "react";
import { ChargeService } from "@/utils/services/charge";
import { Payment } from "@/models/payment";
import { UpperLinkPaymentNotificationParams, UpperLinkWalletPaymentNotificationParams } from "@/utils/services/charge/types";
import { errorHandler } from "@/utils/errorHandler";
import { useRouter } from "next/navigation";
import { useApi } from ".";

export const useHarmonizeNotification = () => {
  const [data, setData] = useState<(Payment & { Receipts: string[], ReceiptNumber?: string }) | null>(
    null
  );
  const { isLoading, error,execute } = useApi();
  // const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function harmonizeWalletNotification(params: any) {
    setData(null);
    // setError(null);
    const response = await execute(
      () => ChargeService().harmonizeWalletNotification(params)
      // {
      //   onError(error: any) {
      //     console.log(error);
      //     const parsedError = errorHandler(error);
      //     console.log(parsedError)
      //     if (parsedError.status == 402) {
      //       console.log('yo')
      //       setError("Payment failed");
      //       setTimeout(() => {
      //         router.replace(`/payment`);
      //       }, 1000);
      //     } else {
      //       console.log('issue')
      //       setError(parsedError.message);
      //     }
      //   },
      // }
    );
    if (response) {
      setData({
        ...response.payload,
        Receipts: response.Receipt,
        ReceiptNumber: response.ReceiptNumber ? response.ReceiptNumber : ""
      });
    }
  }

  return { isLoading, error, data, harmonizeWalletNotification };
};
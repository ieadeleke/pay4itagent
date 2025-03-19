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
  const { isLoading, error, execute } = useApi();
  const router = useRouter();

  async function harmonizeWalletNotification(params: any) {
    setData(null);
    const response = await execute(
      () => ChargeService().singleBillWalletNotification(params));
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
import { useState } from "react";
import { useApi } from "../index";
import { ChargeService } from "@/utils/services/charge";
import { Payment } from "@/models/payment";
import { InitiateHarmonizedPaymentParams } from "@/utils/services/charge/types";

export const useInitiateHarmonizePayment = () => {
  const [data, setData] = useState<Payment[] | null>(null);
  const { isLoading, error, execute } = useApi();

  async function initiatePaymentWithUpperlink(
    params: InitiateHarmonizedPaymentParams
  ) {
    setData(null);
    const response = await execute(() =>
      ChargeService().initiateSinglePayment(params)
    );
    if (response) {
      setData(response.Transaction);
    }
  }

  return { isLoading, error, data, initiatePaymentWithUpperlink };
};

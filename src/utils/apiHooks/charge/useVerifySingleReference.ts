import { useState } from "react";
import { useApi } from "../index";
import { ChargeService } from "@/utils/services/charge";
import { Reference } from "@/models/reference";
import { VerifyHarmonizeReferenceParams } from "@/utils/services/charge/types";

export const useVerifyHarmonizeReference = () => {
  const [data, setData] = useState<Reference | null>(null);
  const { isLoading, error, execute } = useApi();

  async function verifyReference(params: VerifyHarmonizeReferenceParams) {
    setData(null);
    const response = await execute(async () =>
      ChargeService().verifySingleReference(params)
    );
    if (response) {
      setData(response);
    }
  }

  return { isLoading, error, data, verifyReference };
};
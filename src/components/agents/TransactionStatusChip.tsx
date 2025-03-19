import { StatusChip } from "@/components/chips/StatusChip";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

export type TransactionStatus = "success" | "fail" | "pending"
type InspectionStatusChipProps = {
  status: TransactionStatus;
};

export const TransactionStatusChip = (props: InspectionStatusChipProps) => {
  const { status } = props;

  const statusStyles = useMemo(() => {
    switch (status) {
      case "pending":
        return {
          container: "bg-yellow-100",
          label: "text-yellow-900",
        };
      case "fail":
        return {
          container: "bg-red-200",
          label: "text-red-900",
        };
      default:
        return {
          container: "bg-blue-100",
          label: "text-blue-950",
        };
    }
  }, [status]);

  const statusText = useMemo(() => {
    // return status.toUpperCase();
    return status;
  }, [status]);

  return (
    <StatusChip.Container className={statusStyles.container}>
      <StatusChip.Label className={cn("text-center py-2 text-xs", statusStyles.label)}>
        {statusText}
      </StatusChip.Label>
    </StatusChip.Container>
  );
};

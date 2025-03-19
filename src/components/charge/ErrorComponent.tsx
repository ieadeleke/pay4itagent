import { useRouter } from "next/router";
import Button from "../buttons";

type Error = {
  status: number;
  message: string;
};

type ErrorComponentProps = {
  data: Error;
  onError?: () => void
};

export const ErrorComponent = (props: ErrorComponentProps) => {
  const router = useRouter();
  const { data } = props;

  function reloadPage() {
    router.reload();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center flex flex-col">
        <h1 className="font-bold text-3xl">Something went wrong</h1>
        <p>{data.message}</p>
      </div>
      <Button onClick={props.onError ?? reloadPage} className="h-12" variant="contained">
        Try Again
      </Button>
    </div>
  );
};

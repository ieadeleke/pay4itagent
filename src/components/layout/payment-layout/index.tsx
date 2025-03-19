import { NavBar } from "./NavBar";

type PaymentLayoutProps = {
  children?: React.ReactNode;
};

export const PaymentLayout = (props: PaymentLayoutProps) => {
  return (
    <div className="relative mx-auto  max-w-[2000px]">
      <div className="sticky top-0 z-[2]">
        <NavBar />
      </div>
      {props.children}
    </div>
  );
};

import Logo from "@/assets/images/pay_4_it_logo.png";
import Link from "next/link";

export const NavBar = () => {
  return (
    <div className="flex items-center bg-white h-20 p-4 px-2 md:px-8">
      <Link href="/">
        <div className="flex items-center gap-2">
          <img src={Logo.src} className="text-secondary" />
        </div>
      </Link>
      <div className="flex-1" />
    </div>
  );
};

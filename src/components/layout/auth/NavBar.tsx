import Logo from "@/assets/images/pay_4_it_logo.png";
import Link from "next/link";
import Button from "@/components/buttons";
import { MenuIcon } from "lucide-react";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@/components/ui/popover";
import { usePathname } from "next/navigation";

export const NavBar = () => {
  const pathname = usePathname();

  return (
    <div className="flex items-center bg-white h-20 p-4 px-2 md:px-8">
      <Link href="/">
        <div className="flex items-center gap-2">
          <img src={Logo.src} className="text-secondary" />
        </div>
      </Link>
      <div className="flex-1" />
      <div className="hidden items-center gap-8 text-black font-semibold lg:flex">
        <Link href={"/"}>Company</Link>
        <Link href={"/contact-us"}>Contact Us</Link>
        <Link href={"/faqs"}>FAQs</Link>
        <Link href={"/ecommerce"}>E-Commerce</Link>
        <Link href={"/payroll"}>Payroll</Link>
      </div>

      <div className="flex-1" />

      <Popover>
        <PopoverTrigger className="p-0 m-0 md:hidden">
          <div className="text-gray-200 rounded-full">
            <div className="relative">
              <MenuIcon className="text-black" />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="bg-white z-[2]">
          <div className="flex flex-col gap-2">
            <Link href={"/"}>Company</Link>
            <Link href={"/contact-us"}>Contact Us</Link>
            <Link href={"/faqs"}>FAQs</Link>
            <Link href={"/ecommerce"}>E-Commerce</Link>
            <Link href={"/payroll"}>Payroll</Link>
          </div>
        </PopoverContent>
      </Popover>
      <div className="flex items-center gap-4">
        {pathname !== "/signup" && (
          <Link href={"/signup"}>
            <Button className="font-bold w-36 rounded-lg h-12 hidden md:block">
              Get Started
            </Button>
          </Link>
        )}

        {pathname !== "/login" && (
          <Link href={"/login"}>
            <Button
              variant="outlined"
              className="font-bold w-36 rounded-lg h-12 hidden md:block"
            >
              LogIn
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

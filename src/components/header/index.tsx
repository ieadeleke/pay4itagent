import Link from "next/link";
import Button from "../buttons";
import ArrowIcon from "../../assets/icons/ic_arrow_circle_right.svg";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"

const pages = [
  {
    name: "About Us",
    href: "/about",
  },
  // {
  //   name: "Our Solutions",
  //   href: "/our-solutions",
  // },
  // {
  //   name: "API Documentation",
  //   href: "/documentation",
  // },
  {
    name: "Contact Us",
    href: "/contact-us",
  },
];
import LogoIcon from "../../assets/icons/ic_logo_flat.svg";
import { MenuIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type HeaderProps = {
  className?: string;
  navLinkClassName?: string;
  logoClassName?: string;
  getStartedClassName?: string;
};

export const Header = ({
  className,
  navLinkClassName,
  logoClassName,
  getStartedClassName,
  ...props
}: HeaderProps) => {
  const [navbarClass, setNavbarClass] = useState("rounded-[23px]");
  const [navMarginEdges, setNavMarginEdges] = useState(
    "rounded-[23px] md:mx-10 lg:mx-20"
  );

  const handleScroll = () => {
    if (window.scrollY > 20) {
      setNavbarClass("rounded-none");
      setNavMarginEdges("mx-0 md:mx-0 lg:mx-0");
    } else {
      setNavbarClass("rounded-[23px]");
      setNavMarginEdges("mx-2 md:mx-10 lg:mx-20");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`flex transition-all ease-linear flex-col sticky top-0 mt-2 z-10 ${navMarginEdges} md:gap-16 md:mt-10`}
    >
      <div
        className={cn(
          `flex bg-white items-center justify-between px-4 py-4 ${navbarClass} md:px-8 lg:px-16`,
          className
        )}
      >
        <Link href="/">
          <LogoIcon className={cn("text-primary", logoClassName)} />
        </Link>

        <div
          className={cn("hidden gap-8 text-primary lg:flex", navLinkClassName)}
        >
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-satoshi font-bold bg-white">Payments</NavigationMenuTrigger>
                <NavigationMenuContent className="flex flex-col bg-white !w-60">
                  <Link
                    className="w-full font-satoshi font-bold text-primary px-4 py-2 hover:bg-gray-100"
                    href={"/payment/collection"}
                  >
                    Make Payment
                  </Link>

                  <Link
                    className="w-full font-satoshi font-bold text-primary px-4 py-2 hover:bg-gray-100"
                    href={"/payment/generate-receipt"}
                  >
                    Generate Receipt
                  </Link>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          {pages.map((item) => (
            <Link
              className="font-satoshi font-bold"
              key={item.name}
              href={item.href}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <Button
          variant="contained"
          className={cn(
            "hidden bg-primary text-primary px-4 py lg:block",
            getStartedClassName
          )}
        >
          <Link href={"/payment/collection"} className="flex items-center">
            <p>Get Started</p>
            <ArrowIcon />
          </Link>
        </Button>

        <MenuIcon className="text-primary lg:hidden" />
      </div>
    </div>
  );
};

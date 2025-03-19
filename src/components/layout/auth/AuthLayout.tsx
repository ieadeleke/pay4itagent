import { NavBar } from "./NavBar";

type AuthLayoutProps = {
  children?: JSX.Element;
  showSearchBar?: boolean;
  rightSideBar?: JSX.Element;
  showNavBar?: boolean;
};

export default function AuthLayout(props: AuthLayoutProps) {
  return (
    <div className="flex flex-col relative max-w-[2000px] bg-r mx-auto h-screen">
      <NavBar />
      <div className="px-3 py-8 w-full relative flex flex-col justify-center flex-1 items-center md:px-8 md:py-8">
        <div className="w-[400px]">{props.children}</div>
      </div>
    </div>
  );
}

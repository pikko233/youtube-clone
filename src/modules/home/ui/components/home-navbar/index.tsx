import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { SearchInput } from "./search-input";
import { AuthButton } from "@/modules/auth/ui/components/auth-button";

export const HomeNavbar = () => {
  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center px-2 pr-5 z-50">
      <div className="flex items-center gap-4 w-full">
        {/* 菜单和Logo */}
        <div className="flex items-center shrink-0">
          <SidebarTrigger />
          <Link href="/" className="hidden md:block">
            <div className="p-2 flex items-center gap-1">
              <Image src="/logo.svg" height={32} width={32} alt="Logo" />
              <p className="text-xl font-semibold tracking-tight">NewTube</p>
            </div>
          </Link>
        </div>

        {/* 搜索框 */}
        <div className="flex-1 flex justify-center max-w-[720px] mx-auto">
          <SearchInput />
        </div>

        {/* 登录按钮 */}
        <div className="shrink-0 items-center flex gap-4">
          <AuthButton />
        </div>
      </div>
    </div>
  );
};

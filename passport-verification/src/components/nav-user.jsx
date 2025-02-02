"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  KeyRound,
  UserRound,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Cookies from "react-cookies";
import { useEffect, useState } from "react";
import Image from "next/image";
import PoliceMan from "@/assets/policeman.png";

export function NavUser() {
  const name = Cookies.load("name");
  const ps = Cookies.load("ps");
  const district = Cookies.load("district");
  const type = Cookies.load("type");
  const [user, setUser] = useState(null);

  const { isMobile } = useSidebar();

  useEffect(() => {
    try {
      setUser({
        name,
        ps,
        district,
        type
      });
    } catch (error) {
      setUser({});
    }
  }, []);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-auto ml-auto"
            >
              <div className="bg-slate-300 rounded-full p-1">
                <Image className="size-10 bg-slate-300 rounded-full" src={PoliceMan} alt="P"/>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user?.name} {user?.type == 10 ? '(District Nodal)' : user?.type == 40 ? '(EO)' : user?.type == 30 ? '(OC)' : user?.type == 20 ? '(SP)' : user?.type == 40 ? '(EO)' : user?.type == 50 ? '(SE)' : ''}
                </span>
                <span className="truncate text-xs">
                  District: {user?.district}
                </span>
                {(user?.type != 10 && user?.type != 20)  && <span className="truncate text-xs">
                  Police Station: {user?.ps}
                </span>}
              </div>
              {/* <ChevronsUpDown className="ml-auto size-4" /> */}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className="bg-slate-300 rounded-full p-2">
                  <UserRound className="size-4 bg-slate-300 text-white" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-xs">
                    District: {user?.district}
                  </span>
                  <span className="truncate text-xs">
                    Police Station: {user?.ps}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/logout" className="bg-primary">
              <DropdownMenuItem>
                <LogOut />
                Logout
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

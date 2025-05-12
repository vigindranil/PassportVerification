"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  KeyRound,
  UserRound,
  UserPlus,
  Info,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import Link from "next/link";
import Cookies from "react-cookies";
import Image from "next/image";
import { useEffect, useState } from "react";
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
                <Image className="size-10 bg-slate-300 rounded-full" src={PoliceMan} alt="P" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                {user?.name} {user?.type == 10 ? '(District Nodal)' : user?.type == 40 ? '(EO)' : user?.type == 30 ? '(OC)' : user?.type == 20 ? '(SP)' : user?.type == 40 ? '(EO)' : user?.type == 50 ? '(SE)' : ''}
                </span>
                <span className="truncate text-xs">District: {user?.district}</span>
                {![10, 20, 50]?.includes(user?.type) && (
                  <span className="truncate text-xs">{user?.ps ? `Police Station: ${user?.ps}` : '' }</span>
                )}
              </div>
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
                  <UserRound className="size-4 text-white" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-xs">District: {user?.district}</span>
                  {![10, 20, 50].includes(user?.type) && (
                    <span className="truncate text-xs">{user?.ps ? `Police Station: ${user?.ps}` : '' }</span>
                  )}
                </div>
              </div>
            </DropdownMenuLabel>

            {/* Submenu */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex items-center gap-2">
                <Info className="size-4" />
                <span>User Manuals</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem><a href="https://wb-passport-verify.s3.ap-south-1.amazonaws.com/user_manual_district_nodal" target="_blank">For District Nodal User</a></DropdownMenuItem>
                <DropdownMenuItem><a href="https://wb-passport-verify.s3.ap-south-1.amazonaws.com/user_manual_eo" target="_blank">For EO/DIO User</a></DropdownMenuItem>
                <DropdownMenuItem><a href="https://wb-passport-verify.s3.ap-south-1.amazonaws.com/user_manual_oc" target="_blank">For OC/IC User</a></DropdownMenuItem>
                <DropdownMenuItem><a href="https://wb-passport-verify.s3.ap-south-1.amazonaws.com/user_manual_sp" target="_blank">For SP/DIB User</a></DropdownMenuItem>
                <DropdownMenuItem><a href="https://wb-passport-verify.s3.ap-south-1.amazonaws.com/user_manual_spl_eo" target="_blank">For Spl. EO User</a></DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator />

            {/* Submenu */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex items-center gap-2">
                <Info className="size-4" />
                <span>Guidelines</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem><a href="https://wb-passport-verify.s3.ap-south-1.amazonaws.com/citizen_type_1_(1950-01-26_to_1987-06-30)" target="_blank">For Citizen by Birth (26/01/1950 to 30/06/1987)</a></DropdownMenuItem>
                <DropdownMenuItem><a href="https://wb-passport-verify.s3.ap-south-1.amazonaws.com/citizen_type_1_(1987-07-01_to_2004-12-02)" target="_blank">For Citizen by Birth (01/07/1987 to 02/12/2004)</a></DropdownMenuItem>
                <DropdownMenuItem><a href="https://wb-passport-verify.s3.ap-south-1.amazonaws.com/citizen_type_1_(2004-12-03_onwards)" target="_blank">For Citizen by Birth (from 03/12/2004 onwards)</a></DropdownMenuItem>
                <DropdownMenuItem><a href="https://wb-passport-verify.s3.ap-south-1.amazonaws.com/citizen_type_2_Citizen_by_Naturalization" target="_blank">For Citizen by Naturalization</a></DropdownMenuItem>
                <DropdownMenuItem><a href="https://wb-passport-verify.s3.ap-south-1.amazonaws.com/citizen_type_3_Citizen_by_Registration" target="_blank">For Citizen by Registration</a></DropdownMenuItem>
                <DropdownMenuItem><a href="https://wb-passport-verify.s3.ap-south-1.amazonaws.com/citizen_type_4_Citizen_by_Descent" target="_blank">For Citizen by Descent</a></DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href="/logout" className="flex items-center gap-2">
                <LogOut className="size-4" />
                Logout
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

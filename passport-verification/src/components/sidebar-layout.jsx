"use client"
import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/nav-user";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function SidebarLayout({
  breadcrumb = [{ href: "#", name: "Authority" }],
  children,
}) {
  const router = useRouter();
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-zinc-200">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1 bg-white" />
            {/* <button onClick={() => router.back()} className="flex items-center gap-2 p-2 border rounded-md hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button> */}
            <Separator orientation="vertical" className="mr-2 h-4 bg-slate-500" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumb.map((item, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbItem
                      className={`hidden md:block ${
                        index == breadcrumb.length - 1 && "text-blue-500"
                      }`}
                    >
                      <Link href={item.href}>{item.name}</Link>
                    </BreadcrumbItem>
                    {index !== breadcrumb.length - 1 && (
                      <BreadcrumbSeparator className="hidden md:block text-stone-700" />
                    )}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <NavUser />
        </header>
        <div>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

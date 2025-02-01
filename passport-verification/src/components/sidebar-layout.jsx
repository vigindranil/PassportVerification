"use client"

import React, { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { NavUser } from "@/components/nav-user"
import Link from "next/link"
import { ContentSkeleton } from "@/components/content-skeleton"

export default function SidebarLayout({ breadcrumb = [{ href: "#", name: "Authority" }], children }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleStart = () => setIsLoading(true)
    const handleComplete = () => setIsLoading(false)

    // Add event listeners
    window.addEventListener("beforeunload", handleStart)
    router.events?.on?.("routeChangeStart", handleStart)
    router.events?.on?.("routeChangeComplete", handleComplete)
    router.events?.on?.("routeChangeError", handleComplete)

    return () => {
      window.removeEventListener("beforeunload", handleStart)
      router.events?.off?.("routeChangeStart", handleStart)
      router.events?.off?.("routeChangeComplete", handleComplete)
      router.events?.off?.("routeChangeError", handleComplete)
    }
  }, [router])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-zinc-200">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumb.map((item, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbItem className={`hidden md:block ${index == breadcrumb.length - 1 && "text-blue-500"}`}>
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
        <div>{isLoading ? <ContentSkeleton /> : children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}


"use client";
import React, { Suspense, useEffect } from "react";
import Page from "./page";
import Loading from "./loading";
import SidebarLayout from "@/components/sidebar-layout";

const Layout = () => {
  useEffect(() => {}, []);

  const breadcrumb = [
    { href: "#", name: "Spl. Person Admin" },
    { href: "/dashboard-spl-person", name: "Dashboard" },
  ];

  return (
    <SidebarLayout breadcrumb={breadcrumb}>
      <Suspense fallback={<Loading />}>
        <Page />
      </Suspense>
    </SidebarLayout>
  );
};

export default Layout;

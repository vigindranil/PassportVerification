"use client";
import React, { Suspense, useEffect } from "react";
import Page from "./page";
import Loading from "./loading";
import SidebarLayout from "@/components/sidebar-layout";

const Layout = () => {
  useEffect(() => {}, []);

  const breadcrumb = [
    { href: "#", name: "State Admin" },
    { href: "/dashboard-stateadmin", name: "Dashboard" },
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

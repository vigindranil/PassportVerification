"use client";
import React, { Suspense, useEffect } from "react";
import Page from "./page";
import Loading from "./loading";
import SidebarLayout from "@/components/sidebar-layout";

const Layout = () => {
  useEffect(() => {}, []);

  const breadcrumb = [
    { href: "#", name: "District Nodal Authority" },
    { href: "/dashboard", name: "Dashboard" },
    { href: "#", name: "Create User" },
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

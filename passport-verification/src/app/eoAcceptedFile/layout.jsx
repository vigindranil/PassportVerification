"use client";
import React, { Suspense, useEffect, useState } from "react";
import Page from "./page";
import Loading from "./loading";
import SidebarLayout from "@/components/sidebar-layout";
import Cookies from "react-cookies";

const Layout = () => {
  const [dashoard, setDashboard] = useState({ href: "#", name: "Authority" });
    useEffect(() => {
      const type = Cookies.load('type');
      if (type == 10) {
        setDashboard({ href: "/dashboard", name: "District Nodal Authority" });
      }
      else if (type == 20) {
        setDashboard({ href: "/dashboard-sp", name: "SP Authority" });
      }else {
        setDashboard({ href: "#", name: "Authority" })
      }
    }, [Cookies]);

  const breadcrumb = [
    dashoard,
    { href: "/eoAcceptedFile", name: "Eo AcceptedFile" },
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

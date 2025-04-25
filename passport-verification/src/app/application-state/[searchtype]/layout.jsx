"use client";
import React, { Suspense, useEffect } from "react";
import Page from "./page";
import Loading from "./loading";
import SidebarLayout from "@/components/sidebar-layout";
import { use } from "react";
const searchTypeTitleMap = {
  0: "Total Applications District Wise",
  1: "Pending Applications District Wise",
  2: "Approved Applications District Wise",
};

const Layout = (props) => {
  const { searchtype } = use(props.params);
  //   const { searchtype } = params;
  console.log("searchTpe", searchtype);

  useEffect(() => {}, []);

  const breadcrumb = [
    { href: "#", name: "State Admin" },
    { href: "/dashboard-stateadmin", name: "Dashboard" },
    { href: "/dashboard-stateadmin", name: searchTypeTitleMap[searchtype] || "Applications Overview" },
  ];

  return (
    <SidebarLayout breadcrumb={breadcrumb}>
      <Suspense fallback={<Loading />}>
        <Page searchtype={searchtype} />
      </Suspense>
    </SidebarLayout>
  );
};

export default Layout;

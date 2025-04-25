"use client";
import React, { Suspense, useEffect } from "react";
import Page from "./page";
import Loading from "./loading";
import SidebarLayout from "@/components/sidebar-layout";
import { use } from "react";

const searchTypeTitleMap = {
  0: "Total Applications Police Station Wise",
  1: "Pending Applications Police Station Wise",
  2: "Approved Applications Police Station Wise",
};

const Layout = (props) => {
  const { typeid, searchtype } = use(props.params);
  //   const { searchtype } = params;
  console.log("searchTpe", typeid);

  useEffect(() => {}, []);

  const breadcrumb = [
    { href: "#", name: "State Admin" },
    { href: "/dashboard-stateadmin", name: "Dashboard" },
    {
      href: "/dashboard-stateadmin",
      name: searchTypeTitleMap[typeid] || "Applications Overview",
    },
  ];

  return (
    <SidebarLayout breadcrumb={breadcrumb}>
      <Suspense fallback={<Loading />}>
        <Page typeid={typeid} searchtype={searchtype} />
      </Suspense>
    </SidebarLayout>
  );
};

export default Layout;

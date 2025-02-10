"use client";
import React, { Suspense, useEffect, useState } from "react";
import Page from "./page";
import Loading from "./loading";
import SidebarLayout from "@/components/sidebar-layout";
import Cookies from "react-cookies";

const Layout = () => {
  const [dashboard, setDashboard] = useState("#");
  const [user, setUser] = useState("#");
  useEffect(() => {
    const type = Cookies.load('type');
    if (type == 10) {
      setDashboard("/dashboard")
      setUser("District Nodal Authority");
    }
    else if (type == 40) {
      setDashboard("/dashboard-eo")
      setUser("EO Authority")
    }
    else if (type == 30) {
      setDashboard("/dashboard-oc")
      setUser("OC/IO Authority")
    }
    else if (type == 20) {
      setDashboard("/dashboard-sp")
      setUser("SP Authority")
    }
    else if (type == 50) {
      setDashboard("/dashboard-se")
      setUser("Special Enquiry Authority")
    }else {
      setDashboard("#")
    }
  }, []);

  const breadcrumb = [
    { href: "#", name: user },
    { href: dashboard, name: "Dashboard" },
    { href: "#", name: "Verification Pending in EO" },
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

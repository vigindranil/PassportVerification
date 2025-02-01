"use client";
import React, { Suspense, useEffect } from "react";
import Page from "./page";
import Loading from "./loading";
import SidebarLayout from "@/components/sidebar-layout";
import Cookies from "react-cookies";

const Layout = () => {
  const [dashboard, setDashboard] = useState("#");
  useEffect(() => {
    const type = Cookies.load('type');
    if (type == 10) {
      setDashboard("/dashboard")
    }
    else if (type == 40) {
      setDashboard("/dashboard-eo")
    }
    else if (type == 30) {
      setDashboard("/dashboard-oc")
    }
    else if (type == 20) {
      setDashboard("/dashboard-sp")
    }
    else if (type == 50) {
      setDashboard("/dashboard-se")
    }else {
      setDashboard("#")
    }
  }, []);

  const breadcrumb = [
    { href: dashboard, name: "Dashboard" },
    { href: "#", name: "Pending Applications" },
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

"use client";

import React, { useEffect, useState } from "react";
import DashboardCards from "@/components/dashboardCard";
import Image from "next/image";
import BackgroundImg from "@/assets/passport-bg.jpg";
import { getStateDashBoard } from "./api";

import PieChartCard from "@/components/reusable-pie-chart";
export default function Dashboard() {
  const [data, setData] = useState(null);
  const [chart, setChart] = useState([]);
  useEffect(() => {
    const fetchDashboard = async () => {
      const response = await getStateDashBoard();
      setData(response?.data?.dashboardCount);
      setChart([
        {
          name: "Total",
          value: response?.data?.dashboardCount?.TotalApplications,
          fill: "#3B82F6", // blue-500
        },
        {
          name: "Pending",
          value: response?.data?.dashboardCount?.TotalPendingApplications,
          fill: "#F59E0B", // amber-500
        },
        {
          name: "Approved",
          value: response?.data?.dashboardCount?.TotalApplicationsDONE,
          fill: "#10B981", // emerald-500
        },
      ]);
    };
    fetchDashboard();
  }, []);
  const chartConfig = {
    value: {
      label: "Applications",
    },
    "Total Applications": {
      label: "Total Applications",
      color: "#3B82F6", // blue-500
    },
    "Pending Applications": {
      label: "Pending Applications",
      color: "#F59E0B", // amber-500
    },
    "Approved Applications": {
      label: "Approved Applications",
      color: "#10B981", // emerald-500
    },
  };


  // const chartData = [
  //   {
  //     name: "Total Applications",
  //     value: data?.TotalApplications,
  //     fill: "#3B82F6", // blue-500
  //   },
  //   {
  //     name: "Pending Applications",
  //     value: data?.TotalPendingApplications,
  //     fill: "#F59E0B", // amber-500
  //   },
  //   {
  //     name: "Approved Applications",
  //     value: data?.TotalApplicationsDONE,
  //     fill: "#10B981", // emerald-500
  //   },
  // ];


  return (
    <div className="flex h-full min-h-screen bg-gray-100">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 relative">
          <Image
            src={BackgroundImg}
            alt="Background Image"
            objectFit="cover"
            className="absolute opacity-10 inset-0 -z-2"
          />
          <div className="container mx-auto px-6 py-8 relative">
            <div className="mt-8">
              <DashboardCards />
            </div>
          <PieChartCard
            title="Application Progress Overview"
            description="This chart displays the distribution of total, pending, and approved applications."
            data={chart}
            config={chartConfig}
          />
          </div>
        </main>
      </div>
    </div>
  );
}

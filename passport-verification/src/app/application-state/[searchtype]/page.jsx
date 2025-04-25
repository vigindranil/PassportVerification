"use client";
import React from "react";
import { useEffect, useState } from "react";
import {
  DollarSign,
  Users,
  ShoppingCart,
  CircleDashed,
  FileStack,
  Clock,
  CheckCircle,
} from "lucide-react";
import { DashboardCard } from "@/components/reusable-dashboard-card";
import BackgroundImg from "@/assets/passport-bg.jpg";
import Image from "next/image";
import { getDistrictWiseCount } from "./api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DynamicChartCard } from "@/components/reusable-chart";

const searchTypeTitleMap = {
  0: "Total Applications District Wise",
  1: "Pending Applications District Wise",
  2: "Approved Applications District Wise",
};
const chartDescriptionMap = {
  0: "Visual breakdown of total applications submitted per district.",
  1: "Pending applications distribution across districts.",
  2: "Approved applications trend across districts.",
};
const description = {
  0: "Total application",
  1: "Total pending application",
  2: "Total approved application",
};
const icon = {
  0: FileStack,
  1: Clock,
  2: CheckCircle,
};
const color = {
  0: "bg-indigo-200",
  1: "bg-amber-200",
  2: "bg-emerald-200",
};

const page = ({ searchtype }) => {
  const [districtData, setDistrictData] = useState([]);
  useEffect(() => {
    const statusId = searchtype;
    const fetchDashboard = async () => {
      const response = await getDistrictWiseCount(statusId);
      setDistrictData(response?.data?.districtCount);
    };

    fetchDashboard();
  }, []);
  console.log("dist", districtData);
  const data = districtData.map((district) => ({
    label: district.DistrictName,
    Application:
      searchtype == 0
        ? district.TotalApplicationsByDistrict
        : searchtype == 1
        ? district.TotalPendingApplicationsByDistrict
        : searchtype == 2
        ? district.TotalApplicationsDoneByDistrict
        : 0,
  }));

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
          <div className="container mx-auto px-6 py-0 relative">
            <div className="mt-8">
              <Tabs defaultValue="count" className="w-full">
                <TabsList>
                  <TabsTrigger value="count">Count View</TabsTrigger>
                  <TabsTrigger value="chart">Analytics View</TabsTrigger>
                </TabsList>
                <TabsContent value="count">
                  <h1 className="text-xl font-semibold mb-4">
                    {searchTypeTitleMap[searchtype] || "Applications Overview"}
                  </h1>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {districtData.map((district) => {
                      let value = 0;

                      if (searchtype == 0) {
                        value = district.TotalApplicationsByDistrict ?? 0;
                      } else if (searchtype == 1) {
                        value =
                          district.TotalPendingApplicationsByDistrict ?? 0;
                      } else if (searchtype == 2) {
                        value = district.TotalApplicationsDoneByDistrict ?? 0;
                      }

                      return (
                        <DashboardCard
                          key={district.DistrictId}
                          header={district.DistrictName}
                          icon={icon[searchtype]}
                          data={value.toLocaleString()}
                          route={`/ps-wise-details/${searchtype}/${district.DistrictId}`}
                          color={color[searchtype]}
                          index={1}
                          // description={description[searchtype]}
                        />
                      );
                    })}
                  </div>
                </TabsContent>
                <TabsContent value="chart">
                  <h1 className="text-xl font-semibold mb-4">
                    {searchTypeTitleMap[searchtype] || "Applications Overview"}
                  </h1>
                  <DynamicChartCard
                    title="District wise analytics"
                    description={
                      chartDescriptionMap[searchtype] ||
                      "District-wise analytics data"
                    }
                    data={data}
                    dataKey="label"
                    chartConfig={{
                      Jan: { label: "January" },
                      Feb: { label: "February" },
                    }}
                    activeIndex={0}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default page;

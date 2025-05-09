"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import BackgroundImg from "@/assets/passport-bg.jpg";
import { Card, CardContent } from "@/components/ui/card";
import StateAdminReportDatatable from "@/components/state-admin-table";
export default function Dashboard() {

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
              <CardContent>
                <Card>
                  <StateAdminReportDatatable status={2} heading="Report" />
                </Card>
              </CardContent>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

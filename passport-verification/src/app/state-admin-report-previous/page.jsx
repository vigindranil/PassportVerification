"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import BackgroundImg from "@/assets/passport-bg.jpg";
import { Card, CardContent } from "@/components/ui/card";
import StateAdminReportDatatable from "@/components/state-admin-table1";
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
                  <StateAdminReportDatatable status={2} type="previous" heading="Previous Status Report" />
                </Card>
                {/* Note Card below the table */}
                <Card className="mt-6 bg-yellow-50 border-yellow-200 flex items-center" style={{ minHeight: '64px' }}>
                  <CardContent className="w-full flex items-center justify-start">
                    <div className="text-sm text-yellow-800">
                      <strong>Note:</strong>&nbsp;In case of application transfer, the data may vary.
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

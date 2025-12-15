"use client";

import React from "react";
import Image from "next/image";
import BackgroundImg from "@/assets/passport-bg.jpg";
import { Card, CardContent } from "@/components/ui/card";
import ApplicationStatusTable from "@/components/application-status";

export default function ApplicationStatusCheck() {
  return (
    <div className="flex h-full min-h-screen bg-gray-100">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 relative">
          <Image
            src={BackgroundImg}
            alt="Background Image"
            className="absolute inset-0 -z-10 object-cover opacity-10"
          />

          <div className="container mx-auto px-6 py-8 relative">
            <div className="mt-8">

              {/* Main Card */}
              <Card>
                <CardContent>
                  <ApplicationStatusTable heading="Application Status" />
                </CardContent>
              </Card>

              {/* Optional Note Card */}
              {/* 
              <Card className="mt-6 bg-yellow-50 border-yellow-200">
                <CardContent className="flex items-center min-h-[64px]">
                  <div className="text-sm text-yellow-800">
                    <strong>Note:</strong>&nbsp;In case of application transfer, the data may vary.
                  </div>
                </CardContent>
              </Card>
              */}

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

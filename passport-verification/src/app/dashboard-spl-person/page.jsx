"use client";

import React, { useEffect, useState } from "react";
import DashboardCards from "@/components/dashboardCard";
import Image from "next/image";
import BackgroundImg from "@/assets/passport-bg.jpg";
import { getStateDashBoard } from "./api";

import PieChartCard from "@/components/reusable-pie-chart";
import PoliceClearanceCertificate from "@/components/police-clearance-certificate";
import CrimeAcivityTableKolkataPolice from "@/components/crime-activity-verification-kolkata-police";
import CrimeAcivityTablePCC from "@/components/crime-activity-verification-pcc";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
export default function Dashboard() {
   const [applicationDetails, setApplicationDetails] = useState({
    ApplicantName: "",
    AadharNumber: "",
    FathersName: ""
   });
    const [isLoadingStatusHistrory, setIsLoadingStatusHistrory] = useState(true)
    const [isLoadingDocumentTable, setIsLoadingDocumentTable] = useState(true);
    const [isLoadingCriminalRecordFound, setIsLoadingCriminalRecordFound] = useState(false)
    const [isLoadingCriminalRecordNotFound, setIsLoadingCriminalRecordNotFound] = useState(false)
    const [kolkataPoliceSelectedRows, setKolkataPoliceSelectedRows] = useState([]);
    const [criminalRecordsRemark, setCriminalRecordsRemark] = useState("");
    const [cidSelectedRows, setCidSelectedRows] = useState([]);
  useEffect(() => {
  
    setIsLoadingStatusHistrory(false)
  }, []);


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
            <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden min-h-[200px]">
              <div className="bg-gradient-to-r from-violet-600 to-amber-600 px-6 py-3">
                <h2 className="text-2xl font-bold text-white">Criminal Activity Verification</h2>
              </div>
              {
                isLoadingStatusHistrory ?
                  <div className="space-y-2 w-full min-h-[200px] h-full py-10 flex justify-center items-baseline">
                    <div className="flex flex-col w-full min-h-[200px] text-center justify-center items-center text-gray-400">Loading...</div>
                  </div>
                  :
                  <>
                    {/* PCC Certificate */}
                    < PoliceClearanceCertificate applicant_details={applicationDetails} setApplicationDetails={setApplicationDetails} selectedRows={kolkataPoliceSelectedRows} setSelectedRows={setKolkataPoliceSelectedRows} />

                    {/* Kolkata Police Crime Records */}
                    < CrimeAcivityTableKolkataPolice applicant_details={applicationDetails} setApplicationDetails={setApplicationDetails} selectedRows={kolkataPoliceSelectedRows} setSelectedRows={setKolkataPoliceSelectedRows} />

                    {/* PCC Criminal Records */}
                    <CrimeAcivityTablePCC ApplicantName={applicationDetails?.ApplicantName} setApplicationDetails={setApplicationDetails} FathersName={applicationDetails?.FathersName} selectedRows={cidSelectedRows} setSelectedRows={setCidSelectedRows} />
                  </>

              }


            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

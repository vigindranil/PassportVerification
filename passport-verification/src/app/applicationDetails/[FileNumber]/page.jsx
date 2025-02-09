"use client"

import React, { useEffect, useState } from "react"
import Sidebar from '@/components/sidebar'
import Navbar from '@/components/navbar'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getDetailsApplicationId, getPccCrimeDetails } from "./api"
import moment, { isMoment } from "moment"
import DocumentTable from "@/components/document-table-component"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import ApplicationStatusHistory from "@/components/application-status-history"
import { Badge } from "@/components/ui/badge"
import CrimeAcivityTablePCC from "@/components/crime-activity-verification-pcc"
import CrimeAcivityTableKolkataPolice from "@/components/crime-activity-verification-kolkata-police"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function Page({ FileNumber }) {
  const [applicationDetails, setApplicationDetails] = useState(null);
  const [isLoadingStatusHistrory, setIsLoadingStatusHistrory] = useState(true)
  const [isLoadingDocumentTable, setIsLoadingDocumentTable] = useState(true);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const { toast } = useToast()

  const fetchData = async (ApplicationId) => {
    try {
      setIsLoadingStatusHistrory(true)
      setIsLoadingDocumentTable(true)
      const response = await getDetailsApplicationId(ApplicationId);
      console.log("Application Details Data:", response);
      setApplicationDetails(response?.data);
    } catch (e) {
      console.log("Error:", e);
    } finally {
      setIsLoadingStatusHistrory(false)
      setIsLoadingDocumentTable(false)
    }
  }


  useEffect(() => {
    console.log("FileNumber:", FileNumber);
    FileNumber && fetchData(FileNumber);
  }, [FileNumber, verificationSuccess]);


  return (
    <div className="flex bg-gray-100">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3">
                <h2 className="text-2xl font-bold text-white">Application Details</h2>
              </div>

              <Card className="m-5">
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                    <div className="space-y-2 my-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">File Number</span>
                        <span className="text-base">{applicationDetails?.applicationDetails?.FileNumber || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="space-y-2 my-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Applicant Name</span>
                        <span className="text-base">{applicationDetails?.applicationDetails?.ApplicantName || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="space-y-2 my-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Police Station Name</span>
                        <span className="text-base">{applicationDetails?.applicationDetails?.Ps_Name || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Gender</span>
                        <span className="text-base">{applicationDetails?.applicationDetails?.Gender || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Date Of Birth</span>
                        <span className="text-base">{applicationDetails?.applicationDetails?.DateOfBirth ? moment(applicationDetails?.applicationDetails?.DateOfBirth).format('DD/MM/YYYY') : 'N/A'}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Place Of Birth</span>
                        <span className="text-base">{applicationDetails?.applicationDetails?.PlaceOfBirth || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Spouse Name</span>
                        <span className="text-base">{applicationDetails?.applicationDetails?.SpouseName || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Fathers Name</span>
                        <span className="text-base">{applicationDetails?.applicationDetails?.FathersName || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">PV Initiation Date</span>
                        <span className="text-base">{applicationDetails?.applicationDetails?.PVInitiationDate || 'N/A' ? moment(applicationDetails?.applicationDetails?.PVInitiationDate).format('DD/MM/YYYY') : 'N/A'}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">PV Request Status</span>
                        <span className="text-base">{applicationDetails?.applicationDetails?.PVRequestStatus || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Permanent Address</span>
                        <span className="text-base">{applicationDetails?.applicationDetails?.PermanentAddress || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Verification Address</span>
                        <span className="text-base">{applicationDetails?.applicationDetails?.VerificationAddress || 'N/A'}</span>
                      </div>
                    </div>


                    <div className="space-y-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">PV Status Date</span>
                        <span className="text-base">{applicationDetails?.applicationDetails?.PVStatusDate || 'N/A' ? moment(applicationDetails?.applicationDetails?.PVStatusDate).format('DD/MM/YYYY') : 'N/A'}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">PV Sequence No</span>
                        <span className="text-base">{applicationDetails?.applicationDetails?.PVSequenceNo || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Email ID</span>
                        <span className="text-base">{applicationDetails?.applicationDetails?.EmailID || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Phone No.</span>
                        <span className="text-base">
                          {applicationDetails?.applicationDetails?.PhoneNo}
                        </span>
                      </div>
                    </div>

                  </div>
                </CardContent>
              </Card>
            </div>

            {(applicationDetails?.applicationDetails?.AadharVerifiedstatus !== null && applicationDetails?.applicationDetails?.AadharVerifiedstatus !== 0) && <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-600 to-yellow-300 px-6 py-3">
                <h2 className="text-2xl font-bold text-white">AADHAAR Details</h2>
              </div>

              <Card className="m-5">
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                    <div className="space-y-2 my-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Aadhaar Number</span>
                        <span className="text-base">{applicationDetails?.applicationDetails?.AadharNumber ? "XXXXXXXX" + atob(applicationDetails?.applicationDetails?.AadharNumber).slice(-4) : 'N/A'}</span>
                      </div>
                    </div>
                    <div className="space-y-2 my-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Aadhaar Name</span>
                        <span className="text-base">{applicationDetails?.applicationDetails?.AadharName || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="space-y-2 my-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Aadhaar Father Name</span>
                        <span className="text-base">{applicationDetails?.applicationDetails?.AadharFathername || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="space-y-2 my-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Aadhaar Address</span>
                        <span className="text-base">{applicationDetails?.applicationDetails?.AadharAddress || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Aadhaar Gender</span>
                        <span className="text-base">{applicationDetails?.applicationDetails?.AadharGender || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Date Of Birth</span>
                        <span className="text-base">{applicationDetails?.applicationDetails?.AadharDOB ? moment(applicationDetails?.applicationDetails?.DateOfBirth).format('DD/MM/YYYY') : 'N/A'}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Aadhaar Verified Status</span>
                        <span className="text-base">{applicationDetails?.applicationDetails?.AadharVerifiedstatus == 1 ? <Badge className="bg-emerald-400 hover:bg-emerald-400">matched</Badge> : <Badge className="bg-red-500 hover:bg-red-500">not machted</Badge>}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Aadhaar Verified By</span>
                        <span className="text-base">{applicationDetails?.applicationDetails?.AadharVerifiedby}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>}


            <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-600 to-violet-600 px-6 py-3">
                <h2 className="text-2xl font-bold text-white">Document(s) Uploaded for the Application</h2>
              </div>
              <DocumentTable fileNo={FileNumber} documents={applicationDetails?.documents} docPath={applicationDetails?.filepath} isLoadingDocumentTable={isLoadingDocumentTable} verificationSuccess={setVerificationSuccess} />
            </div>

            {/* Crime Activity Verification */}
            <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-violet-600 to-amber-600 px-6 py-3">
                <h2 className="text-2xl font-bold text-white">Criminal Activity Verification</h2>
              </div>

              {/* Kolkata Police Crime Records */}
              <CrimeAcivityTableKolkataPolice />

              {/* PCC Criminal Records */}
              <CrimeAcivityTablePCC />

              <div className="flex justify-center px-5 py-5 gap-2 flex-col">
                <div className="w-full">
                  <Textarea className="w-[60%] mx-auto border-2" placeholder="Enter any remarks (optional)"></Textarea>
                </div>
                <div className="w-full flex justify-center gap-2">

                  <Button variant="destructive" className="text-sm py-2 px-3 rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    onClick={() => console.log('test')
                    }>
                    Criminal Record(s) Found
                  </Button>
                  <Button variant="secondary" className="text-sm py-2 px-3 rounded-md shadow-sm border-2 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    onClick={() => console.log('test')
                    }>
                    Criminal Record Not Found
                  </Button>
                </div>
              </div>
            </div>

            <ApplicationStatusHistory status={applicationDetails?.status} isLoadingStatusHistrory={isLoadingStatusHistrory} />
          </div>
        </main>
      </div>
    </div>
  )
}


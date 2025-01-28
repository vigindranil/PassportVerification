"use client"

import React, { useEffect, useState } from "react"
import Sidebar from '@/components/sidebar'
import Navbar from '@/components/navbar'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getDetailsApplicationId } from "./api"
import moment, { isMoment } from "moment"
import DocumentTable from "@/components/document-table-component"


export default function Page({ FileNumber }) {
  const [applicationDetails, setApplicationDetails] = useState(null);

  const fetchData = async (ApplicationId) => {
    const response = await getDetailsApplicationId(ApplicationId);
    console.log("Application Details Data:", response);
    setApplicationDetails(response?.data);
  }

  useEffect(() => {
    console.log("FileNumber:", FileNumber);
    FileNumber && fetchData(FileNumber);
  }, [FileNumber]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <h2 className="text-2xl font-bold text-white">Application Details</h2>
          </div>

            <Card className="m-5">
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                  <div className="space-y-2 my-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">File Number</span>
                      <span className="text-base">{applicationDetails?.applicationDetails.FileNumber}</span>
                    </div>
                  </div>

                  <div className="space-y-2 my-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">Applicant Name</span>
                      <span className="text-base">{applicationDetails?.applicationDetails.ApplicantName}</span>
                    </div>
                  </div>

                  <div className="space-y-2 my-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">Police Station Name</span>
                      <span className="text-base">{applicationDetails?.applicationDetails.Ps_Name}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">Gender</span>
                      <span className="text-base">{applicationDetails?.applicationDetails.Gender}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">Date Of Birth</span>
                      <span className="text-base">{applicationDetails?.applicationDetails.DateOfBirth ? moment(applicationDetails?.applicationDetails.DateOfBirth).format('DD/MM/YYYY') : 'N/A'}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">Place Of Birth</span>
                      <span className="text-base">{applicationDetails?.applicationDetails.PlaceOfBirth}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">SpouseName</span>
                      <span className="text-base">{applicationDetails?.applicationDetails.SpouseName}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">FathersName</span>
                      <span className="text-base">{applicationDetails?.applicationDetails.FathersName}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">PVInitiationDate</span>
                      <span className="text-base">{applicationDetails?.applicationDetails.PVInitiationDate}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">PVRequestStatus</span>
                      <span className="text-base">{applicationDetails?.applicationDetails.PVRequestStatus}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">PermanentAddress</span>
                      <span className="text-base">{applicationDetails?.applicationDetails.PermanentAddress}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">VerificationAddress</span>
                      <span className="text-base">{applicationDetails?.applicationDetails.VerificationAddress}</span>
                    </div>
                  </div>


                  <div className="space-y-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">PVStatusDate</span>
                      <span className="text-base">{applicationDetails?.applicationDetails.PVStatusDate}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">PVSequenceNo</span>
                      <span className="text-base">{applicationDetails?.applicationDetails.PVSequenceNo}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">EmailID</span>
                      <span className="text-base">{applicationDetails?.applicationDetails.EmailID}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">PhoneNo</span>
                      <span className="text-base">
                        {applicationDetails?.applicationDetails.PhoneNo}
                      </span>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>
            </div>
            

            <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-6">
                <h2 className="text-2xl font-bold text-white">Application Document</h2>
              </div>
              <DocumentTable documents={applicationDetails?.documents} docPath={applicationDetails?.filepath} />
            </div>
            <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6">
                <h2 className="text-2xl font-bold text-white">Application Status</h2>
              </div>
              <div className="m-6">
                <Card>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Full Name</TableHead>
                            <TableHead>Application State</TableHead>
                            <TableHead>Updated Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {applicationDetails?.status?.map((stat, index) => (
                            <TableRow key={index}>
                              <TableCell>{stat?.FullName}</TableCell>
                              <TableCell>{stat?.ApplicationState}</TableCell>
                              <TableCell>{moment(stat?.ApplicationStateUpdatedDateTime).format('DD/MM/YYYY hh:mm:ss')}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}


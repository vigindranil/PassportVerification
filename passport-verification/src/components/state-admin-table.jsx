"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import * as XLSX from "xlsx"
import "jspdf-autotable"
import moment from "moment"
import { getApplicationCountMasterAdmin } from "@/app/state-admin-report-current/api"
import { getDistrict } from "@/app/createUserForm/api"
import { Label } from "./ui/label"

export default function StateAdminReportDatatable({ status, heading, type }) {
  const [selectedDetails, setSelectedDetails] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const itemsPerPage = 6
  const [isLoading, setIsLoading] = useState(true)
  const [verificationData, setVerificationData] = useState([])
  const [startDate, setStartDate] = useState(type == "previous" ? "2025-04-02" : null)
  const [endDate, setEndDate] = useState(null)
  const [districtId, setDistrictId] = useState(0)
  const [districtsData, setDistrictsData] = useState([])

  const fetchDistricts = async () => {
    try {
      const districtData = await getDistrict()
      if (districtData) {
        setDistrictsData(districtData.data)
      }
    } catch (error) {
      console.error("Error fetching districts:", error)
    }
  }

  // Skip filtering for now to ensure data displays
  // const filteredData = verificationData?.filter((row) =>
  //   Object.values(row)?.some((value) => value?.toString()?.toLowerCase()?.includes(searchTerm.toLowerCase())),
  // )

  // Use verification data directly
  const filteredData = verificationData || []

  const fetchApplicationStatus = async (districtId, start_date, end_date) => {
    try {
      setIsLoading(true)
      const response = await getApplicationCountMasterAdmin(districtId, start_date, end_date)

      console.log("Full API Response:", response)

      if (response && response.data && response.data.applicationCounts) {
        console.log("Application Counts:", response.data.applicationCounts)
        // Set the data directly from the API response
        setVerificationData(response.data.applicationCounts)
      } else {
        console.error("Invalid API response structure:", response)
        setVerificationData([])
      }
    } catch (error) {
      console.error("Error fetching application status:", error)
      setVerificationData([])
    } finally {
      setIsLoading(false)
    }
  }

  // Force refresh function
  const forceRefresh = () => {
    if (startDate == null || endDate == null) {
      fetchApplicationStatus(districtId, null, null)
    } else {
      const startDateFormatted = moment(startDate).format("YYYY-MM-DD")
      const endDateFormatted = moment(endDate).format("YYYY-MM-DD")
      fetchApplicationStatus(districtId, startDateFormatted, endDateFormatted)
    }
  }

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = filteredData.slice(startIndex, endIndex)

  useEffect(() => {
    fetchDistricts()
  }, [])

  useEffect(() => {
    if (startDate == null || endDate == null) {
      fetchApplicationStatus(districtId, null, null)
    } else {
      const startDateFormatted = moment(startDate).format("YYYY-MM-DD")
      const endDateFormatted = moment(endDate).format("YYYY-MM-DD")
      fetchApplicationStatus(districtId, startDateFormatted, endDateFormatted)
    }
  }, [districtId, startDate, endDate])

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Applications")
    XLSX.writeFile(wb, "report.xlsx")
  }

  return (
    <div className="mx-auto px-0 space-y-8 shadow-md">
      <div className="mt-0 bg-white dark:bg-gray-800 rounded-t-lg overflow-hidden">
        <div
          className={`bg-gradient-to-r ${status == 0 || status == 5 ? "from-green-600" : "from-green-600"} ${status == 0 || status == 5 ? "to-green-600" : "to-green-600"} px-6 py-3`}
        >
          <h2 className="text-2xl font-bold text-white">{heading}</h2>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-end mb-4">
          <div className="space-x-2 flex items-end justify-center">
            <div className="space-y-0 w-[150px]">
              <Label htmlFor="District">District</Label>
              <Select name="District" onValueChange={(value) => setDistrictId(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={0}>All Districts</SelectItem>
                  {districtsData?.map((dist, index) => (
                    <SelectItem key={index} value={dist?.districtId}>
                      {dist?.districtName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {type == "previous" && (
              <>
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    id="startDate"
                    value={startDate || ""}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-40"
                    disabled={true}
                  />
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <Input
                    type="date"
                    id="endDate"
                    value={endDate || ""}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-40"
                  />
                </div>
              </>
            )}
            {/* Refresh button */}
            <Button variant="outline" onClick={forceRefresh} className="ml-4">
              Refresh Data
            </Button>
          </div>
          <Button variant={"outline"} onClick={handleExportExcel}>
            Export Excel
          </Button>
        </div>


        <div className="border rounded-lg" id="police-verification-table">
          {type == "current" ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold text-center border-r-2">
                    <span className="text-blue-500">A</span>
                  </TableHead>
                  <TableHead className="font-semibold text-center border-r-2">
                    <span className="text-blue-500">B</span>
                  </TableHead>
                  <TableHead className="font-semibold text-center border-r-2">
                    <span className="text-blue-500">C</span>
                  </TableHead>
                  <TableHead className="font-semibold text-center border-r-2">
                    <span className="text-blue-500">D</span>
                  </TableHead>
                  <TableHead className="font-semibold text-center border-r-2">
                    <span className="text-blue-500">E</span>
                  </TableHead>
                  <TableHead className="font-semibold text-center border-r-2">
                    <span className="text-blue-500">F</span>
                  </TableHead>
                  <TableHead className="font-semibold text-center border-r-2">
                    <span className="text-blue-500">G</span>
                  </TableHead>
                  <TableHead className="font-semibold text-center border-r-2">
                    <span className="text-blue-500">H</span>
                  </TableHead>
                  <TableHead className="font-semibold text-center border-r-2">
                    <span className="text-blue-500">I</span>
                  </TableHead>
                  <TableHead className="font-semibold text-center border-r-2">
                    <span className="text-blue-500">J</span>
                  </TableHead>
                  <TableHead className="font-semibold text-center border-r-2">
                    <span className="text-blue-500">K</span>
                  </TableHead>
                  <TableHead className="font-semibold text-center border-r-2">
                    <span className="text-blue-500">L</span>
                  </TableHead>
                  <TableHead className="font-semibold text-center border-r-2">
                    <span className="text-blue-500">M</span>
                  </TableHead>
                </TableRow>
                <TableRow className="bg-[#e6f3ff]">
                  <TableHead className="font-semibold">Applications uploaded till date</TableHead>
                  <TableHead className="font-semibold">Applications Accepted</TableHead>
                  <TableHead className="font-semibold">
                    Applications pending to be accepted by the EO <br />
                    <span className="text-blue-500">(A-B)</span>
                  </TableHead>
                  <TableHead className="font-semibold">
                    Applications pending for more than 15 days to be accepted by the EO
                  </TableHead>
                  <TableHead className="font-semibold">Verified by EOs</TableHead>
                  <TableHead className="font-semibold">
                    Verification pending with EO <br />
                    <span className="text-blue-500">(B-E)</span>
                  </TableHead>
                  <TableHead className="font-semibold">Verified by OC/IC</TableHead>
                  <TableHead className="font-semibold">
                    Pending with OC/IC <br />
                    <span className="text-blue-500">(E-G)</span>
                  </TableHead>
                  <TableHead className="font-semibold">Approved/ Rejected by SP DIB/ DC SB </TableHead>
                  <TableHead className="font-semibold">Endorsed to Spl. EO by SP DIB/ DC SB </TableHead>
                  <TableHead className="font-semibold">
                    Pending with SP DIB / DC SB <br />
                    <span className="text-blue-500">(G-I-J)</span>
                  </TableHead>
                   <TableHead className="font-semibold">
                   Verification pending for more than 15 days from the date of receipt.
                  </TableHead>
                  <TableHead className="font-semibold">
                   Pending With EO for more than 10 days 
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(6)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="bg-slate-300 h-4 w-8" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="bg-slate-300 h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="bg-slate-300 h-4 w-36" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="bg-slate-300 h-4 w-28" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="bg-slate-300 h-4 w-24" />
                      </TableCell>
                      <TableCell className="text-center">
                        <Skeleton className="bg-slate-300 h-8 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="bg-slate-300 h-4 w-8" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="bg-slate-300 h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="bg-slate-300 h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="bg-slate-300 h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="bg-slate-300 h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="bg-slate-300 h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="bg-slate-300 h-4 w-32" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : verificationData && verificationData.length > 0 ? (
                  // Use the first item directly since we know there's only one item in the array
                  <TableRow>
                    <TableCell>{verificationData[0]["TotalApplication(A)"] || 0}</TableCell>
                    <TableCell>{verificationData[0]["ApplicationsAccepted(B)"] || 0}</TableCell>
                    <TableCell>{verificationData[0]["ApplicationspendingtobeacceptedbytheEO(C=(A-B))"] || 0}</TableCell>
                    <TableCell>{verificationData[0]["Last15DaysPendingApplications(D)"] || 0}</TableCell>
                    <TableCell>{verificationData[0]["EOComplete(E)"] || 0}</TableCell>
                    <TableCell>{verificationData[0]["EOStartedVerify(F=(B-E))"] || 0}</TableCell>
                    <TableCell>{verificationData[0]["OCComplete(G)"] || 0}</TableCell>
                    <TableCell>{verificationData[0]["OCPending(H=(E-G))"] || 0}</TableCell>
                    <TableCell>{verificationData[0]["SPDone(I)"] || 0}</TableCell>
                    <TableCell>{verificationData[0]["SEPending(J)"] || 0}</TableCell>
                    <TableCell>{verificationData[0]["SPPending(k=(G-I-J)"] || 0}</TableCell>
                    <TableCell>{verificationData[0]["Verification pending for more than 15 days from the date of receipt."] || 0}</TableCell>
                    <TableCell>{verificationData[0]["Pending With EO for more than 10 days"] || 0}</TableCell>
                  </TableRow>
                ) : (
                  <TableRow>
                    <TableCell colSpan={13} className="text-center">
                      No Data Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold text-center border-r-2">
                    <span className="text-blue-500">A</span>
                  </TableHead>
                  <TableHead className="font-semibold text-center border-r-2">
                    <span className="text-blue-500">B</span>
                  </TableHead>
                  <TableHead className="font-semibold text-center border-r-2">
                    <span className="text-blue-500">C</span>
                  </TableHead>
                  <TableHead className="font-semibold text-center border-r-2">
                    <span className="text-blue-500">D</span>
                  </TableHead>
                  <TableHead className="font-semibold text-center border-r-2">
                    <span className="text-blue-500">E</span>
                  </TableHead>
                  <TableHead className="font-semibold text-center border-r-2">
                    <span className="text-blue-500">F</span>
                  </TableHead>
                  <TableHead className="font-semibold text-center border-r-2">
                    <span className="text-blue-500">G</span>
                  </TableHead>
                  <TableHead className="font-semibold text-center border-r-2">
                    <span className="text-blue-500">H</span>
                  </TableHead>
                  <TableHead className="font-semibold text-center border-r-2">
                    <span className="text-blue-500">I</span>
                  </TableHead>
                  <TableHead className="font-semibold text-center border-r-2">
                    <span className="text-blue-500">J</span>
                  </TableHead>
                  
                </TableRow>
                <TableRow className="bg-[#e6f3ff]">
                  <TableHead className="font-semibold">Applications uploaded till date</TableHead>
                  <TableHead className="font-semibold">Applications Accepted</TableHead>
                  <TableHead className="font-semibold">
                    Applications pending to be accepted by the EO <br />
                    <span className="text-blue-500">(A-B)</span>
                  </TableHead>
                  <TableHead className="font-semibold">Verified by EOs</TableHead>
                  <TableHead className="font-semibold">
                    Verification pending with EO <br />
                    <span className="text-blue-500">(B-D)</span>
                  </TableHead>
                  <TableHead className="font-semibold">Verified by OC/IC</TableHead>
                  <TableHead className="font-semibold">
                    Pending with OC/IC <br />
                    <span className="text-blue-500">(D-F)</span>
                  </TableHead>
                  <TableHead className="font-semibold">Approved/ Rejected by SP DIB/ DC SB </TableHead>
                  <TableHead className="font-semibold">Endorsed to Spl. EO by SP DIB/ DC SB </TableHead>
                  <TableHead className="font-semibold">
                    Pending with SP DIB / DC SB <br />
                    <span className="text-blue-500">(F-H-I)</span>
                  </TableHead>
                 
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(6)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="bg-slate-300 h-4 w-8" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="bg-slate-300 h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="bg-slate-300 h-4 w-36" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="bg-slate-300 h-4 w-28" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="bg-slate-300 h-4 w-24" />
                      </TableCell>
                      <TableCell className="text-center">
                        <Skeleton className="bg-slate-300 h-8 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="bg-slate-300 h-4 w-8" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="bg-slate-300 h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="bg-slate-300 h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="bg-slate-300 h-4 w-32" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : verificationData && verificationData.length > 0 ? (
                  // Use the first item directly since we know there's only one item in the array
                  <TableRow>
                    <TableCell>{verificationData[0]["TotalApplication(A)"] || 0}</TableCell>
                    <TableCell>
                      {verificationData[0]["ApplicationsAcceptedEO(B)"] ||
                        verificationData[0]["ApplicationsAccepted(B)"] ||
                        0}
                    </TableCell>
                    <TableCell>
                      {verificationData[0]["TotalPendingApplications(c=(A-B))"] ||
                        verificationData[0]["ApplicationspendingtobeacceptedbytheEO(C=(A-B))"] ||
                        0}
                    </TableCell>
                    <TableCell>
                      {verificationData[0]["EOComplete(D)"] || verificationData[0]["EOComplete(E)"] || 0}
                    </TableCell>
                    <TableCell>
                      {verificationData[0]["EOStartedVerify(E=(B-D))"] ||
                        verificationData[0]["EOStartedVerify(F=(B-E))"] ||
                        0}
                    </TableCell>
                    <TableCell>
                      {verificationData[0]["OCComplete(F)"] || verificationData[0]["OCComplete(G)"] || 0}
                    </TableCell>
                    <TableCell>
                      {verificationData[0]["OCPending(G=(D-F))"] || verificationData[0]["OCPending(H=(E-G))"] || 0}
                    </TableCell>
                    <TableCell>{verificationData[0]["SPDone(H)"] || verificationData[0]["SPDone(I)"] || 0}</TableCell>
                    <TableCell>
                      {verificationData[0]["SEPending(I)"] || verificationData[0]["SEPending(J)"] || 0}
                    </TableCell>
                    <TableCell>
                      {verificationData[0]["SPPending(J=(F-H-I))"] || verificationData[0]["SPPending(k=(G-I-J)"] || 0}
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center">
                      No Data Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
        <div className="flex items-center justify-between mt-4 text-sm">
          <div>
            Showing {filteredData ? 1 : 0} to {filteredData ? Math.min(1, filteredData?.length) : 0} of{" "}
            {filteredData?.length || 0} entries
          </div>
        </div>
      </div>
    </div>
  )
}

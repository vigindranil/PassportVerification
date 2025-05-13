"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import "jspdf-autotable"
import moment from "moment"
import { getApplicationCountMasterAdmin } from "@/app/state-admin-report-current/api";
import { getDistrict } from "@/app/createUserForm/api";
import { Label } from "./ui/label";

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
      console.log(districtData)

      if (districtData) {
        console.log("districts", districtData.data)

        setDistrictsData(districtData.data)
      }
    } catch (error) {
      console.error("Error fetching districts:", error)
    }
  }

  const filteredData = verificationData?.filter((row) =>
    Object.values(row)?.some((value) => value?.toString()?.toLowerCase()?.includes(searchTerm.toLowerCase())),
  )

  const fetchApplicationStatus = async (districtId, start_date, end_date) => {
    try {
      setIsLoading(true)
      const response = await getApplicationCountMasterAdmin(districtId, start_date, end_date)
      setVerificationData(response?.data?.applicationCounts)
      console.log("raja", response?.data?.applicationCounts)
    } catch (error) {
      console.error("Error fetching application status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const totalPages = Math.ceil(filteredData?.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = filteredData?.slice(startIndex, endIndex)

  useEffect(() => {
    fetchDistricts()
  }, []);

  useEffect(() => {
    if (startDate == null || endDate == null) {
      fetchApplicationStatus(districtId, null, null);
    } else {
      const startDateFormatted = moment(startDate).format("YYYY-MM-DD")
      const endDateFormatted = moment(endDate).format("YYYY-MM-DD")
      fetchApplicationStatus(districtId, startDateFormatted, endDateFormatted);
    }

  }, [districtId, startDate, endDate]);


  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Applications")
    XLSX.writeFile(wb, "report.xlsx")
  }


  return (
    <div className="mx-auto px-0 space-y-8 shadow-md">
      <div className="mt-0 bg-white dark:bg-gray-800 rounded-t-lg overflow-hidden">
        <div className={`bg-gradient-to-r ${(status == 0 || status == 5) ? 'from-green-600' : 'from-green-600'} ${(status == 0 || status == 5) ? 'to-green-600' : 'to-green-600'} px-6 py-3`}>
          <h2 className="text-2xl font-bold text-white">{heading}</h2>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-end mb-4">
          <div className="space-x-2 flex items-end justify-center">
            {/* Date Range Picker */}
            {/* Start Date Input */}
            <div className="space-y-0 w-[150px]">
              <Label
                htmlFor="District"
              >
                District
              </Label>
              <Select
                name="District"
                onValueChange={(value) => setDistrictId(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={0}>
                    All Districts
                  </SelectItem>
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
          </div>
          {/* <Button variant={'outline'} onClick={handleExportPDF}>Export PDF</Button> */}
          {/* <Button variant={'outline'} onClick={handlePrint}>Print</Button> */}
          <Button variant={'outline'} onClick={handleExportExcel}>Export Excel</Button>
        </div>
        <div className="border rounded-lg" id="police-verification-table">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#e6f3ff]">
                <TableHead className="font-semibold">Total Applications (till date)</TableHead>
                <TableHead className="font-semibold">Applications pending to be accepted by the EO</TableHead>
                {(startDate == null && endDate == null) ? <TableHead className="font-semibold">Applications pending for more than 15 days to be accepted by the EO</TableHead> : null}
                <TableHead className="font-semibold">Accepted but verification pending with EO</TableHead>
                <TableHead className="font-semibold">Verified by EO</TableHead>
                <TableHead className="font-semibold">Verified by O/C IC</TableHead>
                <TableHead className="font-semibold">Pending with O/C IC</TableHead>
                <TableHead className="font-semibold">Verified by SP DIB / DC SB</TableHead>
                <TableHead className="font-semibold">Pending with SP DIB / DC SB</TableHead>
                <TableHead className="font-semibold">Pending with Spl. EO</TableHead>
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
                    {(startDate == null && endDate == null) ? <TableCell>
                      <Skeleton className="bg-slate-300 h-4 w-36" />
                    </TableCell>
                      : null}
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

                  </TableRow>
                ))
              ) : currentData?.length > 0 ? (
                currentData?.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row?.TotalApplication || 0}</TableCell>
                    <TableCell>{row?.TotalPendingApplications || 0}</TableCell>
                    {(startDate == null && endDate == null) ? <TableCell>{row?.Last15DaysPendingApplications || 0}</TableCell> : null }
                    <TableCell>{row?.EOStartedVerify || 0}</TableCell>
                    <TableCell>{row?.EOComplete || 0}</TableCell>
                    <TableCell>{row?.OCComplete || 0}</TableCell>
                    <TableCell>{row?.OCPending || 0}</TableCell>
                    <TableCell>{row?.SPDone || 0}</TableCell>
                    <TableCell>{row?.SPPending || 0}</TableCell>
                    <TableCell>{row?.SEPending || 0}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={13} className="text-center">
                    No Data Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between mt-4 text-sm">
          <div>
            Showing {filteredData ? startIndex + 1 : 0} to {filteredData ? Math.min(endIndex, filteredData?.length) : 0}{" "}
            of {filteredData?.length || 0} entries
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </Button>
            {Array?.from({ length: totalPages }, (_, i) => i + 1)?.map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}


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
import { Badge } from "./ui/badge"
import { Clock, ChevronLeft, ChevronRight, Search } from "lucide-react"
const tableHeaders = [
  { title: "Application Number", key: "ApplicationFileNumber" },
  { title: "Applicant Name", key: "ApplicantName" },
  { title: "Police Station", key: "PoliceStationName" },
  { title: "Application Initiated", key: "ApplicationInitiated" },
  { title: "EO Started", key: "EOStarted" },
  { title: "EO Complete/OC Pending", key: "EOCompleteOROCpending" },
  { title: "OC Complete/SP Pending", key: "OCompleteORSPpending" },
  { title: "Final Stage Completed", key: "FinalStageCompleted" }
]

const TrackApplicationTable = ({ data }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {tableHeaders.map((header) => (
              <TableHead key={header.key}>{header.title}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {tableHeaders.map((header) => (
                <TableCell key={header.key}>
                  {row[header.key] || <Badge variant="outline" className="bg-gray-50 text-amber-600 gap-1"><Clock size={12} /> pending</Badge>}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

import { getDistrict } from "@/app/createUserForm/api"
import { Label } from "./ui/label"
import { getApplicationTimeLine } from "@/app/track-applications/api"

export default function TrackApplicationReportDatatable({ status, heading }) {
  const [isLoading, setIsLoading] = useState(true)
  const [verificationData, setVerificationData] = useState([])
  const [districtsData, setDistrictsData] = useState([])
  const [districtId, setDistrictId] = useState(1)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState("")

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

  const fetchApplicationStatus = async (districtId, start_date, end_date) => {
    try {
      setIsLoading(true)
      const response = await getApplicationTimeLine(districtId, 0, start_date, end_date)

      if (response && response.data && response.data.timeline) {
        console.log("Application Timeline:", response.data.timeline)
        // Set the data from the timeline
        setVerificationData(response?.data?.timeline)
      } else {
        console.log("Invalid API response structure:", response)
        setVerificationData([])
      }
    } catch (error) {
      console.log("Error fetching application status:", error)
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

  // Filter data based on search query
  const filteredData = verificationData?.filter((item) => {
    if (!searchQuery) return true

    const searchLower = searchQuery.toLowerCase()
    return (
      (item.ApplicationFileNumber?.toLowerCase().includes(searchLower)) ||
      (item.ApplicantName?.toLowerCase().includes(searchLower)) ||
      (item.PoliceStationName?.toLowerCase().includes(searchLower))
    )
  }) || []

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = filteredData.slice(startIndex, endIndex)

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

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

            <Button variant="outline" onClick={forceRefresh} className="ml-4">
              Refresh Data
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Police Station"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-[250px]"
              />
            </div>
            <Button variant={"outline"} onClick={handleExportExcel}>
              Export Excel
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : (
          <>
            <div className="border rounded-lg" id="police-verification-table">
              <TrackApplicationTable data={currentData} />
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Rows per page:</span>
                <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                  <SelectTrigger className="w-[70px]">
                    <SelectValue placeholder={itemsPerPage} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-600">
                  Showing {filteredData.length > 0 ? startIndex + 1 : 0} to {Math.min(endIndex, filteredData.length)} of{" "}
                  {filteredData.length} entries
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

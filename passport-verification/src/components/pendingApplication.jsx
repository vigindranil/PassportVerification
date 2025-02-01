"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import "jspdf-autotable"
import { getApplicationStatus } from "@/app/totalPending/api"
import moment from "moment"
import { useRouter } from "next/navigation"

export default function PendingApplicationDatatable({ status, heading }) {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedDetails, setSelectedDetails] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const itemsPerPage = 6
  const [isLoading, setIsLoading] = useState(true)
  const [verificationData, setVerificationData] = useState([])
  const router = useRouter()

  const filteredData = verificationData?.filter((row) =>
    Object.values(row)?.some((value) => value?.toString()?.toLowerCase()?.includes(searchTerm.toLowerCase())),
  )

  const fetchApplicationStatus = async () => {
    try {
      setIsLoading(true)
      const response = await getApplicationStatus(status, 15)
      setVerificationData(response?.data)
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
    fetchApplicationStatus()
  }, [status])

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Applications")
    XLSX.writeFile(wb, "applications.xlsx")
  }

  const handleExportPDF = () => {
    const doc = new jsPDF()
    doc.autoTable({
      head: [["File Number", "Applicant Name", "Police Station", "Phone No.", "Date of Birth"]],
      body: filteredData.map((row) => [
        row.FileNumber,
        row.ApplicantName,
        row.PsName,
        row.PhoneNo,
        moment(row.DateOfBirth).format("DD/MM/YYYY"),
      ]),
    })
    doc.save("applications.pdf")
  }

  const handlePrint = () => {
    const printContent = document.getElementById("police-verification-table")
    const windowPrint = window.open("", "", "left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0")
    windowPrint.document.write(printContent.innerHTML)
    windowPrint.document.close()
    windowPrint.focus()
    windowPrint.print()
    windowPrint.close()
  }

  return (
    <div className="container mx-auto px-0 space-y-8 shadow-2xl">
      <div className="mt-0 bg-white dark:bg-gray-800 rounded-t-xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6">
          <h2 className="text-2xl font-bold text-white">{heading}</h2>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between mb-4">
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <div className="space-x-2">
            <Button onClick={handleExportExcel}>Export Excel</Button>
            <Button onClick={handleExportPDF}>Export PDF</Button>
            <Button onClick={handlePrint}>Print</Button>
          </div>
        </div>
        <div className="border rounded-lg" id="police-verification-table">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#e6f3ff]">
                <TableHead className="font-semibold">File Number</TableHead>
                <TableHead className="font-semibold">Applicant Name</TableHead>
                <TableHead className="font-semibold">Police Station</TableHead>
                <TableHead className="font-semibold">Phone No.</TableHead>
                <TableHead className="font-semibold whitespace-nowrap">Date of Birth</TableHead>
                <TableHead className="font-semibold text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(6)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="bg-slate-300 h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="bg-slate-300 h-4 w-32" />
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
                  </TableRow>
                ))
              ) : currentData?.length > 0 ? (
                currentData?.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.FileNumber}</TableCell>
                    <TableCell>{row.ApplicantName}</TableCell>
                    <TableCell>{row.PsName}</TableCell>
                    <TableCell>{row.PhoneNo}</TableCell>
                    <TableCell>{row.DateOfBirth ? moment(row.DateOfBirth).format("DD/MM/YYYY") : "N/A"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1"
                          onClick={() => router.push(`/applicationDetails/${row.FileNumber}`)}
                        >
                          Details
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No Data Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div>
            Showing {startIndex + 1} to {Math.min(endIndex, filteredData?.length)} of {filteredData?.length} entries
          </div>
          <div className="space-x-2">
            <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
              Previous
            </Button>
            <span>
              {currentPage} of {totalPages}
            </span>
            <Button
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


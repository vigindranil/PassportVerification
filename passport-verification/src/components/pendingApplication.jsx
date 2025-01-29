"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import "jspdf-autotable"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { getApplicationStatus } from "@/app/totalPending/api"
import moment from "moment"
import { useRouter } from "next/navigation"

export default function PendingApplicationDatatable({status, heading}) {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedDetails, setSelectedDetails] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const itemsPerPage = 6
  const [applicationStatus, setApplicationStatus] = useState(null)
  const [verificationData, setVerificationData] = useState([])
  const router = useRouter()

  const filteredData = verificationData?.filter((row) =>
    Object?.values(row)?.some((value) => value?.toString()?.toLowerCase()?.includes(searchTerm.toLowerCase())),
  )

  const fetchApplicationStatus = async () => {
    try {
      const response = await getApplicationStatus(status, 15)
      console.log("akash", response);
      
      setVerificationData(response?.data)
    } catch (error) {
      console.error("Error fetching application status:", error)
    }
  }

  const totalPages = Math.ceil(filteredData?.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = filteredData?.slice(startIndex, endIndex)

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(verificationData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "VerificationData")
    XLSX.writeFile(wb, "police_verification_data.xlsx")
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    doc.autoTable({
      head: [["File Number", "Applicant Name", "Police Station", "Phone No.", "Date of Birth"]],
      body: verificationData?.map((row) => [
        row.FileNumber,
        row.ApplicantName,
        row.Ps_Name,
        row.PhoneNo,
        row.DateOfBirth,
      ]),
    })
    doc.save("police_verification_data.pdf")
  }

  const printTable = () => {
    const printContent = document.getElementById("police-verification-table")
    const windowPrint = window.open("", "", "left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0")
    windowPrint.document.write(printContent.innerHTML)
    windowPrint.document.close()
    windowPrint.focus()
    windowPrint.print()
    windowPrint.close()
  }

  useEffect(() => {
    fetchApplicationStatus()
  }, [searchTerm]) // Added searchTerm as a dependency

  return (
    <div className="container mx-auto px-0 space-y-8 shadow-2xl">
      <div className="mt-0 bg-white dark:bg-gray-800 rounded-t-xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6">
          <h2 className="text-2xl font-bold text-white">{heading}</h2>
        </div>
      </div>
      <div className="p-6">
        {isDetailsModalOpen && selectedDetails && (
          <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Application Details</DialogTitle>
              </DialogHeader>
              <DialogDescription className="space-y-2">
                These are the details of the passport application.
              </DialogDescription>
              <div className="space-y-2">
                <ul>
                  <li className="text-sm">
                    <span className="font-bold text-md">PV Sequence:</span> {selectedDetails.PVSequenceNo}
                  </li>
                  <li className="text-sm">
                    <span className="font-bold text-md">File Number:</span> {selectedDetails.FileNumber}
                  </li>
                  <li className="text-sm">
                    <span className="font-bold text-md">Email ID:</span> {selectedDetails.EmailID}
                  </li>
                  <li className="text-sm">
                    <span className="font-bold text-md">Applicant Name:</span> {selectedDetails.ApplicantName}
                  </li>
                  <li className="text-sm">
                    <span className="font-bold text-md">Police Station:</span> {selectedDetails.Ps_Name}
                  </li>
                  <li className="text-sm">
                    <span className="font-bold text-md">Phone No:</span> {selectedDetails.PhoneNo}
                  </li>
                  <li className="text-sm">
                    <span className="font-bold text-md">Spouse Name:</span> {selectedDetails.SpouseName}
                  </li>
                  <li className="text-sm">
                    <span className="font-bold text-md">Address:</span> {selectedDetails.VerificationAddress}
                  </li>
                  <li className="text-sm">
                    <span className="font-bold text-md">Gender:</span> {selectedDetails.Gender}
                  </li>
                  <li className="text-sm">
                    <span className="font-bold text-md">Place Of Birth:</span> {selectedDetails.PlaceOfBirth}
                  </li>
                </ul>
              </div>
            </DialogContent>
          </Dialog>
        )}
        <div className="flex items-center justify-between mb-6">
          <div className="space-x-2">
            <Button variant="outline" onClick={exportToExcel}>
              Excel
            </Button>
            <Button variant="outline" onClick={exportToPDF}>
              PDF
            </Button>
            <Button variant="outline" onClick={printTable}>
              Print
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Search:</span>
            <Input
              className="w-64"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
              { currentData?.length > 0 ?
              currentData?.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.FileNumber}</TableCell>
                  <TableCell>{row.ApplicantName}</TableCell>
                  <TableCell>{row.Ps_Name}</TableCell>
                  <TableCell>{row.PhoneNo}</TableCell>
                  <TableCell>{row.DateOfBirth ? moment(row.DateOfBirth).format("DD/MM/YYYY") : "N/A"}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="default"
                        className="bg-green-600 hover:bg-green-700 text-white text-xs px-1 py-1"
                        onClick={() => router.push(`/applicationDetails/${row.FileNumber}`)}
                      >
                        Details
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )): 
              <TableRow>
                <TableCell colSpan={6} className="text-center">No Data Found</TableCell>
                </TableRow>}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between mt-4 text-sm">
          <div>
            Showing {startIndex + 1} to {Math.min(endIndex, filteredData?.length)} of {filteredData?.length} entries
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)?.map((page) => (
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


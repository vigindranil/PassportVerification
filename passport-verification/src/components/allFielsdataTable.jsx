"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import "jspdf-autotable"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { FileAcceptModal } from "./file-accept-modal"
import { acceptApplication } from "@/app/allFiles/api"

export default function PoliceVerificationTable() {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isFileAcceptModalOpen, setIsFileAcceptModalOpen] = useState(false)
  const [selectedDetails, setSelectedDetails] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const itemsPerPage = 6

  const verificationData = [
    {
      pvSequence: "WB19230092353",
      fileNumber: "CA20759892055523",
      status: "Initiated",
      applicantName: "NIDHI FOGLA",
      policeStation: "TILJALA",
      phoneNo: "9836263700",
      dateOfBirth: "1985-10-17",
    },
    {
      pvSequence: "WB19230092354",
      fileNumber: "CA20759892061223",
      status: "Initiated",
      applicantName: "SHUBHANGI SARKAR",
      policeStation: "TILJALA",
      phoneNo: "9810662126",
      dateOfBirth: "2007-01-03",
    },
    {
      pvSequence: "WB19230092355",
      fileNumber: "CA20759891039223",
      status: "SP Approved",
      applicantName: "MIR ANWAR HOSSAIN",
      policeStation: "TILJALA",
      phoneNo: "6290268459",
      dateOfBirth: "1973-01-21",
    },
    {
      pvSequence: "WB19230092356",
      fileNumber: "CA01CS102660923",
      status: "SP Not Approved",
      applicantName: "AVIK KARAK",
      policeStation: "TILJALA",
      phoneNo: "9830043440",
      dateOfBirth: "1977-04-27",
    },
    {
      pvSequence: "WB19230092357",
      fileNumber: "CA20759892369223",
      status: "Initiated",
      applicantName: "SONU LAL",
      policeStation: "TILJALA",
      phoneNo: "8910735797",
      dateOfBirth: "1990-04-17",
    },
    {
      pvSequence: "WB19230092358",
      fileNumber: "CA01CS102336523",
      status: "SP Not Approved",
      applicantName: "KALA PATEL",
      policeStation: "TILJALA",
      phoneNo: "7980544903",
      dateOfBirth: "1972-11-22",
    },
  ]

  const filteredData = verificationData.filter((row) =>
    Object.values(row).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = filteredData.slice(startIndex, endIndex)

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
      body: verificationData.map((row) => [
        row.fileNumber,
        row.applicantName,
        row.policeStation,
        row.phoneNo,
        row.dateOfBirth,
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

  const handleAcceptFile = async (applicationId, citizentype, file) => {
    console.log(`applicationId: ${applicationId}`)
    console.log(`citizentype: ${citizentype}`)
    console.log(`file: ${file}`)
    // Implement the logic for accepting the file
    const response = await acceptApplication(applicationId, citizentype, file);
    console.log('reponse:', response);
  }

  const handleViewPPAttachment = (fileNumber) => {
    console.log(`Viewing PP Attachment for file ${fileNumber}`)
    // Implement the logic for viewing the PP attachment
    // This could open a new window or modal with the attachment
  }

  return (
    <>
    <div className="container mx-auto px-0 space-y-8 shadow-2xl">
      <div className="mt-0 bg-white dark:bg-gray-800 rounded-t-xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6">
          <h2 className="text-2xl font-bold text-white">User Management</h2>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-b-xl">
        <div className="p-6">
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
                {currentData.map((row) => (
                  <TableRow key={row.pvSequence}>
                    <TableCell>{row.fileNumber}</TableCell>
                    <TableCell>{row.applicantName}</TableCell>
                    <TableCell>{row.policeStation}</TableCell>
                    <TableCell>{row.phoneNo}</TableCell>
                    <TableCell>{row.dateOfBirth}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-green-600 hover:bg-green-700 text-white text-xs px-1 py-1"
                          onClick={() => {
                            setSelectedDetails(row)
                            setIsDetailsModalOpen(true)
                          }}
                        >
                          Details
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-1 py-1"
                          onClick={() => {
                            setSelectedDetails(row)
                            setIsFileAcceptModalOpen(true)
                          }}
                        >
                          Accept File
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-1 py-1"
                          onClick={() => handleViewPPAttachment(row.fileNumber)}
                        >
                          View PP Attachment
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between mt-4 text-sm">
            <div>
              Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} entries
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
          {isDetailsModalOpen && selectedDetails && (
            <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>File Details</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  <div className="space-y-2">
                    <div>
                      <li className="list-none">PV Sequence: {selectedDetails.pvSequence}</li>
                    </div>
                    <div>
                      <li className="list-none">File Number: {selectedDetails.fileNumber}</li>
                    </div>
                    <div>
                      <li className="list-none">Status: {selectedDetails.status}</li>
                    </div>
                    <div>
                      <li className="list-none">Applicant Name: {selectedDetails.applicantName}</li>
                    </div>
                    <div>
                      <li className="list-none">Police Station: {selectedDetails.policeStation}</li>
                    </div>
                    <div>
                      <li className="list-none">Phone No: {selectedDetails.phoneNo}</li>
                    </div>
                    <div>
                      <li className="list-none">Date of Birth: {selectedDetails.dateOfBirth}</li>
                    </div>
                  </div>
                </DialogDescription>
              </DialogContent>
            </Dialog>
          )}
          {isFileAcceptModalOpen && selectedDetails && (
            <FileAcceptModal
              isOpen={isFileAcceptModalOpen}
              onClose={() => setIsFileAcceptModalOpen(false)}
              fileData={selectedDetails}
              onAccept={handleAcceptFile}
            />
          )}
        </div>
      </div>
      </div>
    </>
  )
}


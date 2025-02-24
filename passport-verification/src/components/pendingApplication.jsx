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
import { CheckCircle2, CircleCheckBig, CircleX, Cross, FileUser } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { ToastAction } from "./ui/toast"
import Cookies from "react-cookies";
import { FileAcceptModal } from "./approve-reject-modal"
import { TransferModal } from "@/components/transferModal"
import { updateEnquiryStatus } from "@/app/acceptedAndVerificationPending-eo/api"

export default function PendingApplicationDatatable({ status, heading, period, flag }) {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedDetails, setSelectedDetails] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const itemsPerPage = 6
  const [isLoading, setIsLoading] = useState(true)
  const [verificationData, setVerificationData] = useState([])
  const router = useRouter()
  const user_role = Cookies.load('type');
  const [isFileAcceptModalOpen, setIsFileAcceptModalOpen] = useState(false)
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [type, setType] = useState("reject");

  const filteredData = verificationData?.filter((row) =>
    Object.values(row)?.some((value) => value?.toString()?.toLowerCase()?.includes(searchTerm.toLowerCase())),
  )

  const fetchApplicationStatus = async () => {
    try {
      setIsLoading(true)
      const response = await getApplicationStatus(status, period || 30)
      setVerificationData(response?.data)
    } catch (error) {
      console.error("Error fetching application status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteVerification = async (applicationId, remarks="Recommend for Apporval") => {
    try {
      // Implement the logic for accepting the file
      const response = await updateEnquiryStatus(applicationId, remarks);
      console.log('reponse:', response);

      if (response?.status == 0) {
        await fetchApplicationStatus();
        toast({
          title: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>Successfull!</span>
            </div>
          ),
          description: response?.message,
          action: <ToastAction altText="Try again">Close</ToastAction>,
        })
      } else {
        toast({
          variant: "destructive",
          title: "Failed to update status!",
          description: response?.message,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
      }
    } catch (e) {
      console.log('Error:', e);
      toast({
        variant: "destructive",
        title: "Failed to update status!",
        description: 'An error occurred',
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
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
      head: [["File Number", "Applicant Name", "Police Station", "Phone No.", "Verification Address"]],
      body: filteredData.map((row) => [
        row.FileNumber,
        row.ApplicantName,
        row.PsName,
        row.PhoneNo,
        row.VerificationAddress,
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

  const handleOpenTransferModal = () => {
    setIsTransferModalOpen(true)
  }

  const handleCloseTransferModal = () => {
    setIsTransferModalOpen(false)
  }

  const handleTransfer = () => {
    onTransfer(selectedDetails, remarks, selectedDistrict, selectedPoliceStation)
    setRemarks("")
    setSelectedDistrict("")
    setSelectedPoliceStation("")
  }

  return (
    <div className="mx-auto px-0 space-y-8 shadow-md">
      <div className="mt-0 bg-white dark:bg-gray-800 rounded-t-lg overflow-hidden">
        <div className={`bg-gradient-to-r ${(status == 0 || status == 5) ? 'from-green-600' : 'from-green-600'} ${(status == 0 || status == 5) ? 'to-green-600' : 'to-green-600'} px-6 py-3`}>
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
            <Button variant={'outline'} onClick={handleExportExcel}>Export Excel</Button>
            {/* <Button variant={'outline'} onClick={handleExportPDF}>Export PDF</Button>
            <Button variant={'outline'} onClick={handlePrint}>Print</Button> */}
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
                <TableHead className="font-semibold whitespace-nowrap">Verification Address</TableHead>
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
                    <TableCell>{row?.FileNumber || 'N/A'}</TableCell>
                    <TableCell>{row?.ApplicantName || 'N/A'}</TableCell>
                    <TableCell>{row?.PsName || 'N/A'}</TableCell>
                    <TableCell>{row?.PhoneNo || 'N/A'}</TableCell>
                    <TableCell>{row?.VerificationAddress || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <div className="relative group">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-stone-100 ring-[0.5px] ring-slate-300 text-blue-700 hover:bg-blue-400 hover:text-slate-700 text-xs px-[0.65rem] py-0 rounded-full flex gap-1"
                            onClick={() => router.push(`/applicationDetails/${row.FileNumber}`)}
                          >
                            <FileUser className="m-0 p-0" />
                          </Button>
                          <span className="absolute left-1/2 -top-11 -translate-x-1/2 scale-0 bg-white shadow-md text-slate-500 text-xs rounded px-2 py-1 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200">
                            View Application
                          </span>
                        </div>
                        {(user_role == 40 && flag == "eo-accepted-file") && 
                        <>
                        <div className="relative group">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-stone-100 ring-[0.5px] ring-slate-300 text-green-700 hover:bg-green-400 hover:text-slate-700 text-xs px-[0.65rem] py-0 rounded-full flex gap-1"
                            onClick={() => {
                              setType('approve')
                              setIsFileAcceptModalOpen(true)
                              setSelectedDetails(row.FileNumber)
                            }}
                          >
                            <CircleCheckBig className="mx-0 px-0" />
                          </Button>
                          <span className="absolute left-1/2 -top-11 -translate-x-1/2 scale-0 bg-white shadow-md text-slate-500 text-xs rounded px-2 py-1 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200">
                            Recommend Application
                          </span>
                        </div>
                        <div className="relative group">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-stone-100 ring-[0.5px] ring-slate-300 text-red-700 hover:bg-red-400 hover:text-slate-700 text-xs px-[0.65rem] py-0 rounded-full flex gap-1"
                            onClick={() => {
                              setType('reject')
                              setIsFileAcceptModalOpen(true)
                              setSelectedDetails(row.FileNumber)
                            }}
                          >
                            <CircleX className="mx-0 px-0" />
                          </Button>
                          <span className="absolute left-1/2 -top-11 -translate-x-1/2 scale-0 bg-white shadow-md text-slate-500 text-xs rounded px-2 py-1 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200">
                            Not Recommend
                          </span>
                        </div>
                        </>
                        }
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
        <div className="flex items-center justify-between mt-4 text-sm">
        <div>
            Showing {filteredData ? startIndex + 1 : 0} to {filteredData ? Math.min(endIndex, filteredData.length) : 0}{" "}
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
        {isFileAcceptModalOpen && selectedDetails && (
          <FileAcceptModal
            isOpen={isFileAcceptModalOpen}
            onClose={() => setIsFileAcceptModalOpen(false)}
            applicationId={selectedDetails}
            onAccept={handleCompleteVerification}
            type={type}
          />
        )}
      </div>
    </div>
  )
}


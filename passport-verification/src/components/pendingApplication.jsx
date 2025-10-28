"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import "jspdf-autotable"
import { getApplicationStatus, getApplicationStatusV3, revokeEnquiryStatus } from "@/app/totalPending/api"
import moment from "moment"
import { useRouter } from "next/navigation"
import { CheckCircle2, CircleCheckBig, CircleX, Cross, FileCheck, FileUser, Forward, Rotate3d, RotateCcw, X } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { ToastAction } from "./ui/toast"
import Cookies from "react-cookies";
import { FileAcceptModal } from "./approve-reject-modal"
import { updateEnquiryStatus } from "@/app/acceptedAndVerificationPending-eo/api"
import { transferapplication } from "@/app/allFiles-sp/api"

export default function PendingApplicationDatatable({ status, heading, period, flag, last15DaysPending }) {
  const [selectedDetails, setSelectedDetails] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const itemsPerPage = 6
  const [isLoading, setIsLoading] = useState(true)
  const [verificationData, setVerificationData] = useState([])
  const [remarks, setRemarks] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedPoliceStation, setSelectedPoliceStation] = useState("");
  const router = useRouter()
  const user_role = Cookies.load('type');
  const [isFileAcceptModalOpen, setIsFileAcceptModalOpen] = useState(false)
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [type, setType] = useState("reject");
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  const filteredData = verificationData?.filter(row => {
    // Check if searchTerm is of format: key=value
    const match = searchTerm?.match(/^(\w+)\s*=\s*(.+)$/);

    if (match) {
      const [, key, value] = match;
      return row?.[key]?.toString()?.toLowerCase()?.includes(value.toLowerCase());
    } else {
      // Default global search across all fields
      return Object.values(row).some(value =>
        value?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }
  });

  const fetchApplicationStatus = async (status_id, start_date, end_date) => {
    try {
      setIsLoading(true)
      let response = null;
      if (last15DaysPending) {
        response = await getApplicationStatus(status_id, period)
      } else {
        response = await getApplicationStatusV3(status_id, start_date, end_date)
      }
      setVerificationData(response?.data)
    } catch (error) {
      console.error("Error fetching application status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteVerification = async (applicationId, type, remarks) => {
    try {
      // Implement the logic for accepting the file
      let response = null;
      if (type == "revoke") {
        response = await revokeEnquiryStatus(applicationId, remarks);
      } else {
        response = await updateEnquiryStatus(applicationId, remarks, type);
      }
      console.log('reponse:', response);

      if (response?.status == 0) {
        await fetchApplicationStatus(status, null, null);
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
    if (startDate == null || endDate == null) {
      fetchApplicationStatus(status, null, null);
    } else {
      const startDateFormatted = moment(startDate).format("YYYY-MM-DD")
      const endDateFormatted = moment(endDate).format("YYYY-MM-DD")
      fetchApplicationStatus(status, startDateFormatted, endDateFormatted);
    }

  }, [status, startDate, endDate]);

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Applications")
    XLSX.writeFile(wb, "applications.xlsx")
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
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />

          <div className="space-x-2 flex items-end justify-center">
            {/* Date Range Picker */}
            {/* Start Date Input */}
            {!last15DaysPending && <div>
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
            }

            {/* End Date Input */}
            {!last15DaysPending && <div>
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
            </div>}
            <Button variant={'outline'} onClick={handleExportExcel}>Export Excel</Button>
            {/* <Button variant={'outline'} onClick={handleExportPDF}>Export PDF</Button>
            <Button variant={'outline'} onClick={handlePrint}>Print</Button> */}
          </div>
        </div>
        <div className="border rounded-lg" id="police-verification-table">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#e6f3ff]">
                <TableHead className="font-semibold">Sl. No.</TableHead>
                <TableHead className="font-semibold">File Number</TableHead>
                <TableHead className="font-semibold">Applicant Name</TableHead>
                <TableHead className="font-semibold">Police Station</TableHead>
                <TableHead className="font-semibold">Phone No.</TableHead>
                <TableHead className="font-semibold whitespace-nowrap">Verification Address</TableHead>
                {status != 45 && <TableHead className="font-semibold text-center">Actions</TableHead>}
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
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row?.FileNumber || 'N/A'}</TableCell>
                    <TableCell>{row?.ApplicantName || 'N/A'}</TableCell>
                    <TableCell>{row?.PsName || 'N/A'}</TableCell>
                    <TableCell>{row?.PhoneNo || 'N/A'}</TableCell>
                    <TableCell>{row?.VerificationAddress || 'N/A'}</TableCell>
                    {status != 45 && <TableCell>
                      <div className="flex space-x-1">
                        <div className="relative group">
                          <Button
                            size="sm"
                            variant="outline"
                            className="hover:bg-blue-500 ring-[0.5px] ring-slate-300 hover:text-white bg-blue-200 text-blue-700 text-sm px-[0.65rem] py-0 rounded-full flex gap-1"
                            onClick={() => router.push(`/applicationDetails/${row.FileNumber}?ActiveStatusId=${row?.ApplicationStatus == 60 ? 0 : 1}`)}
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
                                className="hover:bg-green-500 ring-[0.5px] ring-slate-300 hover:text-white bg-green-200 text-green-700 text-sm px-[0.65rem] py-0 rounded-full flex gap-1"
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
                                className="hover:bg-red-500 ring-[0.5px] ring-slate-300 hover:text-white bg-red-200 text-red-700 text-sm px-[0.65rem] py-0 rounded-full flex gap-1"
                                onClick={() => {
                                  setType('reject')
                                  setIsFileAcceptModalOpen(true)
                                  setSelectedDetails(row.FileNumber)
                                }}
                              >
                                <X className="mx-0 px-0" />
                              </Button>
                              <span className="absolute left-1/2 -top-11 -translate-x-1/2 scale-0 bg-white shadow-md text-slate-500 text-xs rounded px-2 py-1 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200">
                                Not Recommend
                              </span>
                            </div>
                          </>
                        }
                        {(user_role == 40 && flag == "eo-accepted-file") &&
                          <>
                            <div className="relative group">
                              <Button
                                size="sm"
                                variant="outline"
                                className="hover:bg-violet-500 ring-[0.5px] ring-slate-300 hover:text-white bg-violet-200 text-violet-700 text-sm px-[0.65rem] py-0 rounded-full flex gap-1"
                                onClick={() => {
                                  setType('forward-sp')
                                  setIsFileAcceptModalOpen(true)
                                  setSelectedDetails(row.FileNumber)
                                }}
                              >
                                <Forward className="mx-0 px-0" />
                              </Button>
                              <span className="absolute left-1/2 -top-11 -translate-x-1/2 scale-0 bg-white shadow-md text-slate-500 text-xs rounded px-2 py-1 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200">
                                Forward to SP
                              </span>
                            </div>
                          </>
                        }
                        {/* {(user_role == 10) &&
                          <div className="relative group">
                            <Button
                              size="sm"
                              variant="default"
                              className="hover:bg-teal-500 ring-[0.5px] ring-slate-300 hover:text-white bg-teal-200 text-teal-700 text-sm px-[0.65rem] py-0 rounded-full flex gap-1"
                              onClick={handleOpenTransferModal}
                            >
                              <Rotate3d className="mx-0 px-0" />
                            </Button>
                            <span className="absolute left-1/2 -top-11 -translate-x-1/2 scale-0 bg-white shadow-md text-slate-500 text-xs rounded px-2 py-1 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200">
                              Transfer to PS
                            </span>
                            <TransferModal
                              isOpen={isTransferModalOpen}
                              onClose={handleCloseTransferModal}
                              fileNumber={row?.FileNumber}
                              applicantName={row?.ApplicantName}
                              onTransfer={onTransfer} // Pass the function here
                            />
                          </div>
                        } */}
                        {(user_role == 10 && status == 2) && (
                          <div className="relative group">
                            <Button
                              size="sm"
                              variant="default"
                              className="hover:bg-yellow-500 ring-[0.5px] ring-slate-300 hover:text-white bg-yellow-200 text-yellow-700 text-sm px-[0.65rem] py-0 rounded-full flex gap-1"
                              onClick={() => {
                                setType("revoke")
                                setIsFileAcceptModalOpen(true)
                                setSelectedDetails(row?.FileNumber)
                              }}
                            >
                              <RotateCcw className="mx-0 px-0" />
                            </Button>
                            <span className="absolute left-1/2 -top-11 -translate-x-1/2 scale-0 bg-white shadow-md text-slate-500 text-xs rounded px-2 py-1 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200">
                              Revoke Application
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    }
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


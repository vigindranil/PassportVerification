"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileAcceptModal } from "@/components/file-accept-modal"
import UploadDocumentsModal from "@/components/uploadDocumentModal"
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Badge } from "./ui/badge";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

export default function DataTable({ data }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [acceptedFiles, setAcceptedFiles] = useState([]);
  const [uploadFile, setUploadFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false)
  const openDialog = () => setIsOpen(true)
  const closeDialog = () => setIsOpen(false)
  const itemsPerPage = 10;

  const handleAcceptFile = (fileNumber) => {
    setAcceptedFiles((prev) => [...prev, fileNumber]);
  };

  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "VerificationData");
    XLSX.writeFile(wb, "police_verification_data.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['File Number', 'Applicant Name', 'Police Station', 'Phone No.', 'Date of Birth']],
      body: data.map(row => [row['File Number'], row['Applicant Name'], row['Police Station'], row['Phone No.'], row['Date of Birth']]),
    });
    doc.save('police_verification_data.pdf');
  };

  const printTable = () => {
    const printContent = document.getElementById('police-verification-table');
    const windowPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
    windowPrint.document.write(printContent.innerHTML);
    windowPrint.document.close();
    windowPrint.focus();
    windowPrint.print();
    windowPrint.close();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="space-x-2">
          <Button variant="outline" onClick={exportToExcel}>Excel</Button>
          {/* <Button variant="outline" onClick={exportToPDF}>PDF</Button>
          <Button variant="outline" onClick={printTable}>Print</Button> */}
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
              <TableHead className="font-semibold">PV Sequence No.</TableHead>
              <TableHead className="font-semibold">File Number</TableHead>
              <TableHead className="font-semibold">Applicant Name</TableHead>
              <TableHead className="font-semibold">Police Station</TableHead>
              <TableHead className="font-semibold">Phone No.</TableHead>
              <TableHead className="font-semibold">Date of Birth</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length > 0 ?
              currentData?.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row['PV Sequence No.']}</TableCell>
                  <TableCell>{row['File Number']}</TableCell>
                  <TableCell>{row['Applicant Name']}</TableCell>
                  <TableCell>{row['Police Station']}</TableCell>
                  <TableCell>{row['Phone No.']}</TableCell>
                  <TableCell>{row['Date of Birth']}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700 text-white text-xs px-1 py-1" onClick={openDialog}>Details</Button>
                      <Dialog open={isOpen} onOpenChange={closeDialog}>
                        <DialogContent className="sm:max-w-[80%]">
                          <DialogHeader>
                            <DialogTitle>File Details</DialogTitle>
                            <DialogDescription>Information</DialogDescription>
                          </DialogHeader>
                          <div className="">
                            <div className="grid grid-cols-2">
                              <div><b>Applicant Name:</b> {row['Applicant Name']}</div>
                              <div><b>DPHq ID/Name:</b> {row['DPHq ID/Name']}</div>
                              <div><b>Date of Birth:</b> {row['Date of Birth']}</div>
                              <div><b>E-mail ID:</b> {row['E-mail ID']}</div>
                              <div><b>Father's Name:</b> {row["Father's Name"]}</div>
                              <div><b>File Number:</b> {row['File Number']}</div>
                              <div><b>Gender:</b> {row['Gender']}</div>
                              <div><b>PV Initiation Date:</b> {row['PV Initiation Date']}</div>
                              <div><b>PV Request ID:</b> {row['PV Request ID']}</div>
                            </div>
                            <div className="grid grid-cols-2">
                              <div><b>PV Request Status:</b> {row['PV Request Status']}</div>
                              <div><b>PV Sequence No.:</b> {row['PV Sequence No.']}</div>
                              <div><b>PV Status Date:</b> {row['PV Status Date']}</div>
                              <div><b>Phone No.:</b> {row['Phone No.']}</div>
                              <div><b>Place of Birth:</b> {row['Place of Birth']}</div>
                              <div><b>Police Station:</b> {row['Police Station']}</div>
                              <div><b>Spouse Name:</b> {row['Spouse Name']}</div>
                              <div><b>Sr. No.:</b> {row['Sr. No.']}</div>
                              <div><b>PV Sequence No. :</b>{row['PV Sequence No.'] && row['PV Sequence No.']}</div>
                              <div><b>Verification Address:</b> {row['Verification Address']}</div>
                              <div><b>Permanent Address:</b> {row['Permanent Address']}</div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              )) : <TableRow>
                <TableCell colSpan={7} className="text-center">No records. Please upload a file</TableCell>
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
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
      {selectedFile && (
        <FileAcceptModal
          isOpen={true}
          onClose={() => setSelectedFile(null)}
          fileData={selectedFile}
          onAccept={handleAcceptFile}
        />
      )}
      {uploadFile && (
        <UploadDocumentsModal
          isOpen={true}
          onClose={() => setUploadFile(null)}
          fileData={uploadFile}
        />
      )}
    </div>
  )
}


"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import moment from "moment";
import { getPccCrimeDetails } from "@/app/applicationDetails/[FileNumber]/api";
import { Eye, MapPin } from "lucide-react";
import { VisuallyHidden } from "./ui/visually-hidden";

const SkeletonLoader = () => (
  <>
    {[...Array(3)].map((_, index) => (
      <TableRow key={index}>
        {[...Array(7)].map((_, i) => (
          <TableCell key={i}>
            <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
);

const CrimeAcivityTablePCC = () => {
  const [crimeData, setCrimeData] = useState([]);
  const [isLoadingPccRecords, setIsLoadingPccRecords] = useState(false);
  const [pccInput, setPccInput] = useState({ fname: "", lname: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchPccCrimeDetails = async (fname, lname) => {
    try {
      setIsLoadingPccRecords(true);
      const response = await getPccCrimeDetails(fname, lname);
      setCrimeData(response?.data?.Arrest || []);
      setCurrentPage(1); // Reset to first page on new search
    } catch (e) {
      console.log("Error:", e);
    } finally {
      setIsLoadingPccRecords(false);
    }
  };

  const totalPages = Math.ceil(crimeData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = crimeData.slice(startIndex, endIndex);

  return (
    <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
      <div className="m-3">
        <h1 className="text-xl font-bold text-zinc-500">C.I.D Criminal Records</h1>
        <hr className="my-2" />
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center my-2">
            <Input
              type="text"
              placeholder="Enter First Name"
              className="ring-0 border-gray-300 rounded-md w-32 p-2"
              onChange={(e) => setPccInput({ ...pccInput, fname: e.target.value })}
            />
            <Input
              type="text"
              placeholder="Enter Last Name"
              className="active:ring-0 focus:outline-none border-gray-300 rounded-md ml-4 w-32 p-2"
              onChange={(e) => setPccInput({ ...pccInput, lname: e.target.value })}
            />
            <Button
              variant="secondary"
              className="mx-2 text-slate-700 hover:bg-zinc-200 shadow-sm border-2"
              onClick={() => fetchPccCrimeDetails(pccInput?.fname || "", pccInput?.lname || "")}
            >
              Search
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-100 hover:bg-slate-100">
                    <TableHead>First Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>Locality</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead>Police Station</TableHead>
                    <TableHead>Case Ref. No.</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingPccRecords ? (
                    <SkeletonLoader />
                  ) : currentData.length > 0 ? (
                    currentData.map((crimeDetail, index) => (
                      <TableRow key={index}>
                        <TableCell>{crimeDetail?.FirstName || 'N/A'}</TableCell>
                        <TableCell>{crimeDetail?.LastName || 'N/A'}</TableCell>
                        <TableCell>{crimeDetail?.locality || 'N/A'}</TableCell>
                        <TableCell>{crimeDetail?.distName || 'N/A'}</TableCell>
                        <TableCell>{crimeDetail?.psName || 'N/A'}</TableCell>
                        <TableCell>{crimeDetail?.case_ref_id || 'N/A'}</TableCell>
                        <TableCell>
                          <button
                            className="flex bg-blue-100 justify-center items-center p-1 m-1 px-2 rounded-md hover:bg-blue-200 text-sm"
                            onClick={() => {
                              setSelectedDetails(crimeDetail)
                              setIsModalOpen(true)
                            }}
                          >
                            <Eye className="text-blue-600 mr-2 h-4 w-4" />
                            View
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">No Record(s) Found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {isModalOpen && (
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogContent className="w-full">
                    <VisuallyHidden>
                      <DialogTitle>Case Details</DialogTitle>
                    </VisuallyHidden>
                    <div className="space-y-2 h-full w-full px-5">
                      <h1 className="text-center text-slate-500 font-bold text-xl mb-10 underline">Case Details</h1>
                      {selectedDetails &&
                        <div>
                          {selectedDetails?.FirstName && <div><span className='font-bold'>First Name:</span> <span>{selectedDetails?.FirstName}</span></div>}
                          {selectedDetails?.LastName && <div><span className='font-bold'>Last Name:</span> <span>{selectedDetails?.LastName}</span></div>}
                          {selectedDetails?.Gender && <div><span className='font-bold'>Gender:</span> <span>{selectedDetails?.Gender}</span></div>}
                          {selectedDetails?.gurdainName && <div><span className='font-bold'>Gurdain Name:</span> <span>{selectedDetails?.gurdainName}</span></div>}
                          {selectedDetails?.alias && <div><span className='font-bold'>Nickname(alias):</span> <span>{selectedDetails?.alias}</span></div>}
                          {selectedDetails?.locality && <div><span className='font-bold'>Locality:</span> <span>{selectedDetails?.locality}</span></div>}
                          {selectedDetails?.psName && <div><span className='font-bold'>Police Station:</span> <span>{selectedDetails?.psName}</span></div>}
                          {selectedDetails?.distName && <div><span className='font-bold'>District:</span> <span>{selectedDetails?.distName}</span></div>}
                          {selectedDetails?.arrestDate && <div><span className='font-bold'>Arrest Date:</span> <span>{selectedDetails?.arrestDate}</span></div>}
                          {selectedDetails?.caseDetails && <div><span className='font-bold'>Case Details:</span> <span>{selectedDetails?.caseDetails}</span></div>}
                          {selectedDetails?.case_ref_id && <div><span className='font-bold'>Case Ref. ID:</span> <span>{selectedDetails?.case_ref_id}</span></div>}
                          {selectedDetails?.case_no && <div><span className='font-bold'>Case No.:</span> <span>{selectedDetails?.case_no}</span></div>}
                          {selectedDetails?.case_year && <div><span className='font-bold'>Case Year:</span> <span>{selectedDetails?.case_year}</span></div>}
                        </div>
                      }
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {!isLoadingPccRecords && totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 p-3">
                <span className="text-sm text-gray-500">
                  Showing {startIndex + 1} to {Math.min(endIndex, crimeData.length)} of {crimeData.length} entries
                </span>
                <div className="flex items-center flex-wrap mx-3 gap-1">
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CrimeAcivityTablePCC;

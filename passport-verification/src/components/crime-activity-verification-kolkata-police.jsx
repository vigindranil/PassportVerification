"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import moment from "moment";
import { getPccCrimeDetails } from "@/app/applicationDetails/[FileNumber]/api";

const SkeletonLoader = () => (
  <>
    {[...Array(3)].map((_, index) => (
      <TableRow key={index}>
        {[...Array(6)].map((_, i) => (
          <TableCell key={i}>
            <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
);

const CrimeAcivityTableKolkataPolice = () => {
  const [crimeData, setCrimeData] = useState([]);
  const [isLoadingPccRecords, setIsLoadingPccRecords] = useState(false);
  const [pccInput, setPccInput] = useState({ fname: "", lname: "" });

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
        <h1 className="text-xl font-bold text-zinc-500">Kolkata Police Criminal Records</h1>
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
                    <TableHead>Case Ref. No.</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Father's Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>FATHERNAME</TableHead>
                    <TableHead>CASEYEAR</TableHead>
                    <TableHead>ARREST_DATE</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingPccRecords ? (
                    <SkeletonLoader />
                  ) : currentData.length > 0 ? (
                    currentData.map((crimeDetail, index) => (
                      <TableRow key={index}>
                        <TableCell>{crimeDetail?.PROV_CRM_NO}</TableCell>
                        <TableCell>{crimeDetail?.NAME}</TableCell>
                        <TableCell>{crimeDetail?.FATHERNAME}</TableCell>
                        <TableCell>{crimeDetail?.ADDRESS}</TableCell>
                        <TableCell>{crimeDetail?.FATHERNAME}</TableCell>
                        <TableCell>{crimeDetail?.CASEYEAR}</TableCell>
                        <TableCell>{crimeDetail?.ARREST_DATE}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">No Data Found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
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

export default CrimeAcivityTableKolkataPolice;

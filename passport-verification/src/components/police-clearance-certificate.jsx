"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import moment from "moment";
import { getKolkataPoliceCriminalRecordSearchv4, getPCCApplicationDetails, getPccCrimeDetails } from "@/app/applicationDetails/[FileNumber]/api";
import DateRangePicker from "./date-range-picker";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "./ui/visually-hidden";
import { AlertCircle, CheckCircle2, Eye } from "lucide-react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import Cookies from "react-cookies";

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

const PoliceClearanceCertificate = ({ selectedRows, setSelectedRows, setApplicationDetails=null, applicant_details=null }) => {
 
  const [pccData, setPccData] = useState(null);
  const [isLoadingPccRecords, setIsLoadingPccRecords] = useState(false);

  const fetchPccData = async () => {
    try {
      console.log("applicant_details", applicant_details);
      
      setIsLoadingPccRecords(true);
      const response = await getPCCApplicationDetails(applicant_details?.ApplicantName, setApplicationDetails ? applicant_details?.AadharNumber?.slice(-4) : atob(applicant_details?.AadharNumber)?.slice(-4));

      setPccData(response || null);
      console.log(response?.data);
      

    } catch (e) {
      console.log("Error:", e);
    } finally {
      setIsLoadingPccRecords(false);
    }
  };


  return (
    <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
      <div className="m-3">
        <h1 className="text-xl font-bold text-zinc-500">Police Clearance Certificate</h1>
        <hr className="my-2" />
        <div className="flex items-center justify-center mb-6 flex-col">
          <div className="flex flex-wrap items-end gap-y-2 w-full my-4 px-14">
            <div className="w-1/3 px-3">
              <Label className="text-zinc-500">Applicant Name</Label>
              {setApplicationDetails && (
                  <Input
                    type="text"
                    placeholder="Enter First Name (required)"
                    className="ring-0 border-gray-300 rounded-md w-full p-2"
                    value={applicant_details?.ApplicantName}
                    readOnly={false}
                    onChange={e => setApplicationDetails(prev => ({ ...prev, ApplicantName: e.target.value }))}
                  />
                )}
                {!setApplicationDetails && (
                  <Input
                    type="text"
                    placeholder="Enter First Name (required)"
                    className="ring-0 border-gray-300 rounded-md w-full p-2"
                    value={applicant_details?.ApplicantName}
                    readOnly={true}
                  />
                )}
              
            </div>
            <div className="w-1/3 px-3">
              <Label className="text-zinc-500">Aadhaar Number</Label>
              {setApplicationDetails && (
              <Input
                type="text"
                placeholder="Enter First Name (required)"
                className="ring-0 border-gray-300 rounded-md w-full p-2"
                value={applicant_details?.AadharNumber}
                readOnly={false}
                onChange={e => setApplicationDetails(prev => ({ ...prev, AadharNumber: e.target.value }))}
              />
              )}
              {!setApplicationDetails && (
              <Input
                type="text"
                placeholder="Enter First Name (required)"
                className="ring-0 border-gray-300 rounded-md w-full p-2"
                value={applicant_details?.AadharNumber ? `XXXXXXXX${atob(applicant_details?.AadharNumber).slice(-4)}` : ""}
                readOnly={true}
              />
              )}
            </div>



          <Button
            variant="secondary"
            disabled={isLoadingPccRecords}
            className="mx-2 text-slate-700 hover:bg-zinc-200 shadow-sm border-2"
            onClick={() => fetchPccData()}
          >
            {isLoadingPccRecords ? 'Searching...' : 'Search PCC Details'}
          </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            {pccData && <div className="border-1 min-h-[100px] bg-slate-50">
             <h1 className="text-center font-bold text-slate-500 py-2 flex justify-center gap-1">{pccData?.data != null ? <CheckCircle2 className="text-green-500"/> : <AlertCircle className="text-amber-500"/>}{pccData?.message}</h1>
          
              {pccData?.data ? <div className="container py-5">
                <div className="row">
                  <div className="col-md-4 flex text-sm items-center flex-col">
                    <div className="flex flex-col gap-2">
                      <span><b>PCC Status:</b> {pccData?.data?.AuthorityApproveStatus}</span>
                      <span><b>Remarks:</b> {pccData?.data?.AuthorityApprovalRemarks}</span>
                      <span><b>Authority Approve (Date):</b> {pccData?.data?.AuthorityApproveOn}</span>
                      <span><b>Udin Number:</b> {pccData?.data?.UdinNo || "Certificate Not Generated"}</span>
                    </div>
                  </div>
                </div>
              </div> : <span className="flex justify-center text-sm">No PCC certificate has generated with this name and aadhaar</span>}
            </div>}


          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PoliceClearanceCertificate;
